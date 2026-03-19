import { query } from "../_generated/server";
import { v } from "convex/values";

export const getNewSubmissions = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("contactSubmissions")
      .withIndex("by_status", (q) => q.eq("status", "new"))
      .order("desc")
      .take(50);
  },
});

export const getAllSubmissions = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    return await ctx.db
      .query("contactSubmissions")
      .order("desc")
      .take(limit);
  },
});

export const getSubmissionStats = query({
  handler: async (ctx) => {
    const submissions = await ctx.db.query("contactSubmissions").collect();
    
    const total = submissions.length;
    const newSubs = submissions.filter(s => s.status === "new").length;
    const replied = submissions.filter(s => s.status === "replied").length;
    const converted = submissions.filter(s => s.status === "converted").length;

    return {
      total,
      new: newSubs,
      replied,
      converted,
    };
  },
});

export const getHighPriority = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("contactSubmissions")
      .withIndex("by_priority", (q) => q.eq("priority", "high"))
      .order("desc")
      .take(20);
  },
});

export const getSubmissionDashboard = query({
  handler: async (ctx) => {
    const submissions = await ctx.db.query("contactSubmissions").collect();
    const newSubmissions = submissions.filter(s => s.status === "new");
    
    // Stats
    const total = submissions.length;
    const todayStart = new Date().setHours(0, 0, 0, 0);
    const newToday = submissions.filter(s => s.submittedAt >= todayStart).length;
    const highPriority = submissions.filter(s => s.priority === "high").length;
    
    // Average response time (for replied submissions)
    const repliedSubs = submissions.filter(s => s.repliedAt);
    const avgResponseHours = repliedSubs.length > 0
      ? Math.round(repliedSubs.reduce((sum, s) => 
          sum + ((s.repliedAt! - s.submittedAt) / (1000 * 60 * 60)), 0) / repliedSubs.length)
      : 0;

    // Top services
    const serviceCount: Record<string, number> = {};
    submissions.forEach(s => {
      serviceCount[s.serviceNeeded] = (serviceCount[s.serviceNeeded] || 0) + 1;
    });
    const topServices = Object.entries(serviceCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([service, count]) => ({ service, count }));

    // Recent activity
    const recentActivity = submissions
      .sort((a, b) => b.submittedAt - a.submittedAt)
      .slice(0, 10);

    return {
      new: newSubmissions.sort((a, b) => {
        // Sort by priority first, then by date
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder];
        const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder];
        
        if (aPriority !== bPriority) {
          return bPriority - aPriority;
        }
        return b.submittedAt - a.submittedAt;
      }),
      stats: { total, newToday, highPriority, avgResponseHours },
      topServices,
      recentActivity,
    };
  },
});
