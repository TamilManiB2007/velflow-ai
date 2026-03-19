# VelFlow AI — Complete Project

Frontend (Lovable/React) + Backend (Convex) — Fully Connected ✅

## Backend URL
https://combative-cardinal-264.convex.site

---

## Run Locally (2 commands)

```bash
npm install
npm run dev
```

This starts BOTH frontend (localhost:5173) AND backend (Convex) together.

---

## Deploy

### Backend:
```bash
npx convex deploy
```

### Frontend:
Push to GitHub → Lovable or Netlify auto-deploys.

---

## Project Structure

```
velflow-ai/
├── convex/                  ← Backend (Convex)
│   ├── schema.ts            ← 8 database tables
│   ├── mutations/           ← Write operations
│   ├── queries/             ← Read operations
│   ├── actions/             ← Notifications + Lead scoring
│   ├── crons.ts             ← Scheduled jobs
│   └── http.ts              ← HTTP endpoints
│
├── src/                     ← Frontend (React + Vite)
│   ├── components/velflow/  ← All website sections
│   ├── lib/convex.ts        ← Backend connection (URL hardcoded)
│   ├── hooks/               ← Custom hooks incl. visitor tracking
│   ├── pages/Index.tsx      ← Main page
│   └── AdminDashboard.tsx   ← Real-time admin panel
│
└── package.json             ← All dependencies combined
```

---

## What's Connected

| Frontend Action        | Backend Endpoint     | Database Table        |
|------------------------|---------------------|-----------------------|
| Any page visit         | /track-visit        | visitors              |
| Scroll to section      | /track-pageview     | pageViews             |
| Click demo button      | /track-demo         | demoClicks            |
| Time on site (30s)     | /track-time         | visitors              |
| Submit contact form    | /contact            | contactSubmissions    |
| Lead score hits 50+    | Auto (internal)     | leads                 |
| Midnight every day     | Cron job (auto)     | analytics             |

---

## Add Discord Alerts

1. Go to your Discord server → Edit Channel → Integrations → Webhooks
2. Create webhook → Copy URL
3. Add to .env.local: DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
4. Run: npx convex deploy

You'll get a ping every time someone submits the contact form!
