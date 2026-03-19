import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";

export const submitContactForm = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    company: v.string(),
    fundingStage: v.optional(v.string()),
    serviceNeeded: v.string(),
    painPoint: v.string(),
    sessionId: v.optional(v.string()),
    visitorId: v.optional(v.id("visitors")),
    ipAddress: v.optional(v.string()),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Validate inputs
    if (!args.email.includes("@") || !args.email.includes(".")) {
      return { success: false, error: "Invalid email address" };
    }
    if (args.name.length < 2) {
      return { success: false, error: "Name must be at least 2 characters" };
    }
    if (args.painPoint.length < 10) {
      return { success: false, error: "Please provide more details about your needs" };
    }

    // Auto-calculate priority
    let priority = "low";
    const service = args.serviceNeeded.toLowerCase();
    if (service.includes("full ai suite") || service.includes("enterprise") || service.includes("voice agent")) {
      priority = "high";
    } else if (service.includes("lead generation") || service.includes("customer support") || service.includes("growth")) {
      priority = "medium";
    }

    // Save submission
    const submissionId = await ctx.db.insert("contactSubmissions", {
      name: args.name,
      email: args.email,
      company: args.company,
      fundingStage: args.fundingStage,
      serviceNeeded: args.serviceNeeded,
      painPoint: args.painPoint,
      sessionId: args.sessionId,
      visitorId: args.visitorId,
      status: "new",
      priority,
      submittedAt: Date.now(),
      ipAddress: args.ipAddress,
      source: args.source,
    });

    // Upgrade visitor to lead if sessionId provided
    if (args.sessionId && args.visitorId) {
      // Upgrade visitor
      await ctx.db.patch(args.visitorId, {
        isLead: true,
      });

      // Create/update lead record inline (Convex doesn't allow mutations calling mutations)
      const existingLead = await ctx.db
        .query("leads")
        .withIndex("by_visitor", (q) => q.eq("visitorId", args.visitorId!))
        .unique();

      if (existingLead) {
        if (100 > existingLead.leadScore) {
          await ctx.db.patch(existingLead._id, {
            leadScore: 100,
            leadSource: "contact_form",
            interestedIn: args.serviceNeeded || existingLead.interestedIn,
            email: args.email || existingLead.email,
            name: args.name || existingLead.name,
            company: args.company || existingLead.company,
          });
        }
      } else {
        const visitor = await ctx.db.get(args.visitorId);
        await ctx.db.insert("leads", {
          visitorId: args.visitorId,
          sessionId: args.sessionId,
          email: args.email,
          name: args.name,
          company: args.company,
          leadScore: 100,
          leadSource: "contact_form",
          interestedIn: args.serviceNeeded,
          status: "qualified",
          pricingPlanViewed: undefined,
          demoClicked: false,
          timeOnSite: visitor?.totalTimeOnSite || 0,
          createdAt: Date.now(),
          notes: undefined,
        });
      }
    }

    // Schedule notification
    await ctx.scheduler.runAfter(0, internal.actions.notifications.newLeadAlert, {
      submissionId,
      name: args.name,
      email: args.email,
      company: args.company,
      serviceNeeded: args.serviceNeeded,
      priority,
      painPoint: args.painPoint,
    });

    return { 
      success: true, 
      submissionId, 
      message: "Thank you! We'll reply within 24 hours." 
    };
  },
});

export const markSubmissionRead = mutation({
  args: { submissionId: v.id("contactSubmissions") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.submissionId, { status: "read" });
  },
});

export const markSubmissionReplied = mutation({
  args: { submissionId: v.id("contactSubmissions") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.submissionId, { 
      status: "replied",
      repliedAt: Date.now(),
    });
  },
});

export const markSubmissionConverted = mutation({
  args: { submissionId: v.id("contactSubmissions") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.submissionId, { status: "converted" });
  },
});
