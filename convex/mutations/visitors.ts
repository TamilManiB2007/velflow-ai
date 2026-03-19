import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const trackVisitor = mutation({
  args: {
    sessionId: v.string(),
    device: v.string(),
    browser: v.optional(v.string()),
    os: v.optional(v.string()),
    referrer: v.optional(v.string()),
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    country: v.optional(v.string()),
    city: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if visitor already exists
    const existingVisitor = await ctx.db
      .query("visitors")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .unique();

    const now = Date.now();

    if (existingVisitor) {
      // Update existing visitor
      await ctx.db.patch(existingVisitor._id, {
        lastSeen: now,
        totalVisits: existingVisitor.totalVisits + 1,
        // Update location if provided
        ...(args.country && { country: args.country }),
        ...(args.city && { city: args.city }),
      });
      return { visitorId: existingVisitor._id, isNewVisitor: false };
    } else {
      // Create new visitor
      const visitorId = await ctx.db.insert("visitors", {
        sessionId: args.sessionId,
        device: args.device,
        browser: args.browser,
        os: args.os,
        referrer: args.referrer || "direct",
        utmSource: args.utmSource,
        utmMedium: args.utmMedium,
        utmCampaign: args.utmCampaign,
        userAgent: args.userAgent,
        country: args.country,
        city: args.city,
        firstVisit: now,
        lastSeen: now,
        totalVisits: 1,
        totalTimeOnSite: 0,
        isLead: false,
        isClient: false,
      });
      return { visitorId, isNewVisitor: true };
    }
  },
});

export const updateVisitorTime = mutation({
  args: {
    sessionId: v.string(),
    additionalSeconds: v.number(),
  },
  handler: async (ctx, args) => {
    const visitor = await ctx.db
      .query("visitors")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .unique();

    if (visitor) {
      await ctx.db.patch(visitor._id, {
        totalTimeOnSite: visitor.totalTimeOnSite + args.additionalSeconds,
        lastSeen: Date.now(),
      });
    }
  },
});

export const upgradeToLead = mutation({
  args: {
    sessionId: v.string(),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const visitor = await ctx.db
      .query("visitors")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .unique();

    if (visitor && !visitor.isLead) {
      await ctx.db.patch(visitor._id, {
        isLead: true,
      });
      return { success: true, visitorId: visitor._id };
    }
    return { success: false };
  },
});
