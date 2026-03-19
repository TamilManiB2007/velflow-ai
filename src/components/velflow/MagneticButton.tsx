import { useMagnetic } from "@/hooks/useMagnetic";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const MagneticButton = ({ children, className, onClick }: MagneticButtonProps) => {
  const { ref, style } = useMagnetic(0.3);
  return (
    <button
      ref={ref}
      style={style}
      onClick={onClick}
      className={cn("relative overflow-hidden", className)}
    >
      {children}
    </button>
  );
};

export default MagneticButton;
