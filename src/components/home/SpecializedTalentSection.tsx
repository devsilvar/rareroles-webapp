/**
 * SpecializedTalentSection Component
 * Displays the specialized roles RareRoles focuses on
 */

import { Link } from "react-router-dom";
import { Section, Eyebrow } from "../ui-bits";
import { useGetStarted } from "../get-started-modal";
import { ArrowUpRightIcon } from "@heroicons/react/24/solid";
import { frontierRoles } from "../../constants/roles";

export function SpecializedTalentSection() {
  const { open: openGetStarted } = useGetStarted();

  return (
    <Section>
      {/* Header - centered */}
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col items-center text-center">
          <Eyebrow>Specialized Talent</Eyebrow>
          <h2 className="text-display mt-6 text-4xl text-foreground md:text-5xl lg:text-6xl">
            Roles we specialize in
          </h2>
        </div>
      </div>

      {/* Role cards - left-aligned content */}
      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {frontierRoles.map((r, index) => (
          <article
            key={r.title}
            className="group relative flex flex-col overflow-hidden rounded-sm border border-border bg-card shadow-soft transition-all duration-300 hover:border-border-strong hover:shadow-elevated"
          >
            {/* Header with icon and number */}
            <div className="relative overflow-hidden bg-gradient-to-br from-ink via-primary to-accent px-6 py-6">
              <div className="flex items-start justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-sm border border-white/20 bg-white/10 shadow-soft backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
                  <r.icon className="h-7 w-7 text-white" />
                </div>
                <span className="font-mono text-[11px] font-semibold tracking-[0.2em] text-white/80">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-5 font-display text-[19px] font-bold leading-tight tracking-tight text-white">
                {r.title}
              </h3>
            </div>

            {/* Body content with button */}
            <div className="flex flex-1 flex-col justify-between p-6">
              {/* CTA Button - Beautiful pill-shaped with modal gradient */}
              <button
                type="button"
                onClick={() => openGetStarted("hiring", r.title)}
                className="group/btn relative overflow-hidden rounded-full border-4 border-primary bg-white px-3 py-2 text-base font-bold text-primary shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-primary hover:text-white hover:shadow-xl hover:shadow-primary/40 active:scale-[0.98]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span>Hire This Role</span>
                  <ArrowUpRightIcon className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </span>
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
              </button>
            </div>

            {/* Vetted indicator - subtle */}
            <div className="absolute right-6 top-6 flex items-center gap-1.5 rounded-full border border-border bg-card/90 px-2.5 py-1 shadow-soft backdrop-blur-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground">
                Vetted
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* Bottom CTA - centered */}
      <div className="mt-16 text-center">
        <p className="text-base text-ink-muted md:text-lg">
          Can't find what you are looking for?{" "}
          <Link
            to="/contact"
            className="font-semibold text-foreground underline decoration-border-strong underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
          >
            Tell us what you need
          </Link>
        </p>
      </div>
    </Section>
  );
}
