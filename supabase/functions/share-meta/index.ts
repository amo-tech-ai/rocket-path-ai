import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { getCorsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req: Request) => {
  const cors = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors });
  }

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token") || url.pathname.split("/").pop();

    if (!token || token === "share-meta") {
      return new Response(
        JSON.stringify({ error: "Missing token" }),
        { status: 400, headers: { ...cors, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: link } = await supabase
      .from("shareable_links")
      .select("resource_id, expires_at, revoked_at")
      .eq("token", token)
      .eq("resource_type", "validation_report")
      .is("revoked_at", null)
      .gt("expires_at", new Date().toISOString())
      .single();

    const appUrl = Deno.env.get("APP_URL") || "https://startupai.app";

    if (!link) {
      return new Response(null, {
        status: 302,
        headers: { Location: `${appUrl}/share/report/${encodeURIComponent(token)}` },
      });
    }

    const { data: report } = await supabase
      .from("validation_reports")
      .select("score, summary, details")
      .eq("id", link.resource_id)
      .single();

    const escapeHtml = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

    const details = (report?.details || {}) as Record<string, unknown>;
    const startupName = escapeHtml(String(details.startup_name || "Startup"));
    const score = report?.score || 0;
    const summary = escapeHtml(String(report?.summary || "AI-powered startup validation report").slice(0, 160));
    const safeToken = encodeURIComponent(token);
    const ogImage = `${appUrl}/og-share.svg`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Startup Validation: ${startupName} — Score ${score}/100 | StartupAI</title>
  <meta property="og:type" content="article" />
  <meta property="og:title" content="Startup Validation: ${startupName} — Score ${score}/100" />
  <meta property="og:description" content="${summary}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:url" content="${appUrl}/share/report/${safeToken}" />
  <meta property="og:site_name" content="StartupAI" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Startup Validation: ${startupName}" />
  <meta name="twitter:description" content="${summary}" />
  <meta name="twitter:image" content="${ogImage}" />
  <meta http-equiv="refresh" content="0;url=${appUrl}/share/report/${safeToken}" />
</head>
<body>
  <p>Redirecting to <a href="${appUrl}/share/report/${safeToken}">StartupAI Validation Report</a>...</p>
</body>
</html>`;

    return new Response(html, {
      headers: { "Content-Type": "text/html; charset=utf-8", ...cors },
    });
  } catch (error) {
    console.error("share-meta error:", error);
    const cors = getCorsHeaders(req);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }
});
