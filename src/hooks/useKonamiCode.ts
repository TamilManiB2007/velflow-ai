import { useEffect, useState } from "react";

const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];

export function useKonamiCode() {
  const [activated, setActivated] = useState(false);
  
  useEffect(() => {
    let index = 0;
    const handler = (e: KeyboardEvent) => {
      if (e.key === KONAMI[index]) {
        index++;
        if (index === KONAMI.length) {
          setActivated(true);
          index = 0;
          setTimeout(() => setActivated(false), 5000);
        }
      } else {
        index = 0;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return activated;
}
