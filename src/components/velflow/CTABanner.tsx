import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import MagneticButton from "./MagneticButton";

const CTABanner = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-20">
      <div ref={ref} className="mx-auto max-w-6xl px-4">
        <motion.div
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-background p-12 md:p-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Background particles */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-primary/30 animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 4}s`,
                  animationDuration: `${3 + Math.random() * 3}s`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <h2 className="font-heading text-4xl font-bold text-foreground md:text-6xl">
              Ready to Automate?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Join funded startups saving 30+ hours per week with VelFlow AI. 
              Your first AI agent can be live in 3 days.
            </p>
            <div className="mt-8">
              <MagneticButton
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="gold-shimmer clip-angular px-10 py-4 font-heading text-xl font-bold text-primary-foreground hover:brightness-110 transition-all"
              >
                Start Your Project Today
              </MagneticButton>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTABanner;
