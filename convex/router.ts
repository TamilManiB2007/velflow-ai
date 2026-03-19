import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api, internal } from "./_generated/api";

const http = httpRouter();

// Track visitor endpoint
http.route({
  path: "/track-visit",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    
    try {
      const result = await ctx.runMutation(api.mutations.visitors.trackVisitor, {
        sessionId: body.sessionId,
        device: body.device,
        browser: body.browser,
        os: body.os,
        referrer: body.referrer,
        utmSource: body.utmSource,
        utmMedium: body.utmMedium,
        utmCampaign: body.utmCampaign,
        userAgent: body.userAgent,
        country: body.country,
        city: body.city,
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Failed to track visitor" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  }),
});

// Track page view endpoint
http.route({
  path: "/track-pageview",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    
    try {
      const result = await ctx.runMutation(api.mutations.pageViews.trackPageView, {
        sessionId: body.sessionId,
        visitorId: body.visitorId,
        page: body.page,
        section: body.section,
        scrollDepth: body.scrollDepth,
      });

      // Also update scroll depth if provided
      if (body.scrollDepth) {
        await ctx.runMutation(api.mutations.pageViews.updateScrollDepth, {
          sessionId: body.sessionId,
          page: body.page,
          scrollDepth: body.scrollDepth,
        });
      }

      // Run lead scoring after page view
      if (body.visitorId) {
        await ctx.runMutation(internal.mutations.leadScoring.calculateLeadScore, {
          visitorId: body.visitorId,
          sessionId: body.sessionId,
        });
      }

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Failed to track page view" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  }),
});

// Track demo click endpoint
http.route({
  path: "/track-demo",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    
    try {
      const result = await ctx.runMutation(api.mutations.demoClicks.trackDemoClick, {
        sessionId: body.sessionId,
        visitorId: body.visitorId,
        sourcePage: body.sourcePage,
        sourceSection: body.sourceSection,
        device: body.device,
        country: body.country,
      });

      // Run lead scoring after demo click (high value action)
      if (body.visitorId) {
        await ctx.runMutation(internal.mutations.leadScoring.calculateLeadScore, {
          visitorId: body.visitorId,
          sessionId: body.sessionId,
        });
      }

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Failed to track demo click" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  }),
});

// Track time on site endpoint
http.route({
  path: "/track-time",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    
    try {
      await ctx.runMutation(api.mutations.visitors.updateVisitorTime, {
        sessionId: body.sessionId,
        additionalSeconds: body.additionalSeconds,
      });

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Failed to track time" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  }),
});

// Contact form submission endpoint
http.route({
  path: "/contact",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    
    try {
      const result = await ctx.runMutation(api.mutations.contactSubmissions.submitContactForm, {
        name: body.name,
        email: body.email,
        company: body.company,
        fundingStage: body.fundingStage,
        serviceNeeded: body.serviceNeeded,
        painPoint: body.painPoint,
        sessionId: body.sessionId,
        visitorId: body.visitorId,
        ipAddress: body.ipAddress,
        source: body.source,
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Failed to submit contact form" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  }),
});

// Public stats endpoint (for website footer or public display)
http.route({
  path: "/stats",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    try {
      const stats = await ctx.runQuery(api.queries.visitors.getVisitorStats);
      
      // Return only public-safe stats
      const publicStats = {
        totalVisitors: stats.totalAllTime,
        activeNow: stats.activeNow,
        topCountries: stats.topCountries.slice(0, 3), // Only top 3
      };

      return new Response(JSON.stringify(publicStats), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Failed to get stats" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  }),
});

// Handle CORS preflight requests
http.route({
  path: "/track-visit",
  method: "OPTIONS",
  handler: httpAction(async (ctx, request) => {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }),
});

http.route({
  path: "/track-pageview",
  method: "OPTIONS",
  handler: httpAction(async (ctx, request) => {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }),
});

http.route({
  path: "/track-demo",
  method: "OPTIONS",
  handler: httpAction(async (ctx, request) => {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }),
});

http.route({
  path: "/track-time",
  method: "OPTIONS",
  handler: httpAction(async (ctx, request) => {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }),
});

http.route({
  path: "/contact",
  method: "OPTIONS",
  handler: httpAction(async (ctx, request) => {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }),
});

export default http;
