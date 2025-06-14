
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Validate environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");

    if (!supabaseUrl || !supabaseKey || !stripeKey) {
      logStep("ERROR: Missing required environment variables");
      return new Response(JSON.stringify({ error: "Server configuration error" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    logStep("Environment variables verified");

    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      logStep("ERROR: No authorization header provided");
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const token = authHeader.replace("Bearer ", "");
    if (!token || token.length < 10) {
      logStep("ERROR: Invalid token format");
      return new Response(JSON.stringify({ error: "Invalid authentication token" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) {
      logStep("ERROR: User not authenticated");
      return new Response(JSON.stringify({ error: "User not authenticated" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    logStep("User authenticated", { userId: user.id, email: user.email });

    // Validate and parse request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (e) {
      logStep("ERROR: Invalid JSON in request body");
      return new Response(JSON.stringify({ error: "Invalid request format" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const { plan } = requestBody;
    logStep("Plan requested", { plan });

    // Validate plan parameter
    if (!plan || !['premium', 'enterprise'].includes(plan)) {
      logStep("ERROR: Invalid plan specified", { plan });
      return new Response(JSON.stringify({ error: "Invalid plan specified. Must be 'premium' or 'enterprise'" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Check for existing customer with proper error handling
    let customers;
    try {
      customers = await stripe.customers.list({ email: user.email, limit: 1 });
    } catch (stripeError: any) {
      logStep("ERROR: Failed to fetch customer from Stripe", { error: stripeError.message });
      return new Response(JSON.stringify({ error: "Payment service error" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      logStep("Creating new customer");
    }

    // Define pricing with validation
    let priceData;
    if (plan === 'premium') {
      priceData = {
        currency: "usd",
        product_data: { 
          name: "Premium Subscription",
          description: "Advanced analytics, AI insights, and premium features"
        },
        unit_amount: 2900, // $29.00
        recurring: { interval: "month" },
      };
    } else if (plan === 'enterprise') {
      priceData = {
        currency: "usd",
        product_data: { 
          name: "Enterprise Subscription",
          description: "Full feature access, team management, and enterprise support"
        },
        unit_amount: 9900, // $99.00
        recurring: { interval: "month" },
      };
    }

    // Validate origin header
    const origin = req.headers.get("origin") || req.headers.get("referer");
    if (!origin) {
      logStep("WARNING: No origin header found, using fallback");
    }

    const baseUrl = origin || "https://meetingroi-pro.lovable.app";
    logStep("Creating checkout session", { baseUrl, plan });

    try {
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        customer_email: customerId ? undefined : user.email,
        line_items: [
          {
            price_data: priceData,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${baseUrl}/dashboard?success=true`,
        cancel_url: `${baseUrl}/dashboard?canceled=true`,
        metadata: {
          user_id: user.id,
          user_email: user.email,
          plan: plan,
        },
        // Add security and UX improvements
        allow_promotion_codes: true,
        billing_address_collection: 'auto',
        payment_method_types: ['card'],
        subscription_data: {
          metadata: {
            user_id: user.id,
            plan: plan,
          },
        },
      });

      logStep("Checkout session created successfully", { sessionId: session.id, url: session.url });

      // Validate session URL before returning
      if (!session.url || !session.url.startsWith('https://checkout.stripe.com/')) {
        logStep("ERROR: Invalid checkout URL generated");
        return new Response(JSON.stringify({ error: "Failed to generate valid checkout URL" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }

      return new Response(JSON.stringify({ url: session.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } catch (stripeError: any) {
      logStep("Stripe checkout error", { 
        message: stripeError.message,
        type: stripeError.type,
        code: stripeError.code
      });

      // Handle specific Stripe configuration errors
      if (stripeError.message.includes("account or business name")) {
        return new Response(JSON.stringify({ 
          error: "Stripe account setup incomplete. Please complete your business profile in the Stripe Dashboard.",
          stripeSetupRequired: true
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }

      if (stripeError.type === 'invalid_request_error') {
        return new Response(JSON.stringify({ 
          error: "Invalid payment configuration. Please contact support.",
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }

      throw stripeError;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage, stack: error instanceof Error ? error.stack : undefined });
    return new Response(JSON.stringify({ 
      error: "Internal server error",
      details: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
