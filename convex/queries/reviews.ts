import { query } from "../_generated/server";

export const getApprovedReviews = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_approved", (q) => q.eq("approved", true))
      .order("desc")
      .take(20);
  },
});
