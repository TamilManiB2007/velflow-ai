import { useRef, useEffect, useState } from "react";

export function useMagnetic(strength = 0.3) {
  const ref = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        setOffset({ x: dx * strength, y: dy * strength });
      } else {
        setOffset({ x: 0, y: 0 });
      }
    };
    const handleLeave = () => setOffset({ x: 0, y: 0 });

    window.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [strength]);

  return { ref, style: { transform: `translate(${offset.x}px, ${offset.y}px)`, transition: "transform 0.2s ease-out" } };
}
