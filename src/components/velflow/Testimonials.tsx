import { useRef } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useNavigate } from "react-router-dom";

function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-[#F5A623] text-sm">★</span>
      ))}
    </div>
  );
}

function ReviewCard({ review }: {
  review: { name: string; role: string; text: string; rating: number };
}) {
  const initials = review.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="w-72 flex-shrink-0 rounded-2xl border border-border bg-[#0D0D14] p-5 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300">
      <Stars count={review.rating} />
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">
        "{review.text}"
      </p>
      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20 font-mono text-xs font-bold text-primary">
          {initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{review.name}</p>
          {review.role && (
            <p className="text-xs text-muted-foreground">{review.role}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({
  reviews,
  speed = 35,
  reverse = false,
}: {
  reviews: { name: string; role: string; text: string; rating: number }[];
  speed?: number;
  reverse?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);
  const pausedRef = useRef(false);
  const cardWidth = 288 + 16;
  const totalWidth = reviews.length * cardWidth;

  useAnimationFrame((_, delta) => {
    if (pausedRef.current || totalWidth === 0) return;
    const dir = reverse ? 1 : -1;
    xRef.current += dir * (speed / 1000) * delta;
    if (!reverse && xRef.current <= -totalWidth) xRef.current = 0;
    if (reverse && xRef.current >= 0) xRef.current = -totalWidth;
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${xRef.current}px)`;
    }
  });

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-background to-transparent" />
      <div
        ref={trackRef}
        className="flex gap-4 py-2"
        style={{ width: totalWidth * 2 }}
      >
        {[...reviews, ...reviews].map((review, i) => (
          <ReviewCard key={i} review={review} />
        ))}
      </div>
    </div>
  );
}

const Testimonials = () => {
  const reviews = useQuery(api.queries.reviews.getApprovedReviews);
  const navigate = useNavigate();

  const hasReviews = reviews && reviews.length > 0;

  const third = hasReviews ? Math.ceil(reviews.length / 3) : 0;
  const row1 = hasReviews ? reviews.slice(0, third) : [];
  const row2 = hasReviews ? reviews.slice(third, third * 2) : [];
  const row3 = hasReviews ? reviews.slice(third * 2) : [];

  return (
    <section id="reviews" className="py-24 overflow-hidden">

      {/* ── Heading ───────────────────────────────────────────────── */}
      <motion.div
        className="text-center mb-12 px-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
          ◆ Real Reviews
        </span>
        <h2 className="mt-3 font-heading text-4xl font-bold md:text-5xl">
          {hasReviews ? (
            <>
              <span className="text-foreground">Trusted by </span>
              <span className="text-primary text-glow">{reviews.length}+ people</span>
            </>
          ) : (
            <>
              <span className="text-foreground">Be the </span>
              <span className="text-primary text-glow">First to Review</span>
            </>
          )}
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
          {hasReviews
            ? "Real feedback from real people. No fake numbers."
            : "Worked with us? Share your experience and help others decide."}
        </p>
      </motion.div>

      {/* ── Stats (only when reviews exist) ──────────────────────── */}
      {hasReviews && (
        <div className="mx-auto max-w-3xl px-4 mb-12">
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: `${reviews.length}+`, label: "Reviews" },
              { value: "4.9★", label: "Avg Rating" },
              { value: "100%", label: "Recommend" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center"
              >
                <div className="font-heading text-2xl font-bold text-primary">
                  {s.value}
                </div>
                <div className="mt-1 font-mono text-xs text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Marquee rows ─────────────────────────────────────────── */}
      {hasReviews && (
        <div className="space-y-4 mb-16">
          {row1.length > 0 && <MarqueeRow reviews={row1} speed={35} />}
          {row2.length > 0 && <MarqueeRow reviews={row2} speed={28} reverse />}
          {row3.length > 0 && <MarqueeRow reviews={row3} speed={32} />}
        </div>
      )}

      {/* ── Leave a Review CTA ────────────────────────────────────── */}
      <motion.div
        className="mx-auto max-w-2xl px-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
          {/* Background particles */}
          <div className="pointer-events-none absolute inset-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute h-1 w-1 rounded-full bg-primary/30 animate-float"
                style={{
                  left: `${10 + i * 12}%`,
                  top: `${20 + (i % 3) * 25}%`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <div className="mb-3 text-3xl">⭐</div>
            <h3 className="font-heading text-2xl font-bold text-foreground">
              Worked with VelFlow?
            </h3>
            <p className="mt-2 text-muted-foreground text-sm max-w-md mx-auto">
              Your review helps other founders trust us and make better decisions.
              Takes less than 60 seconds!
            </p>

            <button
              onClick={() => navigate("/submit-review")}
              className="mt-6 inline-flex items-center gap-2 clip-angular gold-shimmer px-8 py-3 font-heading text-base font-bold text-primary-foreground hover:brightness-110 transition-all"
            >
              ✍️ Leave a Review
            </button>

            <p className="mt-3 font-mono text-[10px] text-muted-foreground">
              Public · Takes 60 seconds · No login needed
            </p>
          </div>
        </div>
      </motion.div>

    </section>
  );
};

export default Testimonials;