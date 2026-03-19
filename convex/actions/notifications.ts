"use node";

import { action, internalAction } from "../_generated/server";
import { v } from "convex/values";
import { internal, api } from "../_generated/api";

// ─── Helper: Send email via Resend ───────────────────────────────────────────
async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping email");
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: "VelFlow AI <onboarding@resend.dev>",
      to,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Resend error:", err);
  }
}

// ─── 1. New Lead Alert (to YOU) ───────────────────────────────────────────────
export const newLeadAlert = internalAction({
  args: {
    submissionId: v.string(),
    name: v.string(),
    email: v.string(),
    company: v.string(),
    serviceNeeded: v.string(),
    priority: v.string(),
    painPoint: v.string(),
  },
  handler: async (_ctx, args) => {
    const ownerEmail = process.env.VELFLOW_EMAIL;
    if (!ownerEmail) return;

    const priorityColor =
      args.priority === "high" ? "#E84040" :
      args.priority === "medium" ? "#F5A623" : "#9A9890";

    const priorityEmoji =
      args.priority === "high" ? "🔥" :
      args.priority === "medium" ? "⚡" : "📋";

    // ── Email to YOU ──────────────────────────────────────────────
    await sendEmail({
      to: ownerEmail,
      subject: `${priorityEmoji} New Lead: ${args.name} from ${args.company}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #07070A; color: #F0EEE8; padding: 32px; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #F5A623; font-size: 28px; margin: 0;">VelFlow AI</h1>
            <p style="color: #9A9890; font-size: 12px; margin: 4px 0 0;">New Lead Notification</p>
          </div>

          <div style="background: #0D0D14; border: 1px solid #F5A62322; border-radius: 12px; padding: 24px; margin-bottom: 16px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
              <span style="background: ${priorityColor}22; color: ${priorityColor}; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: bold; text-transform: uppercase;">
                ${args.priority} priority
              </span>
            </div>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #9A9890; font-size: 13px; width: 120px;">Name</td>
                <td style="padding: 8px 0; color: #F0EEE8; font-size: 13px; font-weight: bold;">${args.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #9A9890; font-size: 13px;">Company</td>
                <td style="padding: 8px 0; color: #F0EEE8; font-size: 13px;">${args.company}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #9A9890; font-size: 13px;">Email</td>
                <td style="padding: 8px 0; color: #F5A623; font-size: 13px;">
                  <a href="mailto:${args.email}" style="color: #F5A623;">${args.email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #9A9890; font-size: 13px;">Service</td>
                <td style="padding: 8px 0; color: #F0EEE8; font-size: 13px;">${args.serviceNeeded}</td>
              </tr>
            </table>

            <div style="margin-top: 16px; padding: 16px; background: #13131C; border-radius: 8px; border-left: 3px solid #F5A623;">
              <p style="color: #9A9890; font-size: 11px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.1em;">Their Challenge</p>
              <p style="color: #F0EEE8; font-size: 14px; margin: 0; line-height: 1.6;">${args.painPoint}</p>
            </div>
          </div>

          <div style="text-align: center;">
            <a href="mailto:${args.email}?subject=Re: Your VelFlow AI inquiry&body=Hi ${args.name},%0D%0A%0D%0AThank you for reaching out to VelFlow AI!%0D%0A%0D%0A"
              style="display: inline-block; background: #F5A623; color: #07070A; padding: 12px 32px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 14px;">
              Reply to ${args.name} →
            </a>
          </div>

          <p style="text-align: center; color: #454340; font-size: 11px; margin-top: 24px;">
            VelFlow AI · Sharp as Vel. Smooth as Flow.
          </p>
        </div>
      `,
    });

    // ── Auto reply to CLIENT ──────────────────────────────────────
    await sendEmail({
      to: args.email,
      subject: `We received your message, ${args.name.split(" ")[0]}! ⚡`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #07070A; color: #F0EEE8; padding: 32px; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #F5A623; font-size: 32px; margin: 0;">VelFlow AI</h1>
            <p style="color: #9A9890; font-size: 12px; margin: 4px 0 0; letter-spacing: 0.2em; text-transform: uppercase;">Sharp as Vel. Smooth as Flow.</p>
          </div>

          <h2 style="color: #F0EEE8; font-size: 22px; margin: 0 0 8px;">
            Hey ${args.name.split(" ")[0]}, we got your message! 🔥
          </h2>
          <p style="color: #9A9890; font-size: 14px; line-height: 1.7; margin: 0 0 24px;">
            Thanks for reaching out about <strong style="color: #F5A623;">${args.serviceNeeded}</strong>.
            We've received your request and our team is reviewing it right now.
          </p>

          <div style="background: #0D0D14; border: 1px solid #F5A62322; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <p style="color: #9A9890; font-size: 11px; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.1em;">What happens next?</p>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; gap: 12px; align-items: flex-start;">
                <span style="background: #F5A62322; color: #F5A623; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; flex-shrink: 0; text-align: center; line-height: 24px;">1</span>
                <div>
                  <p style="color: #F0EEE8; font-size: 13px; margin: 0; font-weight: bold;">Review your request</p>
                  <p style="color: #9A9890; font-size: 12px; margin: 2px 0 0;">We're looking at your requirements right now</p>
                </div>
              </div>
              <div style="display: flex; gap: 12px; align-items: flex-start;">
                <span style="background: #F5A62322; color: #F5A623; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; flex-shrink: 0; text-align: center; line-height: 24px;">2</span>
                <div>
                  <p style="color: #F0EEE8; font-size: 13px; margin: 0; font-weight: bold;">Personal reply within 24 hours</p>
                  <p style="color: #9A9890; font-size: 12px; margin: 2px 0 0;">We'll send you a custom plan and pricing</p>
                </div>
              </div>
              <div style="display: flex; gap: 12px; align-items: flex-start;">
                <span style="background: #F5A62322; color: #F5A623; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; flex-shrink: 0; text-align: center; line-height: 24px;">3</span>
                <div>
                  <p style="color: #F0EEE8; font-size: 13px; margin: 0; font-weight: bold;">Build starts in 3–7 days</p>
                  <p style="color: #9A9890; font-size: 12px; margin: 2px 0 0;">Your AI agent goes live fast</p>
                </div>
              </div>
            </div>
          </div>

          <div style="background: #F5A62310; border: 1px solid #F5A62330; border-radius: 12px; padding: 16px; text-align: center; margin-bottom: 24px;">
            <p style="color: #F5A623; font-size: 13px; margin: 0; font-weight: bold;">
              🔒 Zero Risk Guarantee
            </p>
            <p style="color: #9A9890; font-size: 12px; margin: 4px 0 0;">
              No payment until you approve the demo. 100% satisfaction guaranteed.
            </p>
          </div>

          <p style="color: #9A9890; font-size: 13px; line-height: 1.7; margin: 0 0 24px;">
            In the meantime, feel free to reply to this email with any questions.
            We're here to help!
          </p>

          <p style="color: #F0EEE8; font-size: 14px; margin: 0;">
            Talk soon,<br/>
            <strong style="color: #F5A623;">Tamilmani</strong><br/>
            <span style="color: #9A9890; font-size: 12px;">Founder, VelFlow AI</span>
          </p>

          <hr style="border: none; border-top: 1px solid #1A1A26; margin: 24px 0;" />
          <p style="text-align: center; color: #454340; font-size: 11px; margin: 0;">
            VelFlow AI · Chennai, India · velflow.ai
          </p>
        </div>
      `,
    });

    // ── Discord alert (bonus) ─────────────────────────────────────
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (webhookUrl) {
      const priorityEmoji =
        args.priority === "high" ? "🔥" :
        args.priority === "medium" ? "⚡" : "📋";
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `${priorityEmoji} **New Lead!** ${args.name} from ${args.company} wants **${args.serviceNeeded}** · ${args.email}`,
        }),
      });
    }
  },
});

// ─── 2. New Review Alert (to YOU) ────────────────────────────────────────────
export const newReviewAlert = internalAction({
  args: {
    name: v.string(),
    role: v.string(),
    text: v.string(),
    rating: v.number(),
  },
  handler: async (_ctx, args) => {
    const ownerEmail = process.env.VELFLOW_EMAIL;
    if (!ownerEmail) return;

    const stars = "★".repeat(args.rating) + "☆".repeat(5 - args.rating);

    await sendEmail({
      to: ownerEmail,
      subject: `⭐ New Review from ${args.name} — ${stars}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #07070A; color: #F0EEE8; padding: 32px; border-radius: 16px;">
          <h1 style="color: #F5A623; text-align: center;">New Review! ⭐</h1>

          <div style="background: #0D0D14; border: 1px solid #F5A62322; border-radius: 12px; padding: 24px;">
            <p style="color: #F5A623; font-size: 24px; margin: 0 0 12px;">${stars}</p>
            <p style="color: #F0EEE8; font-size: 16px; font-style: italic; line-height: 1.7; margin: 0 0 16px;">
              "${args.text}"
            </p>
            <p style="color: #9A9890; font-size: 13px; margin: 0;">
              — <strong style="color: #F0EEE8;">${args.name}</strong>
              ${args.role ? `<span style="color: #454340;"> · ${args.role}</span>` : ""}
            </p>
          </div>

          <p style="text-align: center; color: #9A9890; font-size: 12px; margin-top: 24px;">
            This review is now live on your website!
          </p>
        </div>
      `,
    });
  },
});

// ─── 3. Daily Digest ─────────────────────────────────────────────────────────
export const dailyFollowUpDigest = internalAction({
  handler: async (ctx) => {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) return;

    const followUpDue = await ctx.runQuery(api.queries.emailOutreach.getReadyToFollowUp) as any[];
    const newSubmissions = await ctx.runQuery(api.queries.contactSubmissions.getNewSubmissions) as any[];
    const hotLeads = await ctx.runQuery(api.queries.leads.getHotLeads) as any[];
    const outreachStats = await ctx.runQuery(api.queries.emailOutreach.getOutreachStats) as any;

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `📊 **Daily Digest** — ${followUpDue.length} follow-ups due · ${hotLeads.length} hot leads · ${newSubmissions.length} unread forms · $${(outreachStats?.metrics?.projectedRevenue ?? 0).toLocaleString()} pipeline`,
      }),
    });
  },
});

// ─── 4. Weekly Report ────────────────────────────────────────────────────────
export const weeklyReport = internalAction({
  handler: async (ctx) => {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) return;

    const growthTrend = await ctx.runQuery(api.queries.analytics.getGrowthTrend) as any;
    const overview = await ctx.runQuery(api.queries.adminDashboard.getDashboardOverview) as any;

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `📈 **Weekly Report** — ${growthTrend?.thisWeek?.visitors ?? 0} visitors · ${growthTrend?.thisWeek?.leads ?? 0} leads · ${overview?.revenue?.closedWonCount ?? 0} deals closed · $${(overview?.revenue?.closedWonValue ?? 0).toLocaleString()} revenue`,
      }),
    });
  },
});