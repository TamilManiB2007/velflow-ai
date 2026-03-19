import { useKonamiCode } from "@/hooks/useKonamiCode";
import { motion, AnimatePresence } from "framer-motion";

const tamilLetters = ["வே", "ல்", "ஃப்", "ளோ", "வே", "ல்", "ஃப்", "ளோ", "வே", "ல்"];

const KonamiEasterEgg = () => {
  const activated = useKonamiCode();

  return (
    <AnimatePresence>
      {activated && (
        <motion.div
          className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute font-heading text-2xl font-bold text-primary text-glow"
              initial={{
                x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
                y: -50,
                opacity: 1,
                rotate: Math.random() * 360,
              }}
              animate={{
                y: (typeof window !== "undefined" ? window.innerHeight : 800) + 50,
                rotate: Math.random() * 720,
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2,
                ease: "easeIn",
              }}
            >
              {tamilLetters[i % tamilLetters.length]}
            </motion.span>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default KonamiEasterEgg;
