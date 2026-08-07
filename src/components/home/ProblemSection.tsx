/**
 * ProblemSection Component
 * Displays the problem statement with stats about hiring challenges
 */

import { AnimatedCounter } from "../animated-counter";
import { Eyebrow, Section } from "../ui-bits";
import { ChartBarSquareIcon, BoltIcon, CheckBadgeIcon } from "@heroicons/react/24/solid";
import type { SVGProps } from "react";

type Stat = {
  value: string;
  label: string;
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
};

const problemStats: Stat[] = [
  {
    value: "60d",
    label: "Avg. days a niche role sits open",
    icon: ChartBarSquareIcon,
  },
  {
    value: "3.2×",
    label: "Faster time-to-hire with us",
    icon: BoltIcon,
  },
  {
    value: "87%",
    label: "Offer acceptance rate",
    icon: CheckBadgeIcon,
  },
];

export function ProblemSection() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-surface-elevated">
      {/* Background with subtle texture - CONSISTENT */}
      <div className="pointer-events-none absolute inset-0 surface-grain opacity-60" />

      <div className="container-page relative py-24 md:py-32">
        
        {/* Two column layout - ORIGINAL DESIGN RESTORED */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 lg:items-center">
          
          {/* LEFT: Content */}
          <div className="relative">
            <Eyebrow>The Problem</Eyebrow>
            
            <h2 className="mt-6 font-display text-4xl md:text-5xl font-bold text-foreground leading-[1.1] tracking-tight">
              Hiring rare tech roles is not easy
            </h2>

            <div className="mt-8 space-y-5 text-lg md:text-xl leading-relaxed text-foreground/90">
              <p>Some roles are hard to fill.</p>
              
              <p>Not because people are not hiring, but because the right talent is hard to find.</p>
              
              <p className="text-base md:text-lg text-foreground/70">
                These roles remain open for months, slowing business growth.
              </p>
            </div>
            
            <div className="relative mt-10 pl-4 border-l-2 border-accent">
              <p className="text-xl md:text-2xl font-bold text-foreground leading-relaxed">
                That is where RareRoles comes in.
              </p>
            </div>
          </div>

          {/* RIGHT: Stats cards (ORIGINAL LAYOUT) */}
          <div className="space-y-0">
            {problemStats.map((s) => (
              <div 
                key={s.label}
                className="group relative border-b border-border/60 last:border-0"
              >
                <div className="relative py-8 transition-all duration-700 ease-out hover:pl-4">
                  
                  {/* Left accent line - slides in on hover */}
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-accent scale-y-0 origin-top transition-transform duration-700 ease-out group-hover:scale-y-100" />
                  
                  <div className="flex items-start gap-6">
                    {/* Icon - BIGGER as requested */}
                    <div className="shrink-0 pt-1">
                      <s.icon 
                        className="h-14 w-14 md:h-16 md:w-16 text-accent transition-transform duration-700 ease-out group-hover:scale-105" 
                        strokeWidth={1.5}
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Number */}
                      <AnimatedCounter 
                        value={s.value}
                        duration={2500}
                        className="text-5xl md:text-6xl font-black text-foreground tracking-tight leading-none transition-colors duration-700 group-hover:text-accent [font-family:Montserrat,sans-serif]"
                      />
                      
                      {/* Label */}
                      <div className="mt-2 text-sm md:text-base text-foreground/70 leading-snug">
                        {s.label}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
