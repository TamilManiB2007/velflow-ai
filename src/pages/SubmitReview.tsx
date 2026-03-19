import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate } from "react-router-dom";

const STAR_LABELS = ["", "Poor", "Fair", "Good", "Great", "Amazing!"];

const SubmitReview = () => {
  const submitReview = useMutation(api.mutations.reviews.submitReview);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    role: "",
    text: "",
    rating: 0,
  });
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const activeStar = hoveredStar || form.rating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Please enter your name"); return; }
    if (form.rating === 0) { setError("Please select a star rating"); return; }
    if (form.text.trim().length < 10) { setError("Please write at least 10 characters"); return; }

    setError("");
    setLoading(true);
    const res = await submitReview({
      name: form.name.trim(),
      role: form.role.trim(),
      text: form.text.trim(),
      rating: form.rating,
    });
    setLoading(false);

    if (res?.success) {
      setSubmitted(true);
    } else {
      setError(res?.error ?? "Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">

      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px]" />
      </div>

      {/* Back button */}
      <div className="relative z-10 px-6 pt-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          ← Back to VelFlow
        </button>
      </div>

      <div className="relative z-10 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">

          {/* Brand header */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="font-heading text-2xl font-bold text-primary">VelFlow</span>
              <span className="rounded-full border border-primary/30 px-2 py-0.5 font-mono text-[10px] text-primary">AI</span>
            </div>
            <h1 className="font-heading text-3xl font-bold text-foreground">
              Share Your Experience
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your honest review helps other founders make better decisions
            </p>
          </motion.div>

          {/* ── Success State ──────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                className="glass rounded-3xl p-12 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {/* Animated star burst */}
                <div className="relative mx-auto mb-6 h-20 w-20">
                  <motion.div
                    className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-4xl"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  >
                    ⭐
                  </motion.div>
                  {/* Orbiting dots */}
                  {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                    <motion.div
                      key={i}
                      className="absolute h-2 w-2 rounded-full bg-primary"
                      style={{
                        top: "50%",
                        left: "50%",
                        transform: `rotate(${deg}deg) translateX(40px)`,
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                    />
                  ))}
                </div>

                <motion.h2
                  className="font-heading text-3xl font-bold text-foreground"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Thank you, {form.name.split(" ")[0]}! 🔥
                </motion.h2>

                <motion.p
                  className="mt-3 text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Your review is now live on the VelFlow website.
                  <br />
                  The world can see it!
                </motion.p>

                <motion.div
                  className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4 text-left"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex gap-1 mb-2">
                    {Array.from({ length: form.rating }).map((_, i) => (
                      <span key={i} className="text-primary text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic">"{form.text}"</p>
                  <p className="mt-2 text-xs font-semibold text-foreground">— {form.name}</p>
                </motion.div>

                <motion.button
                  onClick={() => navigate("/")}
                  className="mt-6 w-full clip-angular bg-primary py-3 font-heading text-base font-bold text-primary-foreground hover:brightness-110 transition-all"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  Back to VelFlow →
                </motion.button>
              </motion.div>

            ) : (
              /* ── Form ──────────────────────────────────────────── */
              <motion.form
                key="form"
                className="glass rounded-3xl p-8 space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
              >

                {/* Star Rating — big interactive */}
                <div className="text-center">
                  <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Your Rating *
                  </label>
                  <div className="mt-4 flex justify-center gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        type="button"
                        whileHover={{ scale: 1.3 }}
                        whileTap={{ scale: 0.9 }}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        onClick={() => setForm({ ...form, rating: star })}
                        className={`text-4xl transition-all duration-150 ${
                          star <= activeStar
                            ? "text-primary drop-shadow-[0_0_8px_hsla(37,91%,55%,0.8)]"
                            : "text-border"
                        }`}
                      >
                        ★
                      </motion.button>
                    ))}
                  </div>
                  <AnimatePresence mode="wait">
                    {activeStar > 0 && (
                      <motion.p
                        key={activeStar}
                        className="mt-2 font-mono text-sm text-primary"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        {STAR_LABELS[activeStar]}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Name */}
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Your Name *
                  </label>
                  <input
                    autoComplete="name"
                    className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                    placeholder="e.g. Rahul Kumar"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Your Role
                    <span className="ml-1 normal-case text-muted-foreground/50">(optional)</span>
                  </label>
                  <input
                    className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                    placeholder="e.g. Startup Founder, Developer, CEO"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  />
                </div>

                {/* Review Text */}
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Your Review *
                  </label>
                  <textarea
                    className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all min-h-[130px] resize-none"
                    placeholder="What did you like most? How did VelFlow help you? Be honest — it helps other founders!"
                    value={form.text}
                    onChange={(e) =>
                      setForm({ ...form, text: e.target.value.slice(0, 500) })
                    }
                  />
                  <p className={`mt-1 text-right font-mono text-[10px] ${
                    form.text.length > 450 ? "text-primary" : "text-muted-foreground"
                  }`}>
                    {form.text.length}/500
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <motion.p
                    className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-xs text-destructive"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {error}
                  </motion.p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full clip-angular gold-shimmer py-4 font-heading text-lg font-bold text-primary-foreground hover:brightness-110 transition-all disabled:opacity-60"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Submitting...
                    </span>
                  ) : (
                    "Submit Review ⭐"
                  )}
                </button>

                <p className="text-center font-mono text-[10px] text-muted-foreground">
                  🔒 No login needed · Public review · Takes 60 seconds
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SubmitReview;