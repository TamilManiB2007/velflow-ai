import { useEffect, useState } from "react";

export function useTypewriter(phrases: string[], typingSpeed = 60, pauseDuration = 2000) {
  const [text, setText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setText(current.slice(0, charIndex + 1));
          setCharIndex((i) => i + 1);
          if (charIndex + 1 === current.length) {
            setTimeout(() => setIsDeleting(true), pauseDuration);
          }
        } else {
          setText(current.slice(0, charIndex - 1));
          setCharIndex((i) => i - 1);
          if (charIndex <= 1) {
            setIsDeleting(false);
            setPhraseIndex((i) => (i + 1) % phrases.length);
          }
        }
      },
      isDeleting ? typingSpeed / 2 : typingSpeed
    );
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex, phrases, typingSpeed, pauseDuration]);

  return text;
}
