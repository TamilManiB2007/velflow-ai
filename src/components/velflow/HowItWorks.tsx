import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Search, Palette, Code, TestTube, Rocket, Settings } from "lucide-react";

const steps = [
  { icon: Search, title: "Discovery", desc: "We analyse your workflows, identify bottlenecks, and map the automation opportunity." },
  { icon: Palette, title: "Design", desc: "Custom AI architecture designed specifically for your startup's needs and stack." },
  { icon: Code, title: "Build", desc: "Rapid development with daily updates. Your AI agents come to life in days." },
  { icon: TestTube, title: "Test", desc: "Rigorous QA with real data. We break it before your customers do." },
  { icon: Rocket, title: "Deploy", desc: "Seamless deployment with zero downtime. Go live with confidence." },
  { icon: Settings, title: "Optimize", desc: "Continuous monitoring and improvement. Your AI gets smarter over time." },
];

const HowItWorks = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="process" className="py-20 md:py-32 overflow-hidden">
      <div ref={ref} className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <motion.span
            className="font-mono text-xs uppercase tracking-widest text-primary"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
          >
            Our Process
          </motion.span>
          <motion.h2
            className="mt-2 font-heading text-4xl font-bold text-foreground md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
          >
            How It Works
          </motion.h2>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-primary" />
        </div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="mt-16 flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                className="relative min-w-[280px] snap-center md:min-w-0"
                initial={{ opacity: 0, y: 40 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.12, duration: 0.6 }}
              >
                {/* Connecting line */}
                {i < steps.length - 1 && (
                  <div className="absolute top-10 left-[calc(50%+40px)] right-0 hidden h-0.5 md:block">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-primary/20"
                      initial={{ scaleX: 0 }}
                      animate={isVisible ? { scaleX: 1 } : {}}
                      transition={{ delay: i * 0.12 + 0.3, duration: 0.6 }}
                      style={{ transformOrigin: "left" }}
                    />
                  </div>
                )}

                <div className="glass rounded-xl p-6 text-center transition-all hover:border-primary/30">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <span className="absolute font-heading text-xs font-bold text-primary/50">
                      0{i + 1}
                    </span>
                    <Icon className="h-7 w-7 text-primary relative z-10" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
