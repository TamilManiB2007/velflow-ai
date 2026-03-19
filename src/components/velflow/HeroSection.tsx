import { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { useTextScramble } from "@/hooks/useTextScramble";
import { useTypewriter } from "@/hooks/useTypewriter";
import { useCountUp } from "@/hooks/useCountUp";
import { useIsMobile } from "@/hooks/use-mobile";
import MagneticButton from "./MagneticButton";
import ErrorBoundary from "./ErrorBoundary";

const HeroParticles = lazy(() => import("./HeroParticles"));

const phrases = [
  "We build AI chatbots that close deals...",
  "We build AI voice agents that never sleep...",
  "We build customer support that scales...",
  "We automate your marketing pipeline...",
];

const stats = [
  { value: 7, suffix: " Days", label: "Average Delivery" },
  { value: 85, suffix: "%", label: "Profit Margin" },
  { value: 30, suffix: "hrs", label: "Saved Weekly" },
  { value: 24, suffix: "/7", label: "AI Uptime" },
];

const HeroSection = () => {
  const sharp = useTextScramble("SHARP.", true, 1200);
  const precise = useTextScramble("PRECISE.", true, 1500);
  const automated = useTextScramble("AUTOMATED.", true, 1800);
  const subtitle = useTypewriter(phrases);
  const isMobile = useIsMobile();

  return (
    <section id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* 3D Particles — desktop only, wrapped in ErrorBoundary so crashes don't break the page */}
      {!isMobile && (
        <ErrorBoundary fallback={<div className="gradient-mesh-bg absolute inset-0" />}>
          <Suspense fallback={null}>
            <HeroParticles />
          </Suspense>
        </ErrorBoundary>
      )}

      {/* Mobile gradient fallback */}
      {isMobile && <div className="gradient-mesh-bg absolute inset-0" />}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/40" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">

        {/* ── "Live — AI Automation Agency" badge REMOVED ──
            It was overlapping the fixed navigation pill at the top.
            The heading itself communicates the value clearly. */}

        {/* Main heading */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className="font-heading text-5xl font-bold leading-tight tracking-tight md:text-7xl lg:text-8xl">
            <span className="block text-foreground">{sharp}</span>
            <span className="block text-primary text-glow">{precise}</span>
            <span className="block text-foreground">{automated}</span>
          </h1>
        </motion.div>

        {/* Typewriter subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 h-8"
        >
          <p className="font-mono text-base text-muted-foreground md:text-lg">
            {subtitle}
            <span className="ml-0.5 inline-block w-0.5 h-5 bg-primary animate-pulse" />
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >

          <MagneticButton
            onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
            className="clip-angular border border-primary/40 bg-transparent px-8 py-3 font-heading text-lg font-semibold text-primary transition-all hover:bg-primary/10"
          >
            View Pricing
          </MagneticButton>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4"
        >
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ delay: 2, y: { repeat: Infinity, duration: 2 } }}
      >
        <div className="h-10 w-6 rounded-full border-2 border-primary/40 p-1">
          <div className="h-2 w-full rounded-full bg-primary animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
};

function StatCard({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const count = useCountUp(value, 2000);
  return (
    <div className="glass rounded-lg p-4 text-center animate-float" style={{ animationDelay: `${Math.random() * 2}s` }}>
      <div className="font-heading text-3xl font-bold text-primary">
        {count}
        <span className="text-primary">{suffix}</span>
      </div>
      <div className="mt-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

export default HeroSection;
