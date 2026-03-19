import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";
import { internalMutation, internalQuery } from "./_generated/server";

const crons = cronJobs();

// Daily analytics rollup - runs at 00:05 UTC every day
crons.daily(
  "aggregate-daily-analytics",
  { hourUTC: 0, minuteUTC: 5 },
  internal.crons.rollupYesterday
);

// Daily follow-up reminder - runs at 09:00 UTC (good time for notifications)
crons.daily(
  "send-followup-reminders",
  { hourUTC: 9, minuteUTC: 0 },
  internal.actions.notifications.dailyFollowUpDigest
);

// Hourly visitor cleanup - runs every hour
crons.hourly(
  "refresh-active-visitor-count",
  { minuteUTC: 0 },
  internal.crons.cleanupOldSessions
);

// Weekly performance report - every Monday at 08:00 UTC
crons.weekly(
  "weekly-performance-report",
  { dayOfWeek: "monday", hourUTC: 8, minuteUTC: 0 },
  internal.actions.notifications.weeklyReport
);

export const rollupYesterday = internalMutation({
  handler: async (ctx) => {
    // Calculate yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0]; // YYYY-MM-DD
    
    const yesterdayStart = new Date(yesterdayStr).getTime();
    const yesterdayEnd = yesterdayStart + (24 * 60 * 60 * 1000);

    // Check if analytics already exists for yesterday
    const existingAnalytics = await ctx.db
      .query("analytics")
      .withIndex("by_date", (q) => q.eq("date", yesterdayStr))
      .unique();

    // Get all data for yesterday
    const visitors = await ctx.db.query("visitors")
      .filter((q) => q.and(
        q.gte(q.field("firstVisit"), yesterdayStart),
        q.lt(q.field("firstVisit"), yesterdayEnd)
      ))
      .collect();

    const pageViews = await ctx.db.query("pageViews")
      .withIndex("by_timestamp", (q) => q
        .gte("timestamp", yesterdayStart)
        .lt("timestamp", yesterdayEnd)
      )
      .collect();

    const leads = await ctx.db.query("leads")
      .filter((q) => q.and(
        q.gte(q.field("createdAt"), yesterdayStart),
        q.lt(q.field("createdAt"), yesterdayEnd)
      ))
      .collect();

    const submissions = await ctx.db.query("contactSubmissions")
      .withIndex("by_submitted_at", (q) => q
        .gte("submittedAt", yesterdayStart)
        .lt("submittedAt", yesterdayEnd)
      )
      .collect();

    const demoClicks = await ctx.db.query("demoClicks")
      .withIndex("by_clicked_at", (q) => q
        .gte("clickedAt", yesterdayStart)
        .lt("clickedAt", yesterdayEnd)
      )
      .collect();

    // Calculate stats
    const totalVisitors = visitors.length;
    const uniqueVisitors = new Set(visitors.map(v => v.sessionId)).size;
    const totalPageViews = pageViews.length;
    const newLeads = leads.length;
    const formSubmissions = submissions.length;
    const demoClicksCount = demoClicks.length;
    
    const avgTimeOnSite = totalVisitors > 0 
      ? Math.round(visitors.reduce((sum, v) => sum + v.totalTimeOnSite, 0) / totalVisitors)
      : 0;
    
    const avgScrollDepth = totalPageViews > 0
      ? Math.round(pageViews.reduce((sum, pv) => sum + pv.scrollDepth, 0) / totalPageViews)
      : 0;

    // Top country
    const countryCount: Record<string, number> = {};
    visitors.forEach(v => {
      if (v.country) {
        countryCount[v.country] = (countryCount[v.country] || 0) + 1;
      }
    });
    const topCountry = Object.entries(countryCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0];

    // Top referrer
    const referrerCount: Record<string, number> = {};
    visitors.forEach(v => {
      if (v.referrer && v.referrer !== "direct") {
        referrerCount[v.referrer] = (referrerCount[v.referrer] || 0) + 1;
      }
    });
    const topReferrer = Object.entries(referrerCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0];

    // Pricing views
    const pricingViews = pageViews.filter(pv => 
      pv.page === "pricing" || pv.section === "pricing"
    ).length;

    // Mobile percentage
    const mobileVisitors = visitors.filter(v => v.device === "mobile").length;
    const mobilePerc = totalVisitors > 0 ? Math.round((mobileVisitors / totalVisitors) * 100) : 0;

    // Bounce rate (visitors with only 1 page view)
    const singlePageSessions = new Set();
    const sessionPageCounts: Record<string, number> = {};
    pageViews.forEach(pv => {
      sessionPageCounts[pv.sessionId] = (sessionPageCounts[pv.sessionId] || 0) + 1;
    });
    Object.entries(sessionPageCounts).forEach(([sessionId, count]) => {
      if (count === 1) singlePageSessions.add(sessionId);
    });
    const bounceRate = uniqueVisitors > 0 ? Math.round((singlePageSessions.size / uniqueVisitors) * 100) : 0;

    const analyticsData = {
      date: yesterdayStr,
      totalVisitors,
      uniqueVisitors,
      totalPageViews,
      newLeads,
      formSubmissions,
      demoClicks: demoClicksCount,
      avgTimeOnSite,
      avgScrollDepth,
      topCountry,
      topReferrer,
      pricingViews,
      mobilePerc,
      bounceRate,
    };

    if (existingAnalytics) {
      await ctx.db.patch(existingAnalytics._id, analyticsData);
    } else {
      await ctx.db.insert("analytics", analyticsData);
    }

    console.log(`Analytics rolled up for ${yesterdayStr}:`, analyticsData);
  },
});

export const cleanupOldSessions = internalMutation({
  handler: async (ctx) => {
    const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000);
    
    // This is just for logging - we don't actually delete old sessions
    // We just use this to keep track of active vs inactive visitors
    const activeVisitors = await ctx.db.query("visitors")
      .withIndex("by_last_seen", (q) => q.gte("lastSeen", thirtyMinutesAgo))
      .collect();

    console.log(`Active visitors in last 30 minutes: ${activeVisitors.length}`);
  },
});

export default crons;
