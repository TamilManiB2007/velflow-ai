import { useEffect, useState } from "react";

const chars = "!<>-_\\/[]{}—=+*^?#_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export function useTextScramble(finalText: string, startScramble = true, duration = 1500) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (!startScramble) return;
    const length = finalText.length;
    const steps = Math.ceil(duration / 30);
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      let result = "";
      for (let i = 0; i < length; i++) {
        if (i < length * progress) {
          result += finalText[i];
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      setText(result);
      if (step >= steps) {
        setText(finalText);
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [finalText, startScramble, duration]);

  return text;
}
