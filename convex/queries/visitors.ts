import { query } from "../_generated/server";
import { v } from "convex/values";

export const getVisitorBySession = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("visitors")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .unique();
  },
});

export const getAllVisitors = query({
  args: { 
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    return await ctx.db
      .query("visitors")
      .order("desc")
      .take(limit);
  },
});

export const getVisitorStats = query({
  handler: async (ctx) => {
    const now = Date.now();
    const todayStart = new Date().setHours(0, 0, 0, 0);
    const weekStart = now - (7 * 24 * 60 * 60 * 1000);
    const fiveMinutesAgo = now - (5 * 60 * 1000);

    const allVisitors = await ctx.db.query("visitors").collect();
    
    const total = allVisitors.length;
    const today = allVisitors.filter(v => v.firstVisit >= todayStart).length;
    const thisWeek = allVisitors.filter(v => v.firstVisit >= weekStart).length;
    const activeNow = allVisitors.filter(v => v.lastSeen >= fiveMinutesAgo).length;
    
    // Country breakdown
    const countryCount: Record<string, number> = {};
    allVisitors.forEach(v => {
      if (v.country) {
        countryCount[v.country] = (countryCount[v.country] || 0) + 1;
      }
    });
    const topCountries = Object.entries(countryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([country, count]) => ({ country, count }));

    // Device breakdown
    const deviceCount = { mobile: 0, desktop: 0, tablet: 0 };
    allVisitors.forEach(v => {
      if (v.device in deviceCount) {
        deviceCount[v.device as keyof typeof deviceCount]++;
      }
    });
    const deviceBreakdown = {
      mobile: Math.round((deviceCount.mobile / total) * 100),
      desktop: Math.round((deviceCount.desktop / total) * 100),
      tablet: Math.round((deviceCount.tablet / total) * 100),
    };

    const avgTimeOnSite = total > 0 
      ? Math.round(allVisitors.reduce((sum, v) => sum + v.totalTimeOnSite, 0) / total)
      : 0;

    const returningVisitors = allVisitors.filter(v => v.totalVisits > 1).length;
    const returningRate = total > 0 ? Math.round((returningVisitors / total) * 100) : 0;

    return {
      totalAllTime: total,
      todayCount: today,
      thisWeekCount: thisWeek,
      activeNow,
      topCountries,
      deviceBreakdown,
      avgTimeOnSite,
      returningRate,
    };
  },
});

export const getTopCountries = query({
  handler: async (ctx) => {
    const visitors = await ctx.db.query("visitors").collect();
    const countryCount: Record<string, number> = {};
    
    visitors.forEach(v => {
      if (v.country) {
        countryCount[v.country] = (countryCount[v.country] || 0) + 1;
      }
    });

    return Object.entries(countryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([country, count]) => ({ country, count }));
  },
});

export const getReturningVisitors = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("visitors")
      .filter((q) => q.gt(q.field("totalVisits"), 1))
      .order("desc")
      .take(20);
  },
});
