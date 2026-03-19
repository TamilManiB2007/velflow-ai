const Logo = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const scale = size === "sm" ? 0.7 : size === "lg" ? 1.3 : 1;
  const h = 36 * scale;

  return (
    <div className="flex items-center gap-2.5" style={{ height: h }}>
      {/* Icon Mark */}
      <svg
        width={h}
        height={h}
        viewBox="0 0 36 36"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer ring */}
        <circle cx="18" cy="18" r="16" fill="#0D0D14" stroke="#F5A623" stroke-width="0.6" opacity="0.4"/>

        {/* V left arm */}
        <line x1="10" y1="8" x2="18" y2="26" stroke="#F5A623" stroke-width="2.5" stroke-linecap="round"/>
        {/* V right arm */}
        <line x1="26" y1="8" x2="18" y2="26" stroke="#F5A623" stroke-width="2.5" stroke-linecap="round"/>

        {/* Cross connector dashed */}
        <line x1="12.5" y1="16" x2="23.5" y2="16" stroke="#F5A623" stroke-width="0.8" stroke-dasharray="2,2.5" opacity="0.4"/>
        <circle cx="18" cy="16" r="1.5" fill="#F5A623" opacity="0.5"/>

        {/* Top left node box */}
        <rect x="6.5" y="5" width="7" height="7" rx="1.8" fill="#07070A" stroke="#F5A623" stroke-width="1.3"/>
        <circle cx="10" cy="8.5" r="1.5" fill="#F5A623"/>

        {/* Top right node box */}
        <rect x="22.5" y="5" width="7" height="7" rx="1.8" fill="#07070A" stroke="#F5A623" stroke-width="1.3"/>
        <circle cx="26" cy="8.5" r="1.5" fill="#F5A623"/>

        {/* Bottom tip */}
        <circle cx="18" cy="26" r="4" fill="#07070A" stroke="#F5A623" stroke-width="1.8"/>
        <circle cx="18" cy="26" r="1.8" fill="#F5A623"/>

        {/* Flow dots */}
        <circle cx="18" cy="32" r="1.5" fill="#F5A623" opacity="0.4"/>
      </svg>

      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-0">
          <span
            className="font-heading font-bold text-primary"
            style={{ fontSize: `${20 * scale}px`, letterSpacing: "-0.5px" }}
          >
            Vel
          </span>
          <span
            className="font-heading font-normal text-foreground"
            style={{ fontSize: `${20 * scale}px`, letterSpacing: "-0.5px" }}
          >
            Flow
          </span>
          <span
            className="ml-1 rounded font-mono font-bold text-primary-foreground"
            style={{
              fontSize: `${8 * scale}px`,
              background: "#F5A623",
              padding: "1px 4px",
              borderRadius: 3,
              marginBottom: 1,
            }}
          >
            AI
          </span>
        </div>
        {size !== "sm" && (
          <span
            className="font-mono text-muted-foreground tracking-widest"
            style={{ fontSize: `${7 * scale}px`, letterSpacing: "0.15em" }}
          >
            AUTOMATION AGENCY
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;