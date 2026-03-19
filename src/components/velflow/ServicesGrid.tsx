import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Bot, Headphones, TrendingUp, Users, Phone, Layers } from "lucide-react";

const services = [
  {
    icon: Bot,
    title: "AI Chatbot",
    desc: "Intelligent conversational agents that qualify leads, answer questions, and close deals 24/7.",
    features: ["Natural language processing", "Multi-language support", "CRM integration"],
    price: "From $1,500",
  },
  {
    icon: Headphones,
    title: "AI Support",
    desc: "Automated customer support that resolves 98% of tickets without human intervention.",
    features: ["Ticket auto-resolution", "Sentiment analysis", "Escalation routing"],
    price: "From $2,000",
  },
  {
    icon: TrendingUp,
    title: "AI Marketing",
    desc: "Data-driven marketing automation that creates, schedules, and optimises campaigns.",
    features: ["Content generation", "A/B testing", "Analytics dashboard"],
    price: "From $2,500",
  },
  {
    icon: Users,
    title: "Lead Generation",
    desc: "AI-powered lead scoring and nurturing that turns cold prospects into hot leads.",
    features: ["Lead scoring AI", "Email sequences", "Behaviour tracking"],
    price: "From $1,800",
  },
  {
    icon: Phone,
    title: "Voice Agent",
    desc: "AI voice assistants that handle calls, schedule appointments, and provide support.",
    features: ["Natural speech", "Call routing", "Real-time transcription"],
    price: "From $3,000",
  },
  {
    icon: Layers,
    title: "Full Suite",
    desc: "Complete AI automation package combining all services for maximum impact.",
    features: ["All features included", "Priority support", "Custom integrations"],
    price: "From $8,000",
  },
];

const ServicesGrid = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="services" className="py-20 md:py-32">
      <div ref={ref} className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <motion.span
            className="font-mono text-xs uppercase tracking-widest text-primary"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
          >
            What We Build
          </motion.span>
          <motion.h2
            className="mt-2 font-heading text-4xl font-bold text-foreground md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
          >
            Our Services
          </motion.h2>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-primary" />
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
};

function ServiceCard({
  service,
  index,
  isVisible,
}: {
  service: (typeof services)[0];
  index: number;
  isVisible: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const Icon = service.icon;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      className="group relative clip-diagonal overflow-hidden rounded-xl glass cursor-pointer"
      initial={{ opacity: 0, y: 60 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered
          ? `perspective(800px) rotateX(${(mousePos.y - 50) * -0.08}deg) rotateY(${(mousePos.x - 50) * 0.08}deg) translateZ(12px)`
          : "perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)",
        transition: "transform 0.2s ease-out",
      }}
    >
      {/* Inner glow following cursor */}
      {isHovered && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${mousePos.x}%`,
            top: `${mousePos.y}%`,
            width: 200,
            height: 200,
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, hsla(37,91%,55%,0.12) 0%, transparent 70%)",
          }}
        />
      )}

      {/* Gold top border on hover */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary origin-left transition-transform duration-500 scale-x-0 group-hover:scale-x-100" />

      {/* Shine sweep */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
      </div>

      <div className="relative z-10 p-6">
        <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 transition-transform duration-500 group-hover:rotate-[360deg]">
          <Icon className="h-7 w-7 text-primary" />
        </div>
        <h3 className="font-heading text-xl font-bold text-foreground">{service.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
        <ul className="mt-4 space-y-1.5">
          {service.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-primary">→</span> {f}
            </li>
          ))}
        </ul>
        <div className="mt-4 font-mono text-sm font-semibold text-primary">{service.price}</div>
      </div>
    </motion.div>
  );
}

export default ServicesGrid;
