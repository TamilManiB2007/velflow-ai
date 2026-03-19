import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const trackDemoClick = mutation({
  args: {
    sessionId: v.string(),
    visitorId: v.optional(v.id("visitors")),
    sourcePage: v.string(),
    sourceSection: v.optional(v.string()),
    device: v.string(),
    country: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const demoClickId = await ctx.db.insert("demoClicks", {
      sessionId: args.sessionId,
      visitorId: args.visitorId,
      clickedAt: Date.now(),
      sourcePage: args.sourcePage,
      sourceSection: args.sourceSection,
      device: args.device,
      country: args.country,
    });

    return { demoClickId };
  },
});
