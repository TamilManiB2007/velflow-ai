import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  // TABLE 1: Every unique visitor
  visitors: defineTable({
    sessionId: v.string(),
    ipAddress: v.optional(v.string()),
    country: v.optional(v.string()),
    city: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    device: v.string(),
    browser: v.optional(v.string()),
    os: v.optional(v.string()),
    referrer: v.optional(v.string()),
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
    firstVisit: v.number(),
    lastSeen: v.number(),
    totalVisits: v.number(),
    totalTimeOnSite: v.number(),
    isLead: v.boolean(),
    isClient: v.boolean(),
  })
    .index("by_session", ["sessionId"])
    .index("by_country", ["country"])
    .index("by_last_seen", ["lastSeen"]),

  // TABLE 2: Every page view event
  pageViews: defineTable({
    sessionId: v.string(),
    visitorId: v.id("visitors"),
    page: v.string(),
    section: v.optional(v.string()),
    timeOnPage: v.number(),
    scrollDepth: v.number(),
    timestamp: v.number(),
    exitPage: v.boolean(),
  })
    .index("by_session", ["sessionId"])
    .index("by_page", ["page"])
    .index("by_timestamp", ["timestamp"])
    .index("by_visitor", ["visitorId"]),

  // TABLE 3: Warm leads
  leads: defineTable({
    visitorId: v.id("visitors"),
    sessionId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    company: v.optional(v.string()),
    leadScore: v.number(),
    leadSource: v.string(),
    interestedIn: v.optional(v.string()),
    status: v.string(),
    pricingPlanViewed: v.optional(v.string()),
    demoClicked: v.boolean(),
    timeOnSite: v.number(),
    createdAt: v.number(),
    notes: v.optional(v.string()),
  })
    .index("by_status", ["status"])
    .index("by_score", ["leadScore"])
    .index("by_email", ["email"])
    .index("by_visitor", ["visitorId"]),

  // TABLE 4: Contact form submissions
  contactSubmissions: defineTable({
    name: v.string(),
    email: v.string(),
    company: v.string(),
    fundingStage: v.optional(v.string()),
    serviceNeeded: v.string(),
    painPoint: v.string(),
    sessionId: v.optional(v.string()),
    visitorId: v.optional(v.id("visitors")),
    status: v.string(),
    priority: v.string(),
    submittedAt: v.number(),
    repliedAt: v.optional(v.number()),
    ipAddress: v.optional(v.string()),
    source: v.optional(v.string()),
  })
    .index("by_status", ["status"])
    .index("by_submitted_at", ["submittedAt"])
    .index("by_email", ["email"])
    .index("by_priority", ["priority"]),

  // TABLE 5: Cold email outreach
  emailOutreach: defineTable({
    prospectName: v.string(),
    prospectEmail: v.string(),
    prospectCompany: v.string(),
    prospectTitle: v.string(),
    industry: v.string(),
    linkedinUrl: v.optional(v.string()),
    emailSequence: v.number(),
    status: v.string(),
    sentAt: v.optional(v.number()),
    openedAt: v.optional(v.number()),
    repliedAt: v.optional(v.number()),
    replyText: v.optional(v.string()),
    followUp2SentAt: v.optional(v.number()),
    followUp3SentAt: v.optional(v.number()),
    notes: v.optional(v.string()),
    dealValue: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_email", ["prospectEmail"])
    .index("by_industry", ["industry"])
    .index("by_sent_at", ["sentAt"]),

  // TABLE 6: Demo clicks
  demoClicks: defineTable({
    sessionId: v.string(),
    visitorId: v.optional(v.id("visitors")),
    clickedAt: v.number(),
    sourcePage: v.string(),
    sourceSection: v.optional(v.string()),
    device: v.string(),
    country: v.optional(v.string()),
  })
    .index("by_clicked_at", ["clickedAt"])
    .index("by_session", ["sessionId"]),

  // TABLE 7: Daily analytics
  analytics: defineTable({
    date: v.string(),
    totalVisitors: v.number(),
    uniqueVisitors: v.number(),
    totalPageViews: v.number(),
    newLeads: v.number(),
    formSubmissions: v.number(),
    demoClicks: v.number(),
    avgTimeOnSite: v.number(),
    avgScrollDepth: v.number(),
    topCountry: v.optional(v.string()),
    topReferrer: v.optional(v.string()),
    pricingViews: v.number(),
    mobilePerc: v.number(),
    bounceRate: v.number(),
  })
    .index("by_date", ["date"]),

  // TABLE 8: Admin users
  adminUsers: defineTable({
    email: v.string(),
    name: v.string(),
    role: v.string(),
    lastLogin: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_email", ["email"]),

  // TABLE 9: Public reviews from friends/clients ← NEW
  reviews: defineTable({
    name: v.string(),
    role: v.string(),
    text: v.string(),
    rating: v.number(),
    approved: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_approved", ["approved"])
    .index("by_created_at", ["createdAt"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});