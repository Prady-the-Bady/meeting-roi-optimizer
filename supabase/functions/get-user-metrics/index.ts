
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: "Authentication failed" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const userId = userData.user.id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get current month meetings
    const { data: currentMonthMeetings, error: currentError } = await supabaseClient
      .from("meetings")
      .select("*")
      .eq("user_id", userId)
      .gte("created_at", startOfMonth.toISOString());

    // Get last month meetings for comparison
    const { data: lastMonthMeetings, error: lastError } = await supabaseClient
      .from("meetings")
      .select("*")
      .eq("user_id", userId)
      .gte("created_at", startOfLastMonth.toISOString())
      .lte("created_at", endOfLastMonth.toISOString());

    if (currentError || lastError) {
      throw new Error("Failed to fetch meetings data");
    }

    // Calculate metrics
    const currentMonthCost = currentMonthMeetings?.reduce((sum, meeting) => sum + Number(meeting.total_cost), 0) || 0;
    const lastMonthCost = lastMonthMeetings?.reduce((sum, meeting) => sum + Number(meeting.total_cost), 0) || 0;
    const costChange = lastMonthCost > 0 ? ((currentMonthCost - lastMonthCost) / lastMonthCost) * 100 : 0;

    const currentMonthCount = currentMonthMeetings?.length || 0;
    const lastMonthCount = lastMonthMeetings?.length || 0;
    const countChange = lastMonthCount > 0 ? ((currentMonthCount - lastMonthCount) / lastMonthCount) * 100 : 0;

    const totalHours = currentMonthMeetings?.reduce((sum, meeting) => sum + (meeting.duration / 3600), 0) || 0;
    const avgDuration = currentMonthCount > 0 ? totalHours / currentMonthCount : 0;

    // Calculate efficiency (inverse relationship with cost per participant per hour)
    const avgCostPerHour = totalHours > 0 ? currentMonthCost / totalHours : 0;
    const efficiency = Math.max(10, Math.min(100, 100 - (avgCostPerHour / 10)));

    // Calculate potential savings (based on meeting optimization opportunities)
    const potentialSavings = currentMonthMeetings?.reduce((savings, meeting) => {
      let meetingSavings = 0;
      if (meeting.duration > 1800) meetingSavings += Number(meeting.total_cost) * 0.2; // 20% savings for long meetings
      if (meeting.participants > 6) meetingSavings += Number(meeting.total_cost) * 0.15; // 15% savings for large meetings
      return savings + meetingSavings;
    }, 0) || 0;

    // Get recent meetings for activity feed
    const { data: recentMeetings } = await supabaseClient
      .from("meetings")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(3);

    return new Response(JSON.stringify({
      thisMonth: {
        cost: currentMonthCost,
        costChange: costChange,
        meetings: currentMonthCount,
        meetingChange: countChange,
        totalHours: totalHours,
        efficiency: Math.round(efficiency),
        potentialSavings: potentialSavings
      },
      recentMeetings: recentMeetings || []
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in get-user-metrics:", error);
    return new Response(JSON.stringify({ 
      error: "Internal server error",
      details: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
