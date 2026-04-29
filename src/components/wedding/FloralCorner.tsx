interface Props {
  position: "tl" | "tr" | "bl" | "br";
  className?: string;
}

const FLORAL_URL =
  "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=400&q=80";

const positionClasses: Record<Props["position"], string> = {
  tl: "top-0 left-0",
  tr: "top-0 right-0 scale-x-[-1]",
  bl: "bottom-0 left-0 scale-y-[-1]",
  br: "bottom-0 right-0 scale-x-[-1] scale-y-[-1]",
};

export function FloralCorner({ position, className = "" }: Props) {
  return (
    <div
      className={`pointer-events-none absolute h-28 w-28 md:h-40 md:w-40 ${positionClasses[position]} ${className}`}
      style={{
        backgroundImage: `url(${FLORAL_URL})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: 0.55,
        mixBlendMode: "multiply",
        maskImage: "radial-gradient(circle at 0% 0%, black 30%, transparent 70%)",
        WebkitMaskImage: "radial-gradient(circle at 0% 0%, black 30%, transparent 70%)",
      }}
    />
  );
}
