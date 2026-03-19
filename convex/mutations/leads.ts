import { mutation, internalMutation } from "../_generated/server";
import { v } from "convex/values";

export const createLead = internalMutation({
  args: {
    visitorId: v.id("visitors"),
    sessionId: v.string(),
    leadSource: v.string(),
    interestedIn: v.optional(v.string()),
    leadScore: v.number(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    company: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if lead already exists for this visitor
    const existingLead = await ctx.db
      .query("leads")
      .withIndex("by_visitor", (q) => q.eq("visitorId", args.visitorId))
      .unique();

    if (existingLead) {
      // Update existing lead with higher score if applicable
      if (args.leadScore > existingLead.leadScore) {
        await ctx.db.patch(existingLead._id, {
          leadScore: args.leadScore,
          leadSource: args.leadSource,
          interestedIn: args.interestedIn || existingLead.interestedIn,
          email: args.email || existingLead.email,
          name: args.name || existingLead.name,
          company: args.company || existingLead.company,
        });
      }
      return { leadId: existingLead._id, isNew: false };
    }

    // Get visitor data for timeOnSite
    const visitor = await ctx.db.get(args.visitorId);
    if (!visitor) {
      throw new Error("Visitor not found");
    }

    // Create new lead
    const leadId = await ctx.db.insert("leads", {
      visitorId: args.visitorId,
      sessionId: args.sessionId,
      email: args.email,
      name: args.name,
      company: args.company,
      leadScore: args.leadScore,
      leadSource: args.leadSource,
      interestedIn: args.interestedIn,
      status: args.leadSource === "contact_form" ? "qualified" : "new",
      pricingPlanViewed: undefined,
      demoClicked: args.leadSource === "demo_click",
      timeOnSite: visitor.totalTimeOnSite,
      createdAt: Date.now(),
      notes: undefined,
    });

    return { leadId, isNew: true };
  },
});

export const updateLeadStatus = mutation({
  args: {
    leadId: v.id("leads"),
    status: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.leadId, {
      status: args.status,
      ...(args.notes && { notes: args.notes }),
    });
  },
});

export const updateLeadScore = mutation({
  args: {
    leadId: v.id("leads"),
    newScore: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.leadId, {
      leadScore: args.newScore,
    });
  },
});
