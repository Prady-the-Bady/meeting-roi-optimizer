
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

    // Check environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");

    if (!supabaseUrl || !supabaseKey || !stripeKey) {
      throw new Error("Missing required environment variables");
    }

    logStep("Environment variables verified");

    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const requestBody = await req.json();
    const { plan } = requestBody;
    logStep("Plan requested", { plan });

    if (!plan || !['premium', 'enterprise'].includes(plan)) {
      throw new Error("Invalid plan specified. Must be 'premium' or 'enterprise'");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      logStep("Creating new customer");
    }

    // Define pricing based on plan
    let priceData;
    if (plan === 'premium') {
      priceData = {
        currency: "usd",
        product_data: { name: "Premium Subscription" },
        unit_amount: 2900, // $29.00
        recurring: { interval: "month" },
      };
    } else if (plan === 'enterprise') {
      priceData = {
        currency: "usd",
        product_data: { name: "Enterprise Subscription" },
        unit_amount: 9900, // $99.00
        recurring: { interval: "month" },
      };
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";
    logStep("Creating checkout session", { origin, plan });

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
        success_url: `${origin}/dashboard?success=true`,
        cancel_url: `${origin}/dashboard?canceled=true`,
        metadata: {
          user_id: user.id,
          user_email: user.email,
          plan: plan,
        },
      });

      logStep("Checkout session created", { sessionId: session.id, url: session.url });

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

      // Check for specific Stripe configuration errors
      if (stripeError.message.includes("account or business name")) {
        return new Response(JSON.stringify({ 
          error: "Stripe account setup incomplete. Please set your business name in Stripe Dashboard at https://dashboard.stripe.com/account",
          stripeSetupRequired: true
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }

      throw stripeError;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage, stack: error instanceof Error ? error.stack : undefined });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
