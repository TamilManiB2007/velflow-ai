import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";

const navItems = ["Services", "Demo", "Pricing", "Reviews", "Contact"];

const Navigation = () => {
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setVisible(y < 100 || y < lastY);
      setLastY(y);
      if (menuOpen) setMenuOpen(false);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastY, menuOpen]);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    setTimeout(() => {
      document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <motion.nav
      className="fixed top-4 left-0 right-0 z-[100] px-4 flex flex-col items-center"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: visible ? 0 : -80, opacity: visible ? 1 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* ── Main pill ── */}
      <div className="glass-strong flex items-center rounded-full px-3 py-2 shadow-lg w-full max-w-fit">

        {/* ── Logo — replaces plain "VelFlow" text ── */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="mr-2 flex-shrink-0 flex items-center"
        >
          <Logo size="sm" />
        </button>

        {/* ── Desktop nav items ── */}
        <div className="hidden md:flex items-center gap-0.5 mr-2">
          <div className="h-4 w-px bg-border mr-2" />
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(item.toLowerCase())}
              className="rounded-full px-2.5 py-1.5 font-mono text-xs text-foreground/60 transition-colors hover:bg-primary/10 hover:text-primary whitespace-nowrap"
            >
              {item}
            </button>
          ))}
          <div className="h-4 w-px bg-border ml-2" />
        </div>

        {/* ── Right side — always visible ── */}
        <div className="flex items-center gap-2 ml-auto">

          {/* Get Started */}
          <button
            onClick={() => scrollTo("contact")}
            className="rounded-full bg-primary px-4 py-1.5 font-heading text-xs font-semibold text-primary-foreground transition-all hover:brightness-110 whitespace-nowrap"
          >
            Get Started
          </button>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden flex h-8 w-8 flex-col items-center justify-center gap-1.5 rounded-full border border-border bg-background/80 flex-shrink-0"
          >
            <motion.span
              className="block h-0.5 w-4 bg-foreground rounded-full"
              animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block h-0.5 w-4 bg-foreground rounded-full"
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.15 }}
            />
            <motion.span
              className="block h-0.5 w-4 bg-foreground rounded-full"
              animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
            />
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mt-2 overflow-hidden rounded-2xl border border-border/50 glass-strong md:hidden w-full max-w-sm"
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col py-1.5">

              {/* Logo inside mobile menu too */}
              <div className="px-5 py-3 border-b border-border/50">
                <Logo size="sm" />
              </div>

              {navItems.map((item, i) => (
                <motion.button
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase())}
                  className="px-5 py-3 text-left font-mono text-sm text-foreground/70 hover:bg-primary/10 hover:text-primary transition-colors"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  {item}
                </motion.button>
              ))}

              <div className="mx-4 my-1 h-px bg-border" />

              <div className="px-4 pb-3 pt-1">
                <button
                  onClick={() => scrollTo("contact")}
                  className="w-full rounded-full bg-primary py-2.5 font-heading text-sm font-semibold text-primary-foreground hover:brightness-110 transition-all"
                >
                  Get Started →
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navigation;