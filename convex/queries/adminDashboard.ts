import { query } from "../_generated/server";
import { v } from "convex/values";

export const getDashboardOverview = query({
  handler: async (ctx) => {
    const now = Date.now();
    const todayStart = new Date().setHours(0, 0, 0, 0);
    const weekStart = now - (7 * 24 * 60 * 60 * 1000);
    const lastWeekStart = now - (14 * 24 * 60 * 60 * 1000);
    const fiveMinutesAgo = now - (5 * 60 * 1000);

    // Visitors
    const allVisitors = await ctx.db.query("visitors").collect();
    const todayVisitors = allVisitors.filter(v => v.firstVisit >= todayStart);
    const thisWeekVisitors = allVisitors.filter(v => v.firstVisit >= weekStart);
    const lastWeekVisitors = allVisitors.filter(v => v.firstVisit >= lastWeekStart && v.firstVisit < weekStart);
    const activeNow = allVisitors.filter(v => v.lastSeen >= fiveMinutesAgo);
    
    const visitorGrowth = lastWeekVisitors.length > 0 
      ? Math.round(((thisWeekVisitors.length - lastWeekVisitors.length) / lastWeekVisitors.length) * 100)
      : 0;

    // Leads
    const allLeads = await ctx.db.query("leads").collect();
    const newLeads = allLeads.filter(l => l.status === "new");
    const hotLeads = allLeads.filter(l => l.leadScore >= 80);
    const conversionRate = allVisitors.length > 0 ? Math.round((allLeads.length / allVisitors.length) * 100) : 0;

    // Outreach
    const allOutreach = await ctx.db.query("emailOutreach").collect();
    const sentEmails = allOutreach.filter(o => o.status !== "not_sent");
    const openedEmails = allOutreach.filter(o => o.openedAt);
    const repliedEmails = allOutreach.filter(o => o.status === "replied_positive");
    const followUpDue = allOutreach.filter(o => {
      const fourDaysAgo = now - (4 * 24 * 60 * 60 * 1000);
      return o.status === "sent" && o.sentAt && o.sentAt < fourDaysAgo && !o.repliedAt;
    });
    
    const openRate = sentEmails.length > 0 ? Math.round((openedEmails.length / sentEmails.length) * 100) : 0;
    const replyRate = sentEmails.length > 0 ? Math.round((repliedEmails.length / sentEmails.length) * 100) : 0;
    const pipelineValue = allOutreach.filter(o => o.dealValue).reduce((sum, o) => sum + (o.dealValue || 0), 0);

    // Forms
    const allSubmissions = await ctx.db.query("contactSubmissions").collect();
    const unreadSubmissions = allSubmissions.filter(s => s.status === "new");
    const highPrioritySubmissions = allSubmissions.filter(s => s.priority === "high");

    // Demo
    const allDemoClicks = await ctx.db.query("demoClicks").collect();
    const todayDemoClicks = allDemoClicks.filter(d => d.clickedAt >= todayStart);
    const demoConversionRate = allVisitors.length > 0 ? Math.round((allDemoClicks.length / allVisitors.length) * 100) : 0;

    // Revenue
    const closedWonLeads = allLeads.filter(l => l.status === "closed_won");
    const closedWonOutreach = allOutreach.filter(o => o.status === "closed_won" && o.dealValue);
    const totalRevenue = closedWonOutreach.reduce((sum, o) => sum + (o.dealValue || 0), 0);
    const avgDealValue = closedWonOutreach.length > 0 ? Math.round(totalRevenue / closedWonOutreach.length) : 0;

    return {
      visitors: {
        totalAllTime: allVisitors.length,
        today: todayVisitors.length,
        thisWeek: thisWeekVisitors.length,
        activeNow: activeNow.length,
        growthPercent: visitorGrowth,
      },
      leads: {
        total: allLeads.length,
        new: newLeads.length,
        hot: hotLeads.length,
        conversionRate,
      },
      outreach: {
        totalSent: sentEmails.length,
        openRate,
        replyRate,
        followUpDue: followUpDue.length,
        pipelineValue,
      },
      forms: {
        total: allSubmissions.length,
        unread: unreadSubmissions.length,
        highPriority: highPrioritySubmissions.length,
      },
      demo: {
        totalClicks: allDemoClicks.length,
        clicksToday: todayDemoClicks.length,
        conversionRate: demoConversionRate,
      },
      revenue: {
        closedWonCount: closedWonLeads.length,
        closedWonValue: totalRevenue,
        avgDealValue,
        projectedMonthly: totalRevenue, // Simplified - could be more complex
      },
    };
  },
});

export const getLiveVisitorFeed = query({
  handler: async (ctx) => {
    const recentPageViews = await ctx.db
      .query("pageViews")
      .withIndex("by_timestamp")
      .order("desc")
      .take(20);

    const feed = [];
    for (const pv of recentPageViews) {
      const visitor = await ctx.db.get(pv.visitorId);
      if (visitor) {
        // Check if visitor is a lead
        const lead = await ctx.db
          .query("leads")
          .withIndex("by_visitor", (q) => q.eq("visitorId", pv.visitorId))
          .unique();

        const timeAgo = Math.round((Date.now() - pv.timestamp) / (1000 * 60)); // minutes ago
        const timeAgoText = timeAgo < 1 ? "Just now" : 
                          timeAgo === 1 ? "1 minute ago" : 
                          timeAgo < 60 ? `${timeAgo} minutes ago` : 
                          `${Math.round(timeAgo / 60)} hours ago`;

        feed.push({
          visitorId: pv.visitorId,
          sessionId: pv.sessionId,
          country: visitor.country ? `🌍 ${visitor.country}` : "🌍 Unknown",
          device: visitor.device === "mobile" ? "📱 Mobile" : 
                  visitor.device === "tablet" ? "📱 Tablet" : "💻 Desktop",
          page: pv.page,
          scrollDepth: pv.scrollDepth,
          timeAgo: timeAgoText,
          isLead: visitor.isLead,
          leadScore: lead?.leadScore || 0,
        });
      }
    }

    return feed;
  },
});

export const getAnalyticsChart = query({
  args: { days: v.number() },
  handler: async (ctx, args) => {
    const analytics = await ctx.db
      .query("analytics")
      .withIndex("by_date")
      .order("desc")
      .take(args.days);

    return analytics.reverse().map(a => ({
      date: new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      visitors: a.totalVisitors,
      leads: a.newLeads,
      demoClicks: a.demoClicks,
      formSubmissions: a.formSubmissions,
    }));
  },
});

export const getTopPages = query({
  handler: async (ctx) => {
    const pageViews = await ctx.db.query("pageViews").collect();
    const demoClicks = await ctx.db.query("demoClicks").collect();
    const leads = await ctx.db.query("leads").collect();

    const pageStats: Record<string, any> = {};

    pageViews.forEach(pv => {
      if (!pageStats[pv.page]) {
        pageStats[pv.page] = {
          page: pv.page,
          views: 0,
          totalTime: 0,
          totalScroll: 0,
          demoClicksFromPage: 0,
          leadsGeneratedFromPage: 0,
        };
      }
      
      const stats = pageStats[pv.page];
      stats.views++;
      stats.totalTime += pv.timeOnPage;
      stats.totalScroll += pv.scrollDepth;
    });

    // Count demo clicks by source page
    demoClicks.forEach(dc => {
      if (pageStats[dc.sourcePage]) {
        pageStats[dc.sourcePage].demoClicksFromPage++;
      }
    });

    // Count leads by interested service (approximate page mapping)
    leads.forEach(lead => {
      const interestedPage = lead.interestedIn?.toLowerCase().includes('voice') ? 'voice-agents' :
                           lead.interestedIn?.toLowerCase().includes('lead') ? 'lead-generation' :
                           lead.interestedIn?.toLowerCase().includes('support') ? 'customer-support' :
                           'home';
      
      if (pageStats[interestedPage]) {
        pageStats[interestedPage].leadsGeneratedFromPage++;
      }
    });

    return Object.values(pageStats).map((stats: any) => ({
      ...stats,
      avgTimeSeconds: stats.views > 0 ? Math.round(stats.totalTime / stats.views) : 0,
      avgScrollDepth: stats.views > 0 ? Math.round(stats.totalScroll / stats.views) : 0,
    })).sort((a: any, b: any) => b.views - a.views);
  },
});

export const getGeographicBreakdown = query({
  handler: async (ctx) => {
    const visitors = await ctx.db.query("visitors").collect();
    const leads = await ctx.db.query("leads").collect();
    
    const countryStats: Record<string, any> = {};
    
    visitors.forEach(v => {
      if (v.country) {
        if (!countryStats[v.country]) {
          countryStats[v.country] = {
            country: v.country,
            visitors: 0,
            leads: 0,
          };
        }
        countryStats[v.country].visitors++;
      }
    });

    // Count leads by visitor country
    for (const lead of leads) {
      const visitor = await ctx.db.get(lead.visitorId);
      if (visitor?.country && countryStats[visitor.country]) {
        countryStats[visitor.country].leads++;
      }
    }

    const countryFlags: Record<string, string> = {
      "United States": "🇺🇸",
      "Canada": "🇨🇦",
      "United Kingdom": "🇬🇧",
      "Germany": "🇩🇪",
      "France": "🇫🇷",
      "Australia": "🇦🇺",
      "India": "🇮🇳",
      "Japan": "🇯🇵",
      "Brazil": "🇧🇷",
      "Netherlands": "🇳🇱",
    };

    return Object.values(countryStats)
      .map((stats: any) => ({
        ...stats,
        flag: countryFlags[stats.country] || "🌍",
        conversionRate: stats.visitors > 0 ? Math.round((stats.leads / stats.visitors) * 100) : 0,
      }))
      .sort((a: any, b: any) => b.visitors - a.visitors)
      .slice(0, 10);
  },
});
