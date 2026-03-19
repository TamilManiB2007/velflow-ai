import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import MagneticButton from "./MagneticButton";
import { trackDemoClick } from "@/lib/convex";

const VOICEFLOW_DEMO_URL = "https://creator.voiceflow.com/share/69ad6157317a81999aeb1f59/development";

const chatMessages = [
  { role: "user" as const, text: "Hi, I need help with my subscription" },
  { role: "ai" as const, text: "Hello! I'd be happy to help with your subscription. Could you tell me your account email?" },
  { role: "user" as const, text: "sarah@startup.com" },
  { role: "ai" as const, text: "Found your account, Sarah! You're on the Growth plan ($49/mo). What would you like to change?" },
  { role: "user" as const, text: "I want to upgrade to Enterprise" },
  { role: "ai" as const, text: "Great choice! I've prepared your upgrade to Enterprise ($199/mo). This includes priority support, custom integrations, and unlimited API calls. Shall I proceed?" },
];

const LiveDemo = () => {
  const { ref, isVisible } = useScrollReveal();
  const [visibleMessages, setVisibleMessages] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setVisibleMessages((v) => {
        if (v >= chatMessages.length) {
          clearInterval(interval);
          return v;
        }
        return v + 1;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <section id="demo" className="py-20 md:py-32">
      <div ref={ref} className="mx-auto max-w-6xl px-4">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          {/* Left text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="font-mono text-xs uppercase tracking-widest text-primary">Live Demo</span>
            <h2 className="mt-2 font-heading text-4xl font-bold text-foreground md:text-5xl">
              Watch AI in Action
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              This is what your customer support looks like with VelFlow. Instant responses, 
              natural conversation, seamless transactions. No human needed.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Our AI agents handle everything from simple FAQs to complex account management — 
              all while maintaining your brand's voice and tone.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {/* Real Voiceflow demo — tracked via Convex */}
              <MagneticButton
                onClick={() => {
                  trackDemoClick("demo-section");
                  window.open(VOICEFLOW_DEMO_URL, "_blank", "noopener,noreferrer");
                }}
                className="clip-angular gold-shimmer px-8 py-3 font-heading text-lg font-semibold text-primary-foreground hover:brightness-110 transition-all"
              >
                Try Live Demo ⚡
              </MagneticButton>
              <MagneticButton
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="clip-angular border border-primary/40 px-8 py-3 font-heading text-lg font-semibold text-primary hover:bg-primary/10 transition-all"
              >
                Build Your Own
              </MagneticButton>
            </div>
          </motion.div>

          {/* Right chat mockup */}
          <motion.div
            className="glass rounded-2xl overflow-hidden"
            initial={{ opacity: 0, x: 40 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Chat header */}
            <div className="flex items-center gap-3 border-b border-border p-4">
              <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-sm text-primary">VelFlow Support Agent</span>
              <span className="ml-auto font-mono text-xs text-muted-foreground">Online</span>
            </div>

            {/* Messages */}
            <div className="h-[400px] overflow-y-auto p-4 space-y-4">
              {chatMessages.slice(0, visibleMessages).map((msg, i) => (
                <motion.div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-secondary text-secondary-foreground rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {visibleMessages < chatMessages.length && visibleMessages > 0 && (
                <div className="flex justify-start">
                  <div className="bg-secondary rounded-2xl px-4 py-3 rounded-bl-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LiveDemo;
