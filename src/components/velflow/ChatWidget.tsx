import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";

// ─── Types ────────────────────────────────────────────────────────────────────
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

// ─── Typing Indicator ─────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-primary"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

// ─── Single Message Bubble ────────────────────────────────────────────────────
function MessageBubble({ msg, onSpeak }: {
  msg: Message;
  onSpeak: (text: string) => void;
}) {
  const isAI = msg.role === "assistant";
  return (
    <motion.div
      className={`flex ${isAI ? "justify-start" : "justify-end"} gap-2`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {isAI && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground mt-1">
          V
        </div>
      )}
      <div className={`group relative max-w-[78%]`}>
        <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isAI
            ? "rounded-tl-sm bg-[#13131C] border border-primary/10 text-foreground"
            : "rounded-tr-sm bg-primary text-primary-foreground"
        }`}>
          {msg.content}
        </div>
        {isAI && (
          <button
            onClick={() => onSpeak(msg.content)}
            className="absolute -bottom-5 left-0 opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[9px] text-muted-foreground hover:text-primary flex items-center gap-1"
          >
            🔊 speak
          </button>
        )}
        <div className={`mt-1 font-mono text-[9px] text-muted-foreground/50 ${isAI ? "text-left" : "text-right"}`}>
          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main ChatWidget ──────────────────────────────────────────────────────────
const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "assistant",
      content: "Hey! I'm VelFlow AI ⚡ I help businesses automate with AI agents. What's slowing your team down?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [hasSpokenGreeting, setHasSpokenGreeting] = useState(false);
  const [unread, setUnread] = useState(1);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any | null>(null);

  const sendMessage = useAction(api.actions.chat.sendMessage);
  const textToSpeech = useAction(api.actions.chat.textToSpeech);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);


  // ── Send message ────────────────────────────────────────────────────────────
  const handleSend = useCallback(async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const reply = await sendMessage({ messages: history });

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
      if (!open) setUnread((u) => u + 1);

      // Auto speak AI reply
      handleSpeak(reply);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Something went wrong. Please try again!",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, open]);

  // ── Text to Speech ──────────────────────────────────────────────────────────
  const handleSpeak = useCallback(async (text: string) => {
    try {
      setSpeaking(true);
      const audioData = await textToSpeech({ text });
      if (audioData) {
        if (audioRef.current) audioRef.current.pause();
        const audio = new Audio(audioData);
        audioRef.current = audio;
        audio.play();
        audio.onended = () => setSpeaking(false);
      } else {
        // Fallback to browser TTS
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1;
        utterance.onend = () => setSpeaking(false);
        speechSynthesis.speak(utterance);
      }
    } catch {
      setSpeaking(false);
    }
  }, []);

  // Clear unread on open and speak initial greeting (Wait until handleSpeak is defined)
  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 300);

      if (!hasSpokenGreeting && messages.length > 0) {
        handleSpeak(messages[0].content);
        setHasSpokenGreeting(true);
      }
    }
  }, [open, hasSpokenGreeting, messages, handleSpeak]);

  // ── Voice Input ─────────────────────────────────────────────────────────────
  const handleMic = useCallback(() => {
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      alert("Voice not supported in this browser. Try Chrome!");
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      handleSend(transcript);
    };

    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  }, [listening, handleSend]);

  // ── Enter key ───────────────────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* ── Floating Button ──────────────────────────────────────────────── */}
      <motion.button
        className="fixed bottom-6 right-6 z-[9998] flex h-14 w-14 items-center justify-center rounded-full shadow-[0_0_30px_hsla(37,91%,55%,0.4)]"
        style={{
          background: "linear-gradient(135deg, #F5A623, #D4880A)",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        animate={open ? {} : { y: [0, -4, 0] }}
        transition={open ? {} : { repeat: Infinity, duration: 2.5 }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              className="text-xl font-bold text-[#07070A]"
            >
              ✕
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="text-2xl"
            >
              ⚡
            </motion.span>
          )}
        </AnimatePresence>

        {/* Unread badge */}
        {!open && unread > 0 && (
          <motion.div
            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 font-mono text-[10px] font-bold text-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            {unread}
          </motion.div>
        )}
      </motion.button>

      {/* ── Chat Window ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-[9997] flex w-[calc(100vw-2rem)] sm:w-[360px] flex-col overflow-hidden rounded-2xl border border-primary/20 shadow-[0_0_60px_rgba(0,0,0,0.5)]"
            style={{ height: "520px", background: "#07070A" }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="relative flex items-center gap-3 border-b border-primary/10 px-4 py-3"
              style={{ background: "linear-gradient(135deg, #0D0D14, #13131C)" }}
            >
              {/* Glow */}
              <div className="absolute inset-0 bg-primary/3" />

              <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
                <span className="font-heading text-sm font-bold text-primary">V</span>
                {/* Online dot */}
                <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#07070A] bg-green-400" />
              </div>

              <div className="relative flex-1">
                <p className="font-heading text-sm font-bold text-foreground">VelFlow AI</p>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {speaking ? "Speaking..." : listening ? "Listening..." : "Online · Replies instantly"}
                  </p>
                </div>
              </div>

              {/* Stop speaking button */}
              {speaking && (
                <button
                  onClick={() => {
                    audioRef.current?.pause();
                    speechSynthesis.cancel();
                    setSpeaking(false);
                  }}
                  className="relative rounded-full border border-primary/20 px-2 py-1 font-mono text-[9px] text-primary hover:bg-primary/10"
                >
                  ■ stop
                </button>
              )}
            </div>

            {/* ── Messages ───────────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5"
              style={{ scrollbarWidth: "thin", scrollbarColor: "#F5A62320 transparent" }}
            >
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} onSpeak={handleSpeak} />
              ))}

              {loading && (
                <div className="flex justify-start gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    V
                  </div>
                  <div className="rounded-2xl rounded-tl-sm border border-primary/10 bg-[#13131C]">
                    <TypingDots />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* ── Quick Replies ───────────────────────────────────────────── */}
            {messages.length <= 2 && !loading && (
              <div className="px-4 pb-2 flex gap-2 flex-wrap">
                {[
                  "What services do you offer?",
                  "How much does it cost?",
                  "How fast can you deliver?",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 font-mono text-[10px] text-primary hover:bg-primary/15 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* ── Input Bar ──────────────────────────────────────────────── */}
            <div className="border-t border-primary/10 px-3 py-3"
              style={{ background: "#0D0D14" }}
            >
              <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-background px-3 py-2 focus-within:border-primary/40 transition-all">
                <input
                  ref={inputRef}
                  className="flex-1 bg-transparent font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
                  placeholder="Ask VelFlow AI..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading || listening}
                />

                {/* Mic button */}
                <motion.button
                  onClick={handleMic}
                  whileTap={{ scale: 0.9 }}
                  className={`flex h-7 w-7 items-center justify-center rounded-full transition-all ${
                    listening
                      ? "bg-red-500 text-white animate-pulse"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {listening ? (
                    <span className="text-sm">⏹</span>
                  ) : (
                    <span className="text-sm">🎤</span>
                  )}
                </motion.button>

                {/* Send button */}
                <motion.button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || loading}
                  whileTap={{ scale: 0.9 }}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-30 transition-all hover:brightness-110"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                  </svg>
                </motion.button>
              </div>

              <p className="mt-1.5 text-center font-mono text-[9px] text-muted-foreground/40">
                Powered by VelFlow AI · velflow.ai
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;