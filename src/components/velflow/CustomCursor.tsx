import { useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * CustomCursor — rewritten with refs + requestAnimationFrame.
 * NO useState = zero React re-renders on mouse move = zero lag.
 * All DOM updates happen directly via style properties.
 */
const CustomCursor = () => {
  const isMobile = useIsMobile();
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  // Target position (raw mouse)
  const mouse = useRef({ x: -100, y: -100 });
  // Smoothed position (lerped)
  const smoothed = useRef({ x: -100, y: -100 });
  const hovering = useRef(false);
  const rafId = useRef<number>(0);

  useEffect(() => {
    if (isMobile) return;

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      hovering.current = !!target.closest("button, a, [role='button']");
    };

    const animate = () => {
      // Lerp: smoothed chases mouse at 18% per frame — smooth but responsive
      smoothed.current.x += (mouse.current.x - smoothed.current.x) * 0.18;
      smoothed.current.y += (mouse.current.y - smoothed.current.y) * 0.18;

      const isHover = hovering.current;
      const size = isHover ? 36 : 14;

      if (cursorRef.current) {
        cursorRef.current.style.transform =
          `translate(${smoothed.current.x - size / 2}px, ${smoothed.current.y - size / 2}px)`;
        cursorRef.current.style.width = `${size}px`;
        cursorRef.current.style.height = `${size}px`;
        cursorRef.current.style.borderColor = isHover
          ? "hsl(var(--primary))"
          : "transparent";
        cursorRef.current.style.backgroundColor = isHover
          ? "transparent"
          : "hsl(var(--primary))";
      }

      // Dot follows raw mouse (no smoothing) for snappy feel
      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${mouse.current.x - 2}px, ${mouse.current.y - 2}px)`;
        dotRef.current.style.opacity = isHover ? "0" : "1";
      }

      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(rafId.current);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      {/* Outer ring — smoothly follows cursor */}
      <div
        ref={cursorRef}
        className="absolute rounded-full border-2 will-change-transform"
        style={{
          width: 14,
          height: 14,
          top: 0,
          left: 0,
          backgroundColor: "hsl(var(--primary))",
          borderColor: "transparent",
          transition: "width 0.15s, height 0.15s, background-color 0.15s, border-color 0.15s",
        }}
      />
      {/* Center dot — snaps to exact mouse position */}
      <div
        ref={dotRef}
        className="absolute rounded-full will-change-transform"
        style={{
          width: 4,
          height: 4,
          top: 0,
          left: 0,
          backgroundColor: "hsl(var(--primary))",
          opacity: 1,
        }}
      />
    </div>
  );
};

export default CustomCursor;
