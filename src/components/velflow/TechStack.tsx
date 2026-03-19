import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const techs = [
  "OpenAI", "LangChain", "Python", "Node.js", "React",
  "PostgreSQL", "Redis", "Docker", "AWS", "Twilio",
  "Stripe", "Zapier", "HubSpot", "Slack", "WhatsApp",
];

const TechStack = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-20 md:py-32">
      <div ref={ref} className="mx-auto max-w-5xl px-4">
        <div className="text-center">
          <motion.span
            className="font-mono text-xs uppercase tracking-widest text-primary"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
          >
            Powered By
          </motion.span>
          <motion.h2
            className="mt-2 font-heading text-4xl font-bold text-foreground md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
          >
            Our Tech Stack
          </motion.h2>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-primary" />
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-4">
          {techs.map((tech, i) => (
            <motion.div
              key={tech}
              className="glass rounded-lg px-6 py-3 font-mono text-sm text-muted-foreground transition-all hover:text-primary hover:border-primary/30 hover:shadow-[0_0_20px_hsla(37,91%,55%,0.1)]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              {tech}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
