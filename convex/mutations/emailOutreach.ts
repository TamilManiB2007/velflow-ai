import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const bulkImportLeads = mutation({
  args: {
    leads: v.array(v.object({
      prospectName: v.string(),
      prospectEmail: v.string(),
      prospectCompany: v.string(),
      prospectTitle: v.string(),
      industry: v.string(),
      linkedinUrl: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    let imported = 0;
    let skipped = 0;

    for (const lead of args.leads) {
      // Check if email already exists
      const existing = await ctx.db
        .query("emailOutreach")
        .withIndex("by_email", (q) => q.eq("prospectEmail", lead.prospectEmail))
        .unique();

      if (existing) {
        skipped++;
        continue;
      }

      // Insert new lead
      await ctx.db.insert("emailOutreach", {
        prospectName: lead.prospectName,
        prospectEmail: lead.prospectEmail,
        prospectCompany: lead.prospectCompany,
        prospectTitle: lead.prospectTitle,
        industry: lead.industry,
        linkedinUrl: lead.linkedinUrl,
        emailSequence: 0,
        status: "not_sent",
        createdAt: Date.now(),
      });
      imported++;
    }

    return { imported, skipped };
  },
});

export const markEmailSent = mutation({
  args: {
    outreachId: v.id("emailOutreach"),
    sequenceNumber: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const updates: any = {
      emailSequence: args.sequenceNumber,
      status: "sent",
    };

    if (args.sequenceNumber === 1) {
      updates.sentAt = now;
    } else if (args.sequenceNumber === 2) {
      updates.followUp2SentAt = now;
    } else if (args.sequenceNumber === 3) {
      updates.followUp3SentAt = now;
    }

    await ctx.db.patch(args.outreachId, updates);
  },
});

export const updateEmailStatus = mutation({
  args: {
    outreachId: v.id("emailOutreach"),
    status: v.string(),
    replyText: v.optional(v.string()),
    dealValue: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const updates: any = { status: args.status };

    if (args.status === "opened") {
      updates.openedAt = Date.now();
    } else if (args.status === "replied_positive" || args.status === "replied_negative") {
      updates.repliedAt = Date.now();
      if (args.replyText) {
        updates.replyText = args.replyText;
      }
    } else if (args.status === "closed_won" && args.dealValue) {
      updates.dealValue = args.dealValue;
    }

    await ctx.db.patch(args.outreachId, updates);
  },
});
