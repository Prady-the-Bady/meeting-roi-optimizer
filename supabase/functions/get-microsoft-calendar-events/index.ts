
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const userRes = await supabaseAdmin.auth.getUser(
      req.headers.get("Authorization")!.replace("Bearer ", "")
    );
    if (userRes.error) throw userRes.error;
    const user = userRes.data.user;

    const microsoftIdentity = user.identities?.find(
      (i) => i.provider === "azure"
    );
    if (!microsoftIdentity) {
      throw new Error("Microsoft identity not found for this user.");
    }
    
    const accessToken = microsoftIdentity.identity_data?.access_token;
    if (!accessToken) {
      throw new Error("Microsoft access token not found.");
    }

    const now = new Date();
    const future = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    const calendarViewUrl = `https://graph.microsoft.com/v1.0/me/calendarview?startdatetime=${now.toISOString()}&enddatetime=${future.toISOString()}&$orderby=start/dateTime&$top=10`;

    const graphResponse = await fetch(calendarViewUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (!graphResponse.ok) {
        const errorData = await graphResponse.json();
        console.error("Microsoft Graph API error:", errorData);
        throw new Error(errorData.error?.message || 'Failed to fetch calendar events from Microsoft.');
    }

    const data = await graphResponse.json();
    
    const events = data.value.map((event: any) => ({
      id: event.id,
      summary: event.subject,
      start: event.start,
      end: event.end,
      attendees: event.attendees.map((a: any) => ({ email: a.emailAddress.address })),
      hangoutLink: event.onlineMeeting?.joinUrl,
    }));

    return new Response(JSON.stringify({ events }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in get-microsoft-calendar-events function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
