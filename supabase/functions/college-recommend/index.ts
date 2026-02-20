import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { percentile, stream, location, budget, matchedColleges } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const budgetLabel: Record<string, string> = {
      under1: "under ₹1L per year",
      "1to3": "₹1L–₹3L per year",
      "3to5": "₹3L–₹5L per year",
      "5plus": "₹5L+ per year",
    };

    const locationLabel = location === "Any" ? "any location across India" : location;
    const budgetText = budgetLabel[budget] ?? budget;
    const collegeList =
      matchedColleges.length > 0
        ? matchedColleges.join(", ")
        : "no colleges matched your criteria";

    const systemPrompt = `You are a friendly and knowledgeable college counselor for Indian engineering and management programs.
You help students understand their college options based on their academic profile.
Your tone is encouraging, clear, and professional. Keep your response to 3–4 sentences.`;

    const userPrompt = `A student has a percentile of ${percentile}, prefers ${stream} in ${locationLabel}, with a budget of ${budgetText}.
We found ${matchedColleges.length} matching college(s): ${collegeList}.
Write a personalized explanation about why these colleges are good matches for the student's profile and what they should consider when making their decision. If no colleges matched, suggest how they can broaden their search.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(
        JSON.stringify({ error: "AI service error. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("college-recommend error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
