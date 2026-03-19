import { internalMutation } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";

export const calculateLeadScore = internalMutation({
  args: {
    visitorId: v.id("visitors"),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    // Get visitor data
    const visitor = await ctx.db
      .query("visitors")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .unique();

    if (!visitor) {
      return { score: 0, shouldCreateLead: false };
    }

    // Get page views for this visitor
    const pageViews = await ctx.db
      .query("pageViews")
      .withIndex("by_visitor", (q) => q.eq("visitorId", args.visitorId))
      .collect();

    // Check for demo clicks
    const demoClicks = await ctx.db
      .query("demoClicks")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    let score = 0;

    // +30 if demo was clicked
    if (demoClicks.length > 0) {
      score += 30;
    }

    // +25 if pricing page viewed
    const viewedPricing = pageViews.some(pv => 
      pv.page === "pricing" || pv.section === "pricing"
    );
    if (viewedPricing) {
      score += 25;
    }

    // +20 if time on site > 3 minutes (180 seconds)
    if (visitor.totalTimeOnSite > 180) {
      score += 20;
    }

    // +15 if visited services page
    const viewedServices = pageViews.some(pv => 
      pv.page === "services" || pv.section === "services"
    );
    if (viewedServices) {
      score += 15;
    }

    // +10 if return visitor
    if (visitor.totalVisits > 1) {
      score += 10;
    }

    // +5 if scrolled 70%+ on any page
    const deepScroll = pageViews.some(pv => pv.scrollDepth > 70);
    if (deepScroll) {
      score += 5;
    }

    const shouldCreateLead = score >= 50;

    // If score is high enough and no lead exists, create one
    if (shouldCreateLead) {
      const existingLead = await ctx.db
        .query("leads")
        .withIndex("by_visitor", (q) => q.eq("visitorId", args.visitorId))
        .unique();

      if (!existingLead) {
        // Determine lead source
        let leadSource = "long_session";
        if (demoClicks.length > 0) leadSource = "demo_click";
        else if (viewedPricing) leadSource = "pricing_view";

        // Determine interested service
        let interestedIn = "General Inquiry";
        if (viewedServices) interestedIn = "AI Services";
        if (viewedPricing) interestedIn = "Pricing Plans";
        if (demoClicks.length > 0) interestedIn = "Voice Agent Demo";

        await ctx.db.insert("leads", {
          visitorId: args.visitorId,
          sessionId: args.sessionId,
          leadSource,
          interestedIn,
          leadScore: score,
          status: "new",
          demoClicked: demoClicks.length > 0,
          timeOnSite: visitor.totalTimeOnSite,
          createdAt: Date.now(),
        });

        // Upgrade visitor
        await ctx.db.patch(args.visitorId, { isLead: true });

        // Note: hot lead alert will be sent via the contact form mutation if they convert
        // For behavior-based hot leads, log to console for now
        if (score >= 80) {
          console.log(`HOT LEAD detected! Session: ${args.sessionId}, Score: ${score}, Service: ${interestedIn}`);
        }
      }
    }

    return { score, shouldCreateLead, leadSource: shouldCreateLead ? "behavior_score" : null };
  },
});
