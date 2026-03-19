import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const BrandStory = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="story" className="py-20 md:py-32 overflow-hidden">
      <div ref={ref} className="mx-auto max-w-5xl px-4">
        <div className="text-center">
          <motion.span
            className="font-mono text-xs uppercase tracking-widest text-primary"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
          >
            Our Origin
          </motion.span>
          <motion.h2
            className="mt-2 font-heading text-4xl font-bold text-foreground md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
          >
            The Story Behind the Name
          </motion.h2>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-primary" />
        </div>

        {/* Tamil Vel text */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <h3
            className="text-8xl font-bold text-primary md:text-[10rem]"
            style={{
              animation: isVisible ? "tamil-glow 3s ease-in-out infinite" : "none",
            }}
          >
            வேல்
          </h3>
          <p className="mt-4 font-heading text-xl text-muted-foreground">
            "Vel" — The divine spear of Lord Murugan
          </p>
        </motion.div>

        {/* Equation cards */}
        <motion.div
          className="mt-16 flex flex-col items-center gap-4 md:flex-row md:justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="glass rounded-xl px-8 py-6 text-center">
            <div className="font-heading text-3xl font-bold text-primary">Vel</div>
            <div className="mt-1 text-sm text-muted-foreground">Sharp. Precise. Unstoppable.</div>
          </div>
          <div className="font-heading text-4xl font-bold text-primary">+</div>
          <div className="glass rounded-xl px-8 py-6 text-center">
            <div className="font-heading text-3xl font-bold text-primary">Flow</div>
            <div className="mt-1 text-sm text-muted-foreground">Smooth. Automated. Effortless.</div>
          </div>
          <div className="font-heading text-4xl font-bold text-primary">=</div>
          <div className="glass-strong rounded-xl px-8 py-6 text-center border border-primary/30 shadow-[0_0_30px_hsla(37,91%,55%,0.1)]">
            <div className="font-heading text-3xl font-bold text-primary text-glow">VelFlow</div>
            <div className="mt-1 text-sm text-muted-foreground">Sharp as Vel. Smooth as Flow.</div>
          </div>
        </motion.div>

        {/* Story text */}
        <motion.div
          className="mt-16 mx-auto max-w-2xl text-center"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <p className="text-muted-foreground leading-relaxed">
            In Tamil mythology, the Vel is Lord Murugan's divine spear — a weapon of precision, 
            power, and purpose. It cuts through darkness with unwavering accuracy.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            VelFlow AI carries that same energy. We cut through the chaos of manual operations 
            with AI that's sharp, precise, and automated. No wasted motion. No missed opportunities. 
            Just pure, flowing efficiency.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default BrandStory;
