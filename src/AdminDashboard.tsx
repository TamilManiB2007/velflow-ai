import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { motion } from "framer-motion";
import CustomCursor from "@/components/velflow/CustomCursor";

// Container animations for staggered entry
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  },
};

export function AdminDashboard() {
  const overview = useQuery(api.queries.adminDashboard.getDashboardOverview);
  const liveFeed = useQuery(api.queries.adminDashboard.getLiveVisitorFeed);
  const newSubmissions = useQuery(api.queries.contactSubmissions.getNewSubmissions);
  const hotLeads = useQuery(api.queries.leads.getHotLeads);
  const outreachStats = useQuery(api.queries.emailOutreach.getOutreachStats);
  const followUpDue = useQuery(api.queries.emailOutreach.getReadyToFollowUp);

  if (!overview) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07070A] cursor-none">
        <CustomCursor />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#F5A623] border-t-transparent mx-auto drop-shadow-[0_0_15px_rgba(245,166,35,0.5)]" />
          <p className="mt-6 font-mono text-sm text-[#9A9890] tracking-widest uppercase">Initializing Interface...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07070A] text-[#F0EEE8] font-mono selection:bg-[#F5A623]/30 cursor-none relative overflow-hidden">
      {/* Dynamic Background Gradients for 3D depth */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#F5A623]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#3A8AE8]/5 blur-[120px] pointer-events-none" />
      
      <CustomCursor />

      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky top-0 z-50 border-b border-[#F5A62322] bg-[#07070A]/70 backdrop-blur-xl px-6 py-4 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
      >
        <div className="flex items-center gap-4">
          <span className="font-bold text-xl tracking-widest drop-shadow-[0_0_8px_rgba(245,166,35,0.4)]">
            Vel<span className="text-[#F5A623]">Flow</span>
          </span>
          <div className="h-4 w-[1px] bg-[#F5A62344]" />
          <span className="text-xs text-[#9A9890] tracking-widest uppercase font-medium">Command Center</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-medium tracking-wide">
          <div className="px-3 py-1.5 rounded-full bg-[#3ABA6A]/10 border border-[#3ABA6A]/20 flex items-center gap-2 shadow-[0_0_10px_rgba(58,186,106,0.1)]">
            <span className="h-2 w-2 rounded-full bg-[#3ABA6A] animate-pulse shadow-[0_0_5px_#3ABA6A]" />
            <span className="text-[#3ABA6A]">SYSTEM ACTIVE</span>
          </div>
        </div>
      </motion.header>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 py-8 space-y-8 relative z-10"
      >
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <KpiCard label="Active Now" value={overview.visitors.activeNow} color="green" />
          <KpiCard label="Today's Visitors" value={overview.visitors.today} color="gold" />
          <KpiCard label="New Leads" value={overview.leads.new} color="blue" />
          <KpiCard label="Unread Forms" value={overview.forms.unread} color={overview.forms.unread > 0 ? "red" : "gray"} />
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <KpiCard label="Total Visitors" value={overview.visitors.totalAllTime} color="gold" />
          <KpiCard label="Hot Leads (80+)" value={overview.leads.hot} color="red" />
          <KpiCard label="Demo Clicks" value={overview.demo.totalClicks} color="purple" />
          <KpiCard label="Revenue Closed" value={overview.revenue.closedWonValue} color="green" prefix="$" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Email Outreach Pipeline */}
          <motion.div variants={itemVariants} className="glass-panel group">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#F5A623] group-hover:drop-shadow-[0_0_5px_rgba(245,166,35,0.5)] transition-all">Outreach Pipeline</h2>
              <span className="text-[10px] text-[#454340] border border-[#F5A62322] px-2 py-1 rounded bg-[#0D0D14]">LAST 30 DAYS</span>
            </div>
            
            {outreachStats ? (
              <>
                <div className="space-y-4">
                  <PipelineRow label="Not Sent" value={outreachStats.pipeline.not_sent} total={50} color="#454340" />
                  <PipelineRow label="Sent" value={outreachStats.pipeline.sent} total={50} color="#3A8AE8" />
                  <PipelineRow label="Opened" value={outreachStats.pipeline.opened} total={50} color="#F5A623" />
                  <PipelineRow label="Replied ✅" value={outreachStats.pipeline.replied_positive} total={50} color="#9B6FE8" />
                  <PipelineRow label="Booked 📅" value={outreachStats.pipeline.booked} total={50} color="#3AD0E8" />
                  <PipelineRow label="Won 🏆" value={outreachStats.pipeline.closed_won} total={50} color="#3ABA6A" />
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[#F5A62314] pt-5">
                  <MiniStat label="Open Rate" value={`${outreachStats.metrics.openRate}%`} glowColor="#F5A623" />
                  <MiniStat label="Reply Rate" value={`${outreachStats.metrics.replyRate}%`} glowColor="#9B6FE8" />
                  <MiniStat label="Proj. Revenue" value={`$${outreachStats.metrics.projectedRevenue.toLocaleString()}`} glowColor="#3ABA6A" />
                  <MiniStat label="Avg Deal" value={`$${outreachStats.metrics.avgDealValue.toLocaleString()}`} glowColor="#3AD0E8" />
                </div>
              </>
            ) : <p className="text-xs text-[#454340] animate-pulse">Synchronizing Data...</p>}
          </motion.div>

          {/* Follow-Up Due */}
          <motion.div variants={itemVariants} className="glass-panel group">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#F5A623] group-hover:drop-shadow-[0_0_5px_rgba(245,166,35,0.5)] transition-all">Action Required</h2>
              {followUpDue && followUpDue.length > 0 && (
                <span className="animate-pulse h-2 w-2 rounded-full bg-[#E84040] shadow-[0_0_8px_#E84040]" />
              )}
            </div>
            <p className="text-xs text-[#9A9890] mb-5">Leads waiting 4+ days for next communication.</p>
            
            {followUpDue?.length === 0 && (
              <div className="flex flex-col items-center justify-center p-8 border border-dashed border-[#3ABA6A]/30 rounded-xl bg-[#3ABA6A]/5">
                <span className="text-2xl mb-2">✨</span>
                <p className="text-xs text-[#3ABA6A] font-medium tracking-widest uppercase">Pipeline Clear</p>
              </div>
            )}
            
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              {followUpDue?.map((lead, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.02, x: 5, backgroundColor: "#1A1A26" }}
                  key={lead._id} 
                  className="rounded-lg border border-[#F5A62314] bg-[#0A0A10] p-4 cursor-none shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-[#F0EEE8]">{lead.prospectName}</span>
                    <span className="text-[10px] font-bold tracking-widest text-[#F5A623] px-2 py-1 rounded bg-[#F5A623]/10">SEQ {lead.emailSequence + 1}</span>
                  </div>
                  <div className="text-xs text-[#9A9890] flex items-center gap-2">
                    <span>{lead.prospectCompany}</span>
                    <span className="text-[#454340]">/</span>
                    <span className="text-[#3A8AE8]">{lead.industry}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* New Form Submissions */}
        <motion.div variants={itemVariants} className="glass-panel group">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#F5A623] group-hover:drop-shadow-[0_0_5px_rgba(245,166,35,0.5)] transition-all">Inbound Intel</h2>
            {newSubmissions && newSubmissions.length > 0 && (
              <span className="rounded bg-[#E84040]/20 border border-[#E84040]/30 px-2 py-1 text-[10px] text-[#E84040] shadow-[0_0_10px_rgba(232,64,64,0.2)] font-bold">
                {newSubmissions.length} PENDING
              </span>
            )}
          </div>
          
          {newSubmissions?.length === 0 && <p className="text-xs text-[#454340]">Awaiting new signals...</p>}
          
          <div className="grid gap-4 md:grid-cols-2">
            {newSubmissions?.map((sub, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.02, y: -4, zIndex: 10 }}
                key={sub._id} 
                className={`rounded-xl border p-5 backdrop-blur-md shadow-lg transition-all cursor-none
                  ${sub.priority === "high" ? "border-[#E84040]/40 bg-gradient-to-br from-[#E84040]/10 to-[#E84040]/5 shadow-[0_8px_30px_rgba(232,64,64,0.08)]" : 
                    sub.priority === "medium" ? "border-[#F5A623]/30 bg-gradient-to-br from-[#F5A623]/10 to-[#F5A623]/5 shadow-[0_8px_30px_rgba(245,166,35,0.08)]" : 
                    "border-[#F5A62314] bg-[#0A0A10]"}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm font-bold tracking-wide text-[#F0EEE8]">{sub.name}</span>
                      <motion.span 
                        animate={sub.priority === 'high' ? { scale: [1, 1.1, 1] } : {}} 
                        transition={{ repeat: Infinity, duration: 2 }}
                        className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest 
                          ${sub.priority === "high" ? "bg-[#E84040] text-white shadow-[0_0_8px_#E84040]" : 
                            sub.priority === "medium" ? "bg-[#F5A623]/20 text-[#F5A623] border border-[#F5A623]/30" : 
                            "bg-[#454340]/20 text-[#9A9890] border border-[#454340]/30"}`}
                      >
                        {sub.priority}
                      </motion.span>
                    </div>
                    <div className="text-xs text-[#9A9890] mb-3">{sub.company} <span className="text-[#454340] mx-1">|</span> {sub.email}</div>
                    
                    <div className="inline-block rounded-md bg-[#13131C] border border-[#F5A62314] px-2 py-1 mb-3">
                      <span className="text-[10px] text-[#454340] uppercase mr-2">Targeted:</span>
                      <span className="text-[11px] font-medium text-[#3A8AE8]">{sub.serviceNeeded}</span>
                    </div>
                    
                    <p className="text-[11px] text-[#9A9890] leading-relaxed line-clamp-2 border-l-2 border-[#F5A62322] pl-3 italic">
                      "{sub.painPoint}"
                    </p>
                  </div>
                  <div className="text-[10px] text-[#454340] font-mono tracking-wider whitespace-nowrap">
                    {new Date(sub.submittedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Live Feed & Hot Leads Row */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Live Feed */}
          <motion.div variants={itemVariants} className="glass-panel group">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#F5A623] mb-5 group-hover:drop-shadow-[0_0_5px_rgba(245,166,35,0.5)] transition-all">Global Telemetry</h2>
            {liveFeed?.length === 0 && <p className="text-xs text-[#454340]">Awaiting network connections...</p>}
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {liveFeed?.map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02, x: 5, backgroundColor: item.isLead ? "#F5A62310" : "#1A1A26" }}
                  key={i} 
                  className={`flex items-center gap-4 rounded-lg border p-3 cursor-none transition-all
                    ${item.isLead ? "border-[#F5A623]/30 bg-[#F5A623]/5 shadow-[0_0_15px_rgba(245,166,35,0.05)]" : "border-[#F5A62310] bg-[#0A0A10]"}`}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${item.isLead ? 'bg-[#F5A623]/20 shadow-[0_0_10px_rgba(245,166,35,0.4)]' : 'bg-[#13131C] border border-[#F5A62314]'}`}>
                    <span className="text-sm">{item.isLead ? "🔥" : "📡"}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-[11px] mb-1">
                      <span className="font-bold text-[#F0EEE8]">{item.country}</span>
                      <span className="text-[#454340]">/</span>
                      <span className="text-[#9A9890]">{item.device}</span>
                      <span className="text-[#454340]">/</span>
                      <span className="text-[#3A8AE8] font-mono">{item.page}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] text-[#454340] font-mono">
                        DPTH: {item.scrollDepth}% <span className="mx-1">·</span> T-{item.timeAgo}
                      </div>
                      {item.leadScore > 0 && (
                        <div className="text-[10px] font-bold text-[#F5A623] px-1.5 py-0.5 rounded bg-[#F5A623]/10">
                          {item.leadScore} PTS
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Hot Leads */}
          <motion.div variants={itemVariants} className="glass-panel group">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#F5A623] mb-5 group-hover:drop-shadow-[0_0_5px_rgba(245,166,35,0.5)] transition-all">Priority Targets (70+ PTS)</h2>
            {hotLeads?.length === 0 && <p className="text-xs text-[#454340]">No critical targets currently identified.</p>}
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {hotLeads?.map((lead, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.03, y: -4, zIndex: 10 }}
                  key={lead._id} 
                  className="rounded-xl border border-[#9B6FE8]/40 bg-gradient-to-br from-[#9B6FE8]/10 to-[#0A0A10] p-5 cursor-none shadow-[0_8px_30px_rgba(155,111,232,0.1)] transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-base font-bold tracking-wide text-[#F0EEE8] drop-shadow-md">{lead.name ?? "Classified Target"}</span>
                      {lead.company && <div className="text-xs text-[#9A9890] mt-0.5">{lead.company}</div>}
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-lg font-black text-[#F5A623] drop-shadow-[0_0_8px_rgba(245,166,35,0.6)]">{lead.leadScore}</span>
                      <span className="text-[9px] text-[#454340] tracking-widest uppercase">Score</span>
                    </div>
                  </div>
                  
                  {lead.email && (
                    <div className="inline-flex items-center gap-2 mb-4 px-2 py-1 rounded-md bg-[#13131C] border border-[#9B6FE8]/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#9B6FE8] animate-pulse" />
                      <div className="text-[11px] font-mono text-[#9B6FE8]">{lead.email}</div>
                    </div>
                  )}
                  
                  <div className="mt-auto flex items-center justify-between border-t border-[#9B6FE8]/20 pt-3">
                    <span className={`text-[10px] font-bold rounded px-2 py-1 uppercase tracking-widest 
                      ${lead.status === "new" ? "bg-[#F5A623]/20 text-[#F5A623]" : "bg-[#3ABA6A]/20 text-[#3ABA6A]"} shadow-inner`}
                    >
                      {lead.status}
                    </span>
                    <span className="text-[10px] text-[#454340] uppercase tracking-wider font-mono bg-[#0A0A10] px-2 py-1 rounded border border-[#F5A62314]">
                      {lead.leadSource}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.main>

      <style>{`
        .glass-panel {
          border-radius: 1rem;
          border: 1px solid rgba(245, 166, 35, 0.15);
          background: rgba(13, 13, 20, 0.6);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          padding: 1.5rem;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.02), 0 8px 30px rgba(0, 0, 0, 0.4);
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(10, 10, 16, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(245, 166, 35, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(245, 166, 35, 0.6);
        }
      `}</style>
    </div>
  );
}

function KpiCard({ label, value, color, prefix = "" }: { label: string; value: number; color: "green"|"gold"|"blue"|"red"|"purple"|"gray"; prefix?: string }) {
  const styles = { 
    green: { text: "text-[#3ABA6A]", border: "border-[#3ABA6A]/30", bg: "bg-[#3ABA6A]/5", shadow: "shadow-[0_0_20px_rgba(58,186,106,0.1)]", glow: "group-hover:drop-shadow-[0_0_8px_rgba(58,186,106,0.6)]" },
    gold: { text: "text-[#F5A623]", border: "border-[#F5A623]/30", bg: "bg-[#F5A623]/5", shadow: "shadow-[0_0_20px_rgba(245,166,35,0.1)]", glow: "group-hover:drop-shadow-[0_0_8px_rgba(245,166,35,0.6)]" },
    blue: { text: "text-[#3A8AE8]", border: "border-[#3A8AE8]/30", bg: "bg-[#3A8AE8]/5", shadow: "shadow-[0_0_20px_rgba(58,138,232,0.1)]", glow: "group-hover:drop-shadow-[0_0_8px_rgba(58,138,232,0.6)]" },
    red: { text: "text-[#E84040]", border: "border-[#E84040]/30", bg: "bg-[#E84040]/5", shadow: "shadow-[0_0_20px_rgba(232,64,64,0.1)]", glow: "group-hover:drop-shadow-[0_0_8px_rgba(232,64,64,0.6)]" },
    purple: { text: "text-[#9B6FE8]", border: "border-[#9B6FE8]/30", bg: "bg-[#9B6FE8]/5", shadow: "shadow-[0_0_20px_rgba(155,111,232,0.1)]", glow: "group-hover:drop-shadow-[0_0_8px_rgba(155,111,232,0.6)]" },
    gray: { text: "text-[#9A9890]", border: "border-[#9A9890]/20", bg: "bg-[#0A0A10]", shadow: "shadow-none", glow: "" }
  };
  
  const currentStyle = styles[color];

  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ y: -6, scale: 1.03, zIndex: 10 }}
      className={`relative overflow-hidden rounded-2xl border p-5 backdrop-blur-md transition-all cursor-none group ${currentStyle.border} ${currentStyle.bg} ${currentStyle.shadow}`}
    >
      {/* Decorative slant */}
      <div className={`absolute -right-6 -top-6 w-16 h-16 rotate-45 opacity-20 transition-all group-hover:opacity-40 ${currentStyle.bg.replace('/5', '')}`} />
      
      <div className="relative z-10">
        <motion.div 
          className={`text-3xl sm:text-4xl font-black tracking-tight ${currentStyle.text} ${currentStyle.glow} transition-all duration-300`}
        >
          {prefix}{value.toLocaleString()}
        </motion.div>
        <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-[#9A9890]">{label}</div>
      </div>
    </motion.div>
  );
}

function PipelineRow({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-4 group">
      <span className="w-24 text-[11px] font-medium text-[#9A9890] truncate transition-colors group-hover:text-[#F0EEE8]">{label}</span>
      <div className="flex-1 rounded-full bg-[#0A0A10] border border-[#F5A62314] h-2.5 overflow-hidden shadow-inner">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="h-full rounded-full relative" 
          style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} 
        >
          {/* Shine effect on progress bar */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 rounded-t-full" />
        </motion.div>
      </div>
      <span className="w-8 text-right text-xs font-bold" style={{ color }}>{value}</span>
    </div>
  );
}

function MiniStat({ label, value, glowColor }: { label: string; value: string; glowColor: string }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="rounded-xl bg-gradient-to-b from-[#13131C] to-[#0A0A10] border border-[#F5A62314] px-4 py-3 cursor-none relative overflow-hidden group shadow-md"
    >
      <div 
        className="absolute top-0 left-0 w-full h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: glowColor, boxShadow: `0 0 8px ${glowColor}` }}
      />
      <div className="text-[9px] text-[#9A9890] font-bold uppercase tracking-widest">{label}</div>
      <div className="text-[15px] font-black tracking-wide mt-1 drop-shadow-md" style={{ color: glowColor }}>{value}</div>
    </motion.div>
  );
}
