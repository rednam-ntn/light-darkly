interface StatusDotProps {
  on: boolean;
  size?: "sm" | "md";
}

export function StatusDot({ on, size = "sm" }: StatusDotProps) {
  const sizeClass = size === "sm" ? "h-2 w-2" : "h-3 w-3";
  const colorClass = on ? "bg-green-500" : "bg-red-400";

  return (
    <span
      className={`inline-block rounded-full ${sizeClass} ${colorClass}`}
      aria-label={on ? "On" : "Off"}
    />
  );
}
