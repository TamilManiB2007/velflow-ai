import { query } from "../_generated/server";
import { v } from "convex/values";

export const getAllLeads = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("leads")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .take(100);
    }
    return await ctx.db.query("leads").order("desc").take(100);
  },
});

export const getHotLeads = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("leads")
      .withIndex("by_score", (q) => q.gte("leadScore", 70))
      .order("desc")
      .take(20);
  },
});

export const getLeadById = query({
  args: { leadId: v.id("leads") },
  handler: async (ctx, args) => {
    const lead = await ctx.db.get(args.leadId);
    if (!lead) return null;

    const visitor = await ctx.db.get(lead.visitorId);
    return { ...lead, visitor };
  },
});

export const getLeadStats = query({
  handler: async (ctx) => {
    const leads = await ctx.db.query("leads").collect();
    
    const total = leads.length;
    const newLeads = leads.filter(l => l.status === "new").length;
    const contacted = leads.filter(l => l.status === "contacted").length;
    const qualified = leads.filter(l => l.status === "qualified").length;
    const closedWon = leads.filter(l => l.status === "closed_won").length;

    return {
      total,
      new: newLeads,
      contacted,
      qualified,
      closedWon,
    };
  },
});
