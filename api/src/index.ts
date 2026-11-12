import facts from "./facts.json";

export interface Fact {
  id: number;
  fact: string;
  category: string;
  source?: string;
  status?: string;
}

const FACTS: Fact[] = facts;

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders
    }
  });
}

function notFound(): Response {
  return json({ error: "Not found" }, 404);
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "GET") {
      return json({ error: "Method not allowed" }, 405);
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    if (path === "/" ) {
      return json({
        name: "linuxfacts.com API",
        version: "0.1.0",
        endpoints: [
          "GET /api/facts",
          "GET /api/facts/random",
          "GET /api/facts/:id",
          "GET /health"
        ]
      });
    }

    if (path === "/health") {
      return json({ ok: true });
    }

    if (path === "/api/facts") {
      return json({ count: FACTS.length, facts: FACTS });
    }

    if (path === "/api/facts/random") {
      const fact = FACTS[Math.floor(Math.random() * FACTS.length)];
      return json({ fact });
    }

    const match = path.match(/^\/api\/facts\/(\d+)$/);
    if (match) {
      const id = Number(match[1]);
      const fact = FACTS.find((f) => f.id === id);
      if (!fact) return json({ error: "Fact not found" }, 404);
      return json({ fact });
    }

    return notFound();
  }
};
