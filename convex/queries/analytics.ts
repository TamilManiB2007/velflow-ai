import { query } from "../_generated/server";
import { v } from "convex/values";

export const getDailyStats = query({
  args: { days: v.number() },
  handler: async (ctx, args) => {
    const analytics = await ctx.db
      .query("analytics")
      .withIndex("by_date")
      .order("desc")
      .take(args.days);
    
    return analytics.reverse(); // Return oldest to newest for charts
  },
});

export const getTodayStats = query({
  handler: async (ctx) => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const todayStart = new Date().setHours(0, 0, 0, 0);
    
    // Get real-time counts for today
    const visitors = await ctx.db.query("visitors")
      .filter((q) => q.gte(q.field("firstVisit"), todayStart))
      .collect();
    
    const pageViews = await ctx.db.query("pageViews")
      .withIndex("by_timestamp", (q) => q.gte("timestamp", todayStart))
      .collect();
    
    const leads = await ctx.db.query("leads")
      .filter((q) => q.gte(q.field("createdAt"), todayStart))
      .collect();
    
    const submissions = await ctx.db.query("contactSubmissions")
      .withIndex("by_submitted_at", (q) => q.gte("submittedAt", todayStart))
      .collect();
    
    const demoClicks = await ctx.db.query("demoClicks")
      .withIndex("by_clicked_at", (q) => q.gte("clickedAt", todayStart))
      .collect();

    const uniqueVisitors = new Set(visitors.map(v => v.sessionId)).size;
    const avgTimeOnSite = visitors.length > 0 
      ? Math.round(visitors.reduce((sum, v) => sum + v.totalTimeOnSite, 0) / visitors.length)
      : 0;
    
    const avgScrollDepth = pageViews.length > 0
      ? Math.round(pageViews.reduce((sum, pv) => sum + pv.scrollDepth, 0) / pageViews.length)
      : 0;

    return {
      date: today,
      totalVisitors: visitors.length,
      uniqueVisitors,
      totalPageViews: pageViews.length,
      newLeads: leads.length,
      formSubmissions: submissions.length,
      demoClicks: demoClicks.length,
      avgTimeOnSite,
      avgScrollDepth,
    };
  },
});

export const getGrowthTrend = query({
  handler: async (ctx) => {
    const thisWeekStart = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const lastWeekStart = Date.now() - (14 * 24 * 60 * 60 * 1000);
    
    const thisWeekVisitors = await ctx.db.query("visitors")
      .filter((q) => q.gte(q.field("firstVisit"), thisWeekStart))
      .collect();
    
    const lastWeekVisitors = await ctx.db.query("visitors")
      .filter((q) => q.and(
        q.gte(q.field("firstVisit"), lastWeekStart),
        q.lt(q.field("firstVisit"), thisWeekStart)
      ))
      .collect();
    
    const thisWeekLeads = await ctx.db.query("leads")
      .filter((q) => q.gte(q.field("createdAt"), thisWeekStart))
      .collect();
    
    const lastWeekLeads = await ctx.db.query("leads")
      .filter((q) => q.and(
        q.gte(q.field("createdAt"), lastWeekStart),
        q.lt(q.field("createdAt"), thisWeekStart)
      ))
      .collect();

    const visitorGrowth = lastWeekVisitors.length > 0 
      ? Math.round(((thisWeekVisitors.length - lastWeekVisitors.length) / lastWeekVisitors.length) * 100)
      : 0;
    
    const leadGrowth = lastWeekLeads.length > 0
      ? Math.round(((thisWeekLeads.length - lastWeekLeads.length) / lastWeekLeads.length) * 100)
      : 0;

    return {
      thisWeek: {
        visitors: thisWeekVisitors.length,
        leads: thisWeekLeads.length,
      },
      lastWeek: {
        visitors: lastWeekVisitors.length,
        leads: lastWeekLeads.length,
      },
      growth: {
        visitors: visitorGrowth,
        leads: leadGrowth,
      },
    };
  },
});

export const getConversionFunnel = query({
  handler: async (ctx) => {
    const visitors = await ctx.db.query("visitors").collect();
    const pageViews = await ctx.db.query("pageViews").collect();
    const leads = await ctx.db.query("leads").collect();
    const submissions = await ctx.db.query("contactSubmissions").collect();
    const demoClicks = await ctx.db.query("demoClicks").collect();
    
    const totalVisitors = visitors.length;
    const engagedVisitors = visitors.filter(v => v.totalTimeOnSite > 60).length; // >1min
    const pricingViewed = pageViews.filter(pv => pv.page === "pricing" || pv.section === "pricing").length;
    const demoClickCount = demoClicks.length;
    const formSubmitted = submissions.length;
    const qualified = leads.filter(l => l.status === "qualified" || l.status === "closed_won").length;
    const clients = leads.filter(l => l.status === "closed_won").length;

    const steps = [
      { step: "Visitors", count: totalVisitors, percentage: 100 },
      { step: "Engaged (>1min)", count: engagedVisitors, percentage: totalVisitors > 0 ? Math.round((engagedVisitors / totalVisitors) * 100) : 0 },
      { step: "Pricing Viewed", count: pricingViewed, percentage: totalVisitors > 0 ? Math.round((pricingViewed / totalVisitors) * 100) : 0 },
      { step: "Demo Clicked", count: demoClickCount, percentage: totalVisitors > 0 ? Math.round((demoClickCount / totalVisitors) * 100) : 0 },
      { step: "Form Submitted", count: formSubmitted, percentage: totalVisitors > 0 ? Math.round((formSubmitted / totalVisitors) * 100) : 0 },
      { step: "Lead Qualified", count: qualified, percentage: totalVisitors > 0 ? Math.round((qualified / totalVisitors) * 100) : 0 },
      { step: "Client Won", count: clients, percentage: totalVisitors > 0 ? Math.round((clients / totalVisitors) * 100) : 0 },
    ];

    return steps;
  },
});
