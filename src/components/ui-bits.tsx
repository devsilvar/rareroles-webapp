import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { prefetchRoute } from "@/lib/route-prefetch";

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-24 md:py-32 ${className}`}>
      <div className="container-page">{children}</div>
    </section>
  );
}

export function Eyebrow({ 
  children, 
  className = "" 
}: { 
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`inline-flex items-center gap-2 sm:gap-3 ${className}`}>
      <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-accent" />
      <span className="font-display text-xs sm:text-sm font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-accent whitespace-nowrap">
        {children}
      </span>
      <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-accent" />
    </div>
  );
}

export function CTAButton({
  to,
  children,
  classes,
  variant = "primary",
}: {
  to: string;
  classes?: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
}) {
  const base =
    "group inline-flex items-center gap-2 rounded-full px-6 py-3 font-display text-sm font-bold tracking-tight transition-all duration-200";

  const styles =
    variant === "primary"
      ? "bg-accent text-accent-foreground shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:scale-105 hover:bg-accent/90"
      : "border-2 border-border-strong text-foreground hover:bg-surface-elevated hover:border-foreground/40 hover:scale-105";
  return (
    <Link
      to={to}
      onMouseEnter={() => prefetchRoute(to)}
      onTouchStart={() => prefetchRoute(to)}
      className={`${base} ${styles} ${classes}`}
    >
      {children}
      <span className="transition-transform group-hover:translate-x-1">→</span>
    </Link>
  );
}

export function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="relative pt-6">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-rare/60 via-border-strong to-transparent" />
      <div className="text-display text-4xl text-foreground md:text-5xl">{value}</div>
      <div className="mt-2 text-sm text-ink-muted">{label}</div>
    </div>
  );
}
