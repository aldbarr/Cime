// Netlify Function: AI coach. Calls the Anthropic Messages API with the key
// stored in the ANTHROPIC_API_KEY environment variable (never sent to the browser).
const MAX_PROMPT = 60000;

export default async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return Response.json({ error: "ANTHROPIC_API_KEY missing" }, { status: 501 });

  // Light protection: only accept calls coming from this site.
  const origin = req.headers.get("origin") || "";
  const host = req.headers.get("host") || "";
  if (origin && !origin.endsWith(host)) return new Response("Forbidden", { status: 403 });

  let prompt = "";
  try { ({ prompt } = await req.json()); } catch { /* ignore */ }
  if (!prompt || typeof prompt !== "string" || prompt.length > MAX_PROMPT) {
    return Response.json({ error: "invalid prompt" }, { status: 400 });
  }

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.CLAUDE_MODEL || "claude-sonnet-4-5",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) return Response.json({ error: j.error?.message || "upstream error" }, { status: 502 });
  const text = (j.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
  return Response.json({ text });
};
