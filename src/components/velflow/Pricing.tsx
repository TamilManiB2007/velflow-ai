import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Check } from "lucide-react";
import MagneticButton from "./MagneticButton";

const tiers = [
  {
    name: "Starter",
    price: "$1,500",
    desc: "Perfect for startups testing AI automation",
    features: [
      "1 AI chatbot",
      "Up to 1,000 conversations/mo",
      "Basic analytics",
      "Email support",
      "3-day delivery",
    ],
    popular: false,
  },
  {
    name: "Growth",
    price: "$4,500",
    desc: "For scaling startups with serious automation needs",
    features: [
      "3 AI agents (chat + voice + support)",
      "Unlimited conversations",
      "Advanced analytics & reporting",
      "Priority support",
      "CRM integration",
      "Custom training data",
      "5-day delivery",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$12,000",
    desc: "Full-stack AI transformation for funded startups",
    features: [
      "Unlimited AI agents",
      "Custom voice & personality",
      "White-label solution",
      "Dedicated account manager",
      "API access",
      "Custom integrations",
      "SLA guarantee",
      "7-day delivery",
    ],
    popular: false,
  },
];

const Pricing = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="pricing" className="py-20 md:py-32">
      <div ref={ref} className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <motion.span
            className="font-mono text-xs uppercase tracking-widest text-primary"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
          >
            Simple Pricing
          </motion.span>
          <motion.h2
            className="mt-2 font-heading text-4xl font-bold text-foreground md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
          >
            Invest in Automation
          </motion.h2>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-primary" />
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3 items-center">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              className={`relative glass rounded-2xl p-8 transition-all ${
                tier.popular
                  ? "md:scale-105 border-primary/40 shadow-[0_0_40px_hsla(37,91%,55%,0.15)]"
                  : ""
              }`}
              initial={{ opacity: 0, y: 40 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.6 }}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="gold-shimmer rounded-full px-4 py-1 font-mono text-xs font-semibold text-primary-foreground">
                    Most Popular
                  </span>
                </div>
              )}
              <h3 className="font-heading text-2xl font-bold text-foreground">{tier.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{tier.desc}</p>
              <div className="mt-6">
                <span className="font-heading text-5xl font-bold text-primary">{tier.price}</span>
                <span className="text-muted-foreground"> /project</span>
              </div>
              <ul className="mt-6 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <MagneticButton
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                  className={`w-full clip-angular py-3 font-heading font-semibold transition-all ${
                    tier.popular
                      ? "bg-primary text-primary-foreground hover:brightness-110"
                      : "border border-primary/30 text-primary hover:bg-primary/10"
                  }`}
                >
                  Get Started
                </MagneticButton>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
