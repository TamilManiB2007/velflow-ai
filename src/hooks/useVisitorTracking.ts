import { useEffect, useRef } from "react";
import { trackVisit, trackPageView, trackTimeOnSite } from "@/lib/convex";

/**
 * useVisitorTracking
 *
 * Drop this hook into Index.tsx (once, at the top level).
 * It automatically handles:
 *  1. Registering the visit on mount
 *  2. Tracking time every 30 seconds
 *  3. Watching all sections with IntersectionObserver
 */
export function useVisitorTracking() {
  const trackedSections = useRef<Set<string>>(new Set());

  // 1. Track visit on mount
  useEffect(() => {
    trackVisit();
  }, []);

  // 2. Track time every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      trackTimeOnSite(30);
    }, 30_000);

    // Also fire on tab close/navigate away
    const handleUnload = () => trackTimeOnSite(5);
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  // 3. Watch all named sections with IntersectionObserver
  useEffect(() => {
    const sectionIds = [
      "hero",
      "services",
      "how-it-works",
      "demo",
      "pricing",
      "brand",
      "tech",
      "contact",
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !trackedSections.current.has(entry.target.id)) {
            trackedSections.current.add(entry.target.id);

            // Calculate rough scroll depth
            const scrollDepth = Math.round(
              ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
            );

            trackPageView(entry.target.id, scrollDepth);
          }
        });
      },
      { threshold: 0.3 } // 30% of section visible = tracked
    );

    // Small delay to let the DOM render first
    const timeout = setTimeout(() => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }, 1000);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, []);
}
