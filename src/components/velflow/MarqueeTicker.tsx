const items = [
  "AI Chatbots",
  "Customer Support",
  "Lead Generation",
  "Voice Agents",
  "Marketing Automation",
  "3-Day Delivery",
  "24/7 Uptime",
  "Revenue Growth",
];

const MarqueeTicker = () => {
  return (
    <section className="overflow-hidden border-y border-primary/20 bg-primary/5 py-4">
      <div className="animate-marquee flex whitespace-nowrap">
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span key={i} className="mx-8 font-heading text-lg font-semibold text-primary md:text-xl">
            {item}
            <span className="ml-8 text-primary/40">·</span>
          </span>
        ))}
      </div>
    </section>
  );
};

export default MarqueeTicker;
