import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCountUp } from "@/hooks/useCountUp";

const steps = [
  {
    emoji: "📧📧📧🎫🎫📞📞",
    title: "Your team is overwhelmed.",
    desc: "200+ tickets/week. Leads falling through cracks. Support drowning.",
    counter: { value: 200, suffix: " tickets/week" },
  },
  {
    emoji: "⚡",
    title: "VelFlow takes over.",
    desc: "Our AI agents deploy in days — not months. Instant automation.",
    counter: null,
  },
  {
    emoji: "",
    title: "Before vs After",
    desc: "",
    counter: null,
    split: true,
  },
  {
    emoji: "",
    title: "Your startup. On autopilot.",
    desc: "Revenue scales. Team breathes. Growth accelerates.",
    counter: { value: 25000, suffix: "/mo", prefix: "$" },
  },
];

const ScrollStorytelling = () => {
  return (
    <section className="relative py-20 md:py-32">
      <div className="mx-auto max-w-5xl px-4">
        <SectionTitle title="The VelFlow Journey" />
        <div className="mt-16 space-y-24">
          <StoryStep1 />
          <StoryStep2 />
          <StoryStep3 />
          <StoryStep4 />
        </div>
      </div>
    </section>
  );
};

function SectionTitle({ title }: { title: string }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref} className="text-center">
      <motion.h2
        className="font-heading text-4xl font-bold text-foreground md:text-5xl"
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        {title}
      </motion.h2>
      <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-primary" />
    </div>
  );
}

function StoryStep1() {
  const { ref, isVisible } = useScrollReveal();
  const count = useCountUp(200, 2000, isVisible);
  return (
    <div ref={ref}>
      <motion.div
        className="glass rounded-2xl p-8 md:p-12 text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div className="text-4xl mb-4">📧📧📧🎫🎫📞📞</div>
        <h3 className="font-heading text-3xl font-bold text-foreground">Your team is overwhelmed.</h3>
        <p className="mt-2 text-muted-foreground">Leads falling through cracks. Support drowning. Growth stalling.</p>
        <div className="mt-6 font-heading text-5xl font-bold text-destructive">
          {count}<span className="text-2xl"> tickets/week</span>
        </div>
      </motion.div>
    </div>
  );
}

function StoryStep2() {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref}>
      <motion.div
        className="relative overflow-hidden rounded-2xl p-8 md:p-12 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isVisible ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8 }}
      >
        {isVisible && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        )}
        <div className="relative z-10">
          <div className="text-5xl mb-4">⚡</div>
          <h3 className="font-heading text-3xl font-bold text-primary text-glow">VelFlow takes over.</h3>
          <p className="mt-2 text-muted-foreground">Our AI agents deploy in days — not months.</p>
        </div>
      </motion.div>
    </div>
  );
}

function StoryStep3() {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div ref={ref}>
      <motion.div
        className="grid gap-6 md:grid-cols-2"
        initial={{ opacity: 0, y: 40 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div className="glass rounded-2xl p-8 border border-destructive/20">
          <h4 className="font-heading text-xl font-bold text-destructive mb-4">Before VelFlow</h4>
          <ul className="space-y-3 text-muted-foreground font-mono text-sm">
            <li>❌ 200+ tickets/week unanswered</li>
            <li>❌ 4hr average response time</li>
            <li>❌ 35% lead conversion rate</li>
            <li>❌ $12,000/mo on support staff</li>
          </ul>
        </div>
        <div className="glass rounded-2xl p-8 border border-primary/20">
          <h4 className="font-heading text-xl font-bold text-primary mb-4">After VelFlow</h4>
          <ul className="space-y-3 text-muted-foreground font-mono text-sm">
            <li>✅ 98% tickets auto-resolved</li>
            <li>✅ 30s average response time</li>
            <li>✅ 72% lead conversion rate</li>
            <li>✅ $2,000/mo AI automation</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

function StoryStep4() {
  const { ref, isVisible } = useScrollReveal();
  const count = useCountUp(25000, 2500, isVisible);
  return (
    <div ref={ref}>
      <motion.div
        className="glass rounded-2xl p-8 md:p-12 text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <h3 className="font-heading text-3xl font-bold text-foreground">Your startup. On autopilot.</h3>
        <div className="mt-6 font-heading text-6xl font-bold text-primary text-glow">
          ${count.toLocaleString()}<span className="text-2xl">/mo</span>
        </div>
        <p className="mt-2 text-muted-foreground">Average revenue generated by VelFlow clients</p>
        {isVisible && (
          <div className="mt-6 flex justify-center gap-1">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-primary"
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: [0, -40 - Math.random() * 40, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, delay: i * 0.05 }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default ScrollStorytelling;
