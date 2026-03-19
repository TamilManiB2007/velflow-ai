import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

const MobileStickyCTA = () => {
  const [show, setShow] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) return;
    const handler = () => setShow(window.scrollY > window.innerHeight);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [isMobile]);

  if (!isMobile) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-[90] border-t border-border bg-background/90 backdrop-blur-lg p-3"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="w-full clip-angular bg-primary py-3 font-heading text-lg font-bold text-primary-foreground"
          >
            Get Started — Free Consultation
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileStickyCTA;
