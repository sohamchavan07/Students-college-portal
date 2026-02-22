const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  // ✅ Handle preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      percentile,
      stream,
      location,
      budget,
      matchedColleges,
    } = await req.json();

    const prompt = `You are an educational counselor. A student with the following profile is looking for suitable colleges:
- Percentile: ${percentile}th
- Stream: ${stream}
- Location Preference: ${location}
- Budget: ${budget}

The following ${matchedColleges.length} college(s) matched their criteria: ${matchedColleges.join(", ")}

Please provide a brief, encouraging explanation (2-3 sentences).`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // ✅ modern + cheap
        messages: [{ role: "user", content: prompt }],
        stream: true,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return new Response(err, {
        status: response.status,
        headers: { ...corsHeaders },
      });
    }

    return new Response(response.body, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
      },
    });

  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Unknown error";

    return new Response(
      JSON.stringify({ error: errorMsg }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});