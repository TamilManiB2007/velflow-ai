import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { toast } from "sonner";
import { submitContactForm } from "@/lib/convex";

const contactSchema = z.object({
  name: z.string().trim().min(2, "At least 2 characters").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  company: z.string().trim().min(1, "Required").max(100),
  serviceNeeded: z.string().min(1, "Pick a service"),
  painPoint: z.string().trim().min(10, "Tell us a bit more").max(2000),
});

const SERVICES = [
  { value: "AI Chatbot", label: "AI Chatbot", price: "$1,500+", icon: "💬" },
  { value: "Customer Support AI", label: "Support AI", price: "$2,000+", icon: "🎧" },
  { value: "Marketing AI", label: "Marketing AI", price: "$1,800+", icon: "📣" },
  { value: "Lead Generation AI", label: "Lead Gen AI", price: "$2,500+", icon: "🎯" },
  { value: "Voice Agent", label: "Voice Agent", price: "$3,000+", icon: "🎙️" },
  { value: "Full AI Suite", label: "Full Suite", price: "$12,000+", icon: "⚡" },
  { value: "Not sure yet", label: "Not sure yet", price: "Let's talk", icon: "🤝" },
];

const STEPS = ["Service", "About You", "Challenge"];

type FormState = {
  name: string;
  email: string;
  company: string;
  serviceNeeded: string;
  painPoint: string;
};

const ContactFooter = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>({
    name: "", email: "", company: "", serviceNeeded: "", painPoint: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateStep = (s: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (s === 0 && !form.serviceNeeded) newErrors.serviceNeeded = "Pick a service to continue";
    if (s === 1) {
      if (!form.name || form.name.length < 2) newErrors.name = "At least 2 characters";
      if (!form.email || !form.email.includes("@")) newErrors.email = "Valid email required";
      if (!form.company) newErrors.company = "Company name required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => { if (validateStep(step)) setStep((s) => s + 1); };
  const prevStep = () => { setErrors({}); setStep((s) => s - 1); };

  const handleSubmit = async () => {
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        fieldErrors[i.path[0] as string] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setIsSubmitting(true);
    const response = await submitContactForm({
      name: form.name,
      email: form.email,
      company: form.company,
      serviceNeeded: form.serviceNeeded,
      painPoint: form.painPoint,
    });
    setIsSubmitting(false);
    if (response.success) {
      setSubmitted(true);
      toast.success("Message sent! We'll reply within 24 hours 🚀");
    } else {
      toast.error(response.error ?? "Something went wrong. Try again.");
    }
  };

  const selectedService = SERVICES.find((s) => s.value === form.serviceNeeded);

  return (
    <>
      <section id="contact" className="relative py-16 md:py-32 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4">
          {/* Heading */}
          <motion.div
            className="text-center mb-10 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
              ◆ Start a Project
            </span>
            <h2 className="mt-3 font-heading text-3xl font-bold md:text-6xl">
              <span className="text-foreground">Let's </span>
              <span className="text-primary text-glow">Build</span>
              <span className="text-foreground"> Something</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm md:text-base text-muted-foreground px-2">
              Tell us what you need. We'll have your AI agent live in under 7 days.
            </p>
          </motion.div>

          {/* Card */}
          <motion.div
            className="overflow-hidden rounded-2xl md:rounded-3xl border border-primary/10 flex flex-col md:grid md:grid-cols-[1fr_1.4fr]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Left panel — desktop only */}
            <div className="hidden md:flex relative flex-col justify-between bg-primary/5 p-10">
              <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
              <div>
                <div className="mb-8">
                  <h3 className="font-heading text-2xl font-bold text-primary">VelFlow AI</h3>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">Sharp as Vel. Smooth as Flow.</p>
                </div>
                <div className="space-y-6">
                  <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">What happens next?</p>
                  {[
                    { step: "01", title: "We review your request", desc: "Within 24 hours", icon: "📋" },
                    { step: "02", title: "Strategy via email", desc: "Custom plan sent to you", icon: "📧" },
                    { step: "03", title: "Build starts immediately", desc: "Live in 3–7 days", icon: "⚡" },
                  ].map((item, i) => (
                    <div key={item.step} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-base">
                          {item.icon}
                        </div>
                        {i < 2 && <div className="mt-1 h-full w-px bg-primary/10" />}
                      </div>
                      <div className="pb-6">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-primary">{item.step}</span>
                          <span className="font-heading text-sm font-semibold text-foreground">{item.title}</span>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🔒</span>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Zero Risk Guarantee</p>
                    <p className="text-xs text-muted-foreground">No payment until you approve</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right panel — Form */}
            <div className="bg-background p-5 md:p-10">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    className="flex h-full flex-col items-center justify-center text-center py-8"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-primary/10"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    >
                      <span className="text-3xl">⚡</span>
                    </motion.div>
                    <h3 className="font-heading text-2xl font-bold text-foreground">You're In!</h3>
                    <p className="mt-3 text-sm text-muted-foreground max-w-sm">
                      We've received your request for{" "}
                      <span className="text-primary font-semibold">{form.serviceNeeded}</span>.
                      Expect a reply within 24 hours!
                    </p>
                    <button
                      className="mt-6 font-mono text-xs text-primary underline underline-offset-4"
                      onClick={() => {
                        setSubmitted(false);
                        setStep(0);
                        setForm({ name: "", email: "", company: "", serviceNeeded: "", painPoint: "" });
                      }}
                    >
                      Submit another →
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {/* Step progress */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between">
                        {STEPS.map((label, i) => (
                          <div key={label} className="flex items-center gap-1 md:gap-2">
                            <div className={`flex h-6 w-6 md:h-7 md:w-7 items-center justify-center rounded-full font-mono text-xs font-bold transition-all duration-300 ${
                              i < step ? "bg-primary text-primary-foreground" :
                              i === step ? "border-2 border-primary text-primary" :
                              "border border-border text-muted-foreground"
                            }`}>
                              {i < step ? "✓" : i + 1}
                            </div>
                            <span className={`hidden sm:block font-mono text-[10px] md:text-xs transition-colors ${i === step ? "text-primary" : "text-muted-foreground"}`}>
                              {label}
                            </span>
                            {i < STEPS.length - 1 && (
                              <div className={`ml-1 h-px w-5 md:w-14 transition-all duration-500 ${i < step ? "bg-primary" : "bg-border"}`} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      {/* Step 0 */}
                      {step === 0 && (
                        <motion.div
                          key="step0"
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -30 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h3 className="font-heading text-lg md:text-xl font-bold text-foreground mb-1">
                            What do you need?
                          </h3>
                          <p className="text-sm text-muted-foreground mb-5">
                            Pick the AI solution that fits your business.
                          </p>
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
                            {SERVICES.map((svc) => (
                              <button
                                key={svc.value}
                                type="button"
                                onClick={() => { setForm({ ...form, serviceNeeded: svc.value }); setErrors({}); }}
                                className={`relative flex flex-col items-start rounded-xl border p-3 text-left transition-all duration-200 ${
                                  form.serviceNeeded === svc.value
                                    ? "border-primary bg-primary/10"
                                    : "border-border bg-background hover:border-primary/40 hover:bg-primary/5"
                                }`}
                              >
                                <span className="text-xl mb-1">{svc.icon}</span>
                                <span className="font-heading text-xs md:text-sm font-semibold text-foreground">
                                  {svc.label}
                                </span>
                                <span className={`font-mono text-[10px] mt-0.5 ${form.serviceNeeded === svc.value ? "text-primary" : "text-muted-foreground"}`}>
                                  {svc.price}
                                </span>
                                {form.serviceNeeded === svc.value && (
                                  <motion.div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" layoutId="selected-dot" />
                                )}
                              </button>
                            ))}
                          </div>
                          {errors.serviceNeeded && (
                            <p className="mt-2 text-xs text-destructive">{errors.serviceNeeded}</p>
                          )}
                          <button
                            type="button"
                            onClick={nextStep}
                            className="mt-5 w-full clip-angular bg-primary py-3 font-heading text-sm font-bold text-primary-foreground hover:brightness-110 transition-all"
                          >
                            Continue → {selectedService ? `${selectedService.icon} ${selectedService.label}` : ""}
                          </button>
                        </motion.div>
                      )}

                      {/* Step 1 */}
                      {step === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -30 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                          <div>
                            <h3 className="font-heading text-lg md:text-xl font-bold text-foreground mb-1">
                              Tell us about you
                            </h3>
                            <p className="text-sm text-muted-foreground">So we know who to reply to.</p>
                          </div>
                          {selectedService && (
                            <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 flex-wrap">
                              <span>{selectedService.icon}</span>
                              <span className="font-mono text-xs text-primary">{selectedService.label}</span>
                              <span className="font-mono text-xs text-muted-foreground">· {selectedService.price}</span>
                              <button
                                type="button"
                                onClick={() => setStep(0)}
                                className="ml-auto font-mono text-[10px] text-muted-foreground hover:text-primary underline"
                              >
                                change
                              </button>
                            </div>
                          )}
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                                Your Name *
                              </label>
                              <input
                                autoFocus
                                className={`mt-1.5 w-full rounded-xl border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 transition-all ${errors.name ? "border-destructive" : "border-border focus:border-primary focus:ring-primary/20"}`}
                                placeholder="Your name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                              />
                              {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                            </div>
                            <div>
                              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                                Work Email *
                              </label>
                              <input
                                type="email"
                                className={`mt-1.5 w-full rounded-xl border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 transition-all ${errors.email ? "border-destructive" : "border-border focus:border-primary focus:ring-primary/20"}`}
                                placeholder="you@company.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                              />
                              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                            </div>
                          </div>
                          <div>
                            <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                              Company *
                            </label>
                            <input
                              className={`mt-1.5 w-full rounded-xl border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 transition-all ${errors.company ? "border-destructive" : "border-border focus:border-primary focus:ring-primary/20"}`}
                              placeholder="Your company name"
                              value={form.company}
                              onChange={(e) => setForm({ ...form, company: e.target.value })}
                            />
                            {errors.company && <p className="mt-1 text-xs text-destructive">{errors.company}</p>}
                          </div>
                          <div className="flex gap-3 pt-1">
                            <button
                              type="button"
                              onClick={prevStep}
                              className="flex-1 rounded-xl border border-border py-2.5 font-heading text-sm text-muted-foreground hover:border-primary/40 hover:text-primary transition-all"
                            >
                              ← Back
                            </button>
                            <button
                              type="button"
                              onClick={nextStep}
                              className="flex-[2] clip-angular bg-primary py-2.5 font-heading text-sm font-bold text-primary-foreground hover:brightness-110 transition-all"
                            >
                              Next Step →
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 2 */}
                      {step === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -30 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                          <div>
                            <h3 className="font-heading text-lg md:text-xl font-bold text-foreground mb-1">
                              Your biggest challenge?
                            </h3>
                            <p className="text-sm text-muted-foreground">The more you tell us, the better we help.</p>
                          </div>
                          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground flex flex-wrap gap-1 items-center">
                            <span className="text-primary font-semibold">{form.name}</span>
                            <span>·</span>
                            <span>{form.email}</span>
                            <span>·</span>
                            <span className="text-primary">{selectedService?.label}</span>
                            <button
                              type="button"
                              onClick={() => setStep(1)}
                              className="ml-auto underline hover:text-primary"
                            >
                              edit
                            </button>
                          </div>
                          <div>
                            <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                              Describe your challenge *
                            </label>
                            <textarea
                              autoFocus
                              className={`mt-1.5 w-full rounded-xl border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 transition-all min-h-[110px] resize-none ${errors.painPoint ? "border-destructive" : "border-border focus:border-primary focus:ring-primary/20"}`}
                              placeholder="e.g. Our support team handles 500+ tickets a day and we need AI to automate 80% of it..."
                              value={form.painPoint}
                              onChange={(e) => setForm({ ...form, painPoint: e.target.value.slice(0, 2000) })}
                            />
                            <div className="flex items-center justify-between mt-1">
                              {errors.painPoint
                                ? <p className="text-xs text-destructive">{errors.painPoint}</p>
                                : <span />}
                              <span className="text-[10px] text-muted-foreground">{form.painPoint.length}/2000</span>
                            </div>
                          </div>
                          {/* Quick prompts */}
                          <div className="flex flex-wrap gap-2">
                            {["Too many support tickets", "Manual follow-ups", "Need 24/7 coverage"].map((prompt) => (
                              <button
                                key={prompt}
                                type="button"
                                onClick={() => setForm({ ...form, painPoint: form.painPoint ? `${form.painPoint} ${prompt}.` : `${prompt}.` })}
                                className="rounded-full border border-border px-2.5 py-1 font-mono text-[10px] text-muted-foreground hover:border-primary/40 hover:text-primary transition-all"
                              >
                                + {prompt}
                              </button>
                            ))}
                          </div>
                          <div className="flex gap-3 pt-1">
                            <button
                              type="button"
                              onClick={prevStep}
                              className="flex-1 rounded-xl border border-border py-2.5 font-heading text-sm text-muted-foreground hover:border-primary/40 hover:text-primary transition-all"
                            >
                              ← Back
                            </button>
                            <button
                              type="button"
                              onClick={handleSubmit}
                              disabled={isSubmitting}
                              className="flex-[2] clip-angular gold-shimmer py-2.5 font-heading text-sm font-bold text-primary-foreground hover:brightness-110 transition-all disabled:opacity-60"
                            >
                              {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                                  Sending...
                                </span>
                              ) : "Launch My Project ⚡"}
                            </button>
                          </div>
                          <p className="text-center text-[10px] text-muted-foreground">
                            🔒 No payment now · Reply within 24 hrs
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-10 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 grid-cols-2 md:grid-cols-4">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-heading text-xl font-bold text-primary">VelFlow</span>
                <span className="rounded-full border border-primary/30 px-2 py-0.5 font-mono text-[10px] text-primary">AI</span>
              </div>
              <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                AI automation for funded startups. Sharp as Vel. Smooth as Flow.
              </p>
              <div className="mt-3 flex items-center gap-1 font-mono text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                Available for new projects
              </div>
            </div>
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">Services</h4>
              <ul className="space-y-2 text-xs">
                {["AI Chatbots", "Voice Agents", "Lead Gen AI", "Marketing AI"].map((s) => (
                  <li key={s}>
                    <button
                      onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">Company</h4>
              <ul className="space-y-2 text-xs">
                {["Pricing", "Process", "Reviews", "Contact"].map((s) => (
                  <li key={s}>
                    <button
                      onClick={() => document.getElementById(s.toLowerCase())?.scrollIntoView({ behavior: "smooth" })}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">Connect</h4>
              <ul className="space-y-2 text-xs">
                {["Twitter / X", "LinkedIn", "Instagram", "GitHub"].map((s) => (
                  <li key={s}>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">{s}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border/50 pt-6 md:flex-row">
            <p className="font-mono text-xs text-muted-foreground text-center">
              © 2026 VelFlow AI · Built in Chennai, India
            </p>
            <div className="flex gap-4 font-mono text-xs text-muted-foreground">
              <span className="hover:text-primary cursor-pointer">Privacy</span>
              <span className="hover:text-primary cursor-pointer">Terms</span>
              <span className="text-primary">velflow.ai</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default ContactFooter;