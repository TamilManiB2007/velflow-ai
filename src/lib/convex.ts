/**
 * VelFlow AI — Convex Backend Integration
 * Connected to: https://combative-cardinal-264.convex.site
 */

const CONVEX_URL = "https://combative-cardinal-264.convex.site";

// ─── Session Management ───────────────────────────────────────────────────────

function getOrCreateSession(): { sessionId: string; visitorId: string | null } {
  let sessionId = localStorage.getItem("vf_session");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("vf_session", sessionId);
  }
  const visitorId = localStorage.getItem("vf_visitor_id");
  return { sessionId, visitorId };
}

function storeVisitorId(id: string) {
  localStorage.setItem("vf_visitor_id", id);
}

// ─── Device Detection ─────────────────────────────────────────────────────────

function detectDevice(): "mobile" | "tablet" | "desktop" {
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function detectBrowser(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Edg/")) return "Edge";
  if (ua.includes("Chrome/")) return "Chrome";
  if (ua.includes("Firefox/")) return "Firefox";
  if (ua.includes("Safari/")) return "Safari";
  return "Other";
}

function detectOS(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Win")) return "Windows";
  if (ua.includes("Mac")) return "Mac";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("Linux")) return "Linux";
  return "Other";
}

// ─── Safe fetch wrapper ───────────────────────────────────────────────────────

async function safeFetch(path: string, body: object): Promise<unknown> {
  try {
    const res = await fetch(`${CONVEX_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.json();
  } catch (err) {
    console.warn("[VelFlow] Tracking error:", err);
    return null;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function trackVisit() {
  const { sessionId } = getOrCreateSession();
  const params = new URLSearchParams(window.location.search);
  const result = (await safeFetch("/track-visit", {
    sessionId,
    device: detectDevice(),
    browser: detectBrowser(),
    os: detectOS(),
    userAgent: navigator.userAgent,
    referrer: document.referrer || "direct",
    utmSource: params.get("utm_source") ?? undefined,
    utmMedium: params.get("utm_medium") ?? undefined,
    utmCampaign: params.get("utm_campaign") ?? undefined,
  })) as { visitorId?: string } | null;
  if (result?.visitorId) storeVisitorId(result.visitorId);
}

export async function trackPageView(section: string, scrollDepth = 0) {
  const { sessionId, visitorId } = getOrCreateSession();
  if (!visitorId) return;
  await safeFetch("/track-pageview", { sessionId, visitorId, page: "home", section, scrollDepth });
}

export async function trackDemoClick(sourceSection = "demo") {
  const { sessionId, visitorId } = getOrCreateSession();
  await safeFetch("/track-demo", {
    sessionId,
    visitorId: visitorId ?? undefined,
    sourcePage: "home",
    sourceSection,
    device: detectDevice(),
  });
}

export async function trackTimeOnSite(seconds = 30) {
  const { sessionId } = getOrCreateSession();
  await safeFetch("/track-time", { sessionId, additionalSeconds: seconds });
}

export async function submitContactForm(data: {
  name: string;
  email: string;
  company: string;
  serviceNeeded: string;
  painPoint: string;
  fundingStage?: string;
}): Promise<{ success: boolean; message?: string; error?: string }> {
  const { sessionId, visitorId } = getOrCreateSession();
  try {
    const res = await fetch(`${CONVEX_URL}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        sessionId,
        visitorId: visitorId ?? undefined,
        source: document.referrer || "direct",
      }),
    });
    return await res.json();
  } catch (err) {
    console.error("[VelFlow] Form submission error:", err);
    return { success: false, error: "Network error — please try again" };
  }
}
