export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    try {
      const body = await request.json();
      const { assetKey, assetName, price, chartDataUrl, sizeKb } = body;
      const numericPrice = Number(price) || 0;

      return new Response(JSON.stringify({
        action: "HOLD",
        cls: "hold",
        entry: numericPrice,
        tp: numericPrice * 1.02,
        sl: numericPrice * 0.985,
        note: chartDataUrl
          ? `Worker connected for ${assetName} (${assetKey}) with chart (${sizeKb || 0} KB). Ready for AI vision model.`
          : `Worker connected for ${assetName} (${assetKey}) at $${numericPrice}. Ready for AI model.`
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Invalid request payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
};
