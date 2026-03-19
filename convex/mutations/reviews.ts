import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";

export const submitReview = mutation({
  args: {
    name: v.string(),
    role: v.optional(v.string()),
    text: v.string(),
    rating: v.number(),
  },
  handler: async (ctx, args) => {
    if (args.name.length < 2) return { success: false, error: "Name too short" };
    if (args.text.length < 10) return { success: false, error: "Review too short" };
    if (args.rating < 1 || args.rating > 5) return { success: false, error: "Invalid rating" };

    await ctx.db.insert("reviews", {
      name: args.name,
      role: args.role ?? "",
      text: args.text,
      rating: args.rating,
      approved: true,
      createdAt: Date.now(),
    });

    // Fire email to you
    await ctx.scheduler.runAfter(0, internal.actions.notifications.newReviewAlert, {
      name: args.name,
      role: args.role ?? "",
      text: args.text,
      rating: args.rating,
    });

    return { success: true };
  },
});

export const getApprovedReviews = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("reviews")
      .filter((q) => q.eq(q.field("approved"), true))
      .order("desc")
      .collect();
  },
});
