import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const trackPageView = mutation({
  args: {
    sessionId: v.string(),
    visitorId: v.id("visitors"),
    page: v.string(),
    section: v.optional(v.string()),
    scrollDepth: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const pageViewId = await ctx.db.insert("pageViews", {
      sessionId: args.sessionId,
      visitorId: args.visitorId,
      page: args.page,
      section: args.section,
      timeOnPage: 0,
      scrollDepth: args.scrollDepth || 0,
      timestamp: Date.now(),
      exitPage: false,
    });

    return { pageViewId };
  },
});

export const updateScrollDepth = mutation({
  args: {
    sessionId: v.string(),
    page: v.string(),
    scrollDepth: v.number(),
  },
  handler: async (ctx, args) => {
    // Find the most recent page view for this session and page
    const pageView = await ctx.db
      .query("pageViews")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .filter((q) => q.eq(q.field("page"), args.page))
      .order("desc")
      .first();

    if (pageView && args.scrollDepth > pageView.scrollDepth) {
      await ctx.db.patch(pageView._id, {
        scrollDepth: args.scrollDepth,
      });
    }
  },
});

export const markExitPage = mutation({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    // Find the most recent page view for this session
    const lastPageView = await ctx.db
      .query("pageViews")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .order("desc")
      .first();

    if (lastPageView) {
      await ctx.db.patch(lastPageView._id, {
        exitPage: true,
      });
    }
  },
});
