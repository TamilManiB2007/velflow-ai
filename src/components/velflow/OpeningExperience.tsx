import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const OpeningExperience = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),   // dot appears
      setTimeout(() => setPhase(2), 1500),   // dot expands
      setTimeout(() => setPhase(3), 2500),   // text appears
      setTimeout(() => setPhase(4), 4000),   // fade out
      setTimeout(() => onComplete(), 5000),  // done
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 4 && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Gold dot */}
          {phase >= 1 && (
            <motion.div
              className="absolute rounded-full bg-primary"
              initial={{ scale: 0, width: 8, height: 8 }}
              animate={
                phase >= 2
                  ? { scale: [1, 60], opacity: [1, 0] }
                  : { scale: 1 }
              }
              transition={phase >= 2 ? { duration: 1, ease: "easeOut" } : { duration: 0.3 }}
            />
          )}

          {/* Particle burst */}
          {phase >= 2 && (
            <div className="absolute">
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-primary"
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: Math.cos((i / 30) * Math.PI * 2) * (150 + Math.random() * 100),
                    y: Math.sin((i / 30) * Math.PI * 2) * (150 + Math.random() * 100),
                    opacity: 0,
                  }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: i * 0.02 }}
                />
              ))}
            </div>
          )}

          {/* VELFLOW text */}
          {phase >= 3 && (
            <motion.h1
              className="font-heading text-6xl md:text-8xl font-bold tracking-wider text-glow-strong text-primary"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              VELFLOW
            </motion.h1>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OpeningExperience;
