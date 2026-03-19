import { query } from "../_generated/server";
import { v } from "convex/values";

export const getAllOutreach = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("emailOutreach")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .take(100);
    }
    return await ctx.db.query("emailOutreach").order("desc").take(100);
  },
});

export const getOutreachStats = query({
  handler: async (ctx) => {
    const outreach = await ctx.db.query("emailOutreach").collect();
    
    const total = outreach.length;
    const sent = outreach.filter(o => o.status !== "not_sent").length;
    const opened = outreach.filter(o => o.openedAt).length;
    const repliedPositive = outreach.filter(o => o.status === "replied_positive").length;
    const booked = outreach.filter(o => o.status === "booked").length;
    const closedWon = outreach.filter(o => o.status === "closed_won").length;
    
    const openRate = sent > 0 ? Math.round((opened / sent) * 100) : 0;
    const replyRate = sent > 0 ? Math.round((repliedPositive / sent) * 100) : 0;
    const bookingRate = repliedPositive > 0 ? Math.round((booked / repliedPositive) * 100) : 0;
    const closeRate = booked > 0 ? Math.round((closedWon / booked) * 100) : 0;
    
    const totalRevenue = outreach
      .filter(o => o.status === "closed_won" && o.dealValue)
      .reduce((sum, o) => sum + (o.dealValue || 0), 0);
    
    const avgDealValue = closedWon > 0 ? Math.round(totalRevenue / closedWon) : 0;

    return {
      pipeline: {
        not_sent: outreach.filter(o => o.status === "not_sent").length,
        sent: outreach.filter(o => o.status === "sent").length,
        opened: opened,
        replied_positive: repliedPositive,
        booked: booked,
        closed_won: closedWon,
        closed_lost: outreach.filter(o => o.status === "closed_lost").length,
      },
      metrics: {
        openRate,
        replyRate,
        bookingRate,
        closeRate,
        projectedRevenue: totalRevenue,
        avgDealValue,
      },
    };
  },
});

export const getOutreachByIndustry = query({
  handler: async (ctx) => {
    const outreach = await ctx.db.query("emailOutreach").collect();
    const industryStats: Record<string, any> = {};
    
    outreach.forEach(o => {
      if (!industryStats[o.industry]) {
        industryStats[o.industry] = {
          industry: o.industry,
          total: 0,
          sent: 0,
          replied: 0,
          closed: 0,
        };
      }
      
      const stats = industryStats[o.industry];
      stats.total++;
      if (o.status !== "not_sent") stats.sent++;
      if (o.status === "replied_positive") stats.replied++;
      if (o.status === "closed_won") stats.closed++;
    });

    return Object.values(industryStats)
      .sort((a: any, b: any) => b.total - a.total);
  },
});

export const getReadyToFollowUp = query({
  handler: async (ctx) => {
    const fourDaysAgo = Date.now() - (4 * 24 * 60 * 60 * 1000);
    const fiveDaysAgo = Date.now() - (5 * 24 * 60 * 60 * 1000);
    
    const outreach = await ctx.db.query("emailOutreach").collect();
    
    return outreach.filter(o => {
      // Email 1 sent 4+ days ago, no reply, ready for Email 2
      if (o.emailSequence === 1 && o.sentAt && o.sentAt < fourDaysAgo && 
          !o.repliedAt && o.status === "sent") {
        return true;
      }
      
      // Email 2 sent 5+ days ago, no reply, ready for Email 3
      if (o.emailSequence === 2 && o.followUp2SentAt && o.followUp2SentAt < fiveDaysAgo && 
          !o.repliedAt && o.status === "sent") {
        return true;
      }
      
      return false;
    }).sort((a, b) => (a.sentAt || 0) - (b.sentAt || 0)); // Oldest first
  },
});
