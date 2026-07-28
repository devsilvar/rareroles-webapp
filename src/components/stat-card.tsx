import type { SVGProps } from "react";
import { useCounterAnimation } from "../hooks/use-counter-animation";

interface StatCardProps {
  value: string;
  label: string;
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
  index: number;
}

/**
 * Parse stat value to extract number, prefix, and suffix
 * Examples: "60d" -> {num: 60, suffix: "d"}, "3.2×" -> {num: 3.2, suffix: "×"}, "87%" -> {num: 87, suffix: "%"}
 */
function parseStatValue(value: string): { num: number; suffix: string; decimals: number } {
  // Match number (including decimals) and any suffix
  const match = value.match(/^([\d.]+)(.*)$/);
  
  if (!match) {
    return { num: 0, suffix: value, decimals: 0 };
  }
  
  const num = parseFloat(match[1]);
  const suffix = match[2];
  const decimals = match[1].includes(".") ? match[1].split(".")[1].length : 0;
  
  return { num, suffix, decimals };
}

export function StatCard({ value, label, icon: Icon, index }: StatCardProps) {
  const { num, suffix, decimals } = parseStatValue(value);
  const counter = useCounterAnimation({
    end: num,
    duration: 2500,
    decimals,
    suffix,
  });

  return (
    <div
      ref={counter.ref}
      className="group relative"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Outer glow on hover */}
      <div className="absolute -inset-px rounded-lg bg-gradient-to-b from-accent/0 via-accent/0 to-accent/0 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-30" />
      
      {/* Card - Clean minimalist design */}
      <div className="relative flex flex-col items-center overflow-hidden rounded-lg border border-border/40 bg-card px-8 py-12 text-center transition-all duration-500 group-hover:border-accent/40 group-hover:shadow-xl group-hover:-translate-y-2 sm:py-16 md:px-10 md:py-20">
        
        {/* Subtle background gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-muted/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Icon - Large, standalone, no circles - BIGGER than text */}
        <div className="relative mb-8 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1">
          {/* Subtle glow behind icon on hover */}
          <div className="absolute inset-0 scale-150 rounded-full bg-accent/0 opacity-0 blur-2xl transition-all duration-500 group-hover:bg-accent/20 group-hover:opacity-100" />
          
          {/* Icon - standalone, prominent, clean */}
          <Icon className="relative z-10 h-16 w-16 text-foreground/60 transition-all duration-500 group-hover:text-accent sm:h-20 sm:w-20 md:h-24 md:w-24" />
        </div>

        {/* Value - large, bold, and animated - SMALLER than icon */}
        <div className="relative z-10 font-display text-4xl font-bold leading-none tracking-tight text-foreground transition-all duration-500 group-hover:text-accent sm:text-5xl md:text-6xl">
          {counter.count}
        </div>

        {/* Label - refined typography */}
        <div className="relative z-10 mt-4 max-w-[200px] text-sm font-medium leading-snug text-ink-muted transition-colors duration-500 group-hover:text-foreground sm:text-base">
          {label}
        </div>

        {/* Bottom accent line - cleaner, thinner */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-accent/0 to-transparent transition-all duration-500 group-hover:via-accent" />
        </div>
      </div>
    </div>
  );
}
