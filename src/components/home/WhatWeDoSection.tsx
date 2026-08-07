/**
 * WhatWeDoSection Component
 * Explains the RareRoles approach and value proposition
 */

import { Section, Eyebrow } from "../ui-bits";
import { ResponsiveImage } from "../responsive-image";
import { BoltIcon, CheckBadgeIcon, ShieldCheckIcon } from "@heroicons/react/24/solid";
import prepareImg from "../../assets/prepare.jpg";
import prepareWebp from "../../assets/prepare.webp";

export function WhatWeDoSection() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-surface-elevated">
      <div className="pointer-events-none absolute inset-0 surface-grain opacity-60" />

      {/* Header section with padding */}
      <div className="container-page relative py-24 md:py-32">
        {/* Header - centered */}
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col items-center text-center">
            <Eyebrow>What we do</Eyebrow>
            <h2 className="text-display mt-6 text-4xl text-foreground md:text-5xl lg:text-6xl">
              We don't wait for roles — we prepare ahead
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-foreground/90 md:text-xl">
              At RareRoles, we don't start searching when you contact us.
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-foreground/90 md:text-xl">
              We already have access to pre-qualified talent in niche areas.
            </p>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-foreground/90 md:text-xl">
              This means you get:
            </p>
          </div>
        </div>
      </div>

      {/* Full-width image - edge to edge, reduced height */}
      <div className="relative w-full">
        <ResponsiveImage
          webpSrc={prepareWebp}
          fallbackSrc={prepareImg}
          alt="What we do - preparing talent ahead of time"
          width={1920}
          height={600}
          loading="lazy"
          className="h-[400px] w-full object-cover md:h-[500px] lg:h-[600px]"
        />
        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50" />
      </div>

      {/* Benefits - Approved three bullets */}
      <div className="container-page relative -mt-20 pb-24 md:pb-32">
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
          {[
            {
              title: "Faster hiring",
              description: "Shortlists in days, not weeks",
              icon: BoltIcon,
            },
            {
              title: "Better candidates",
              description: "Pre-vetted in the exact stack",
              icon: CheckBadgeIcon,
            },
            {
              title: "Reduced Hiring Cost",
              description: "One point of contact, done properly",
              icon: ShieldCheckIcon,
            },
          ].map((item) => (
            <div key={item.title} className="group relative">
              {/* Refined card - smaller, tighter */}
              <div className="relative overflow-hidden rounded-none border-2 border-border bg-card/95 backdrop-blur-xl px-6 py-8 shadow-lg transition-all duration-500 hover:border-accent hover:shadow-2xl hover:shadow-accent/10">
                {/* Icon */}
                <item.icon className="h-10 w-10 md:h-12 md:w-12 text-accent transition-transform duration-500 group-hover:scale-110" />

                {/* Title - refined size */}
                <h3 className="mt-5 font-display text-xl font-bold leading-tight tracking-tight text-foreground">
                  {item.title}
                </h3>

                {/* Description - compact */}
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.description}</p>

                {/* Subtle accent bar at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/0 via-accent/0 to-accent/0 transition-all duration-500 group-hover:from-accent/60 group-hover:via-accent group-hover:to-accent/60" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
