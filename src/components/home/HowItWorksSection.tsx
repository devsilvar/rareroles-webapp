/**
 * HowItWorksSection Component
 * Shows the 3-step hiring process with visual steps
 */

import { Section, Eyebrow } from "../ui-bits";
import { ResponsiveImage } from "../responsive-image";
import { FlagIcon, UserGroupIcon, RocketLaunchIcon } from "@heroicons/react/24/solid";
import type { SVGProps } from "react";
import r1Img from "../../assets/r1.jpg";
import r1Webp from "../../assets/r1.webp";
import r2Img from "../../assets/r2.jpg";
import r2Webp from "../../assets/r2.webp";
import r4Img from "../../assets/r4.jfif";

type Step = {
  n: string;
  title: string;
  body: string;
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
};

const steps: Step[] = [
  {
    n: "01",
    title: "Tell us the role you want to fill",
    body: "",
    icon: FlagIcon,
  },
  {
    n: "02",
    title: "We match you with the right talent",
    body: "",
    icon: UserGroupIcon,
  },
  {
    n: "03",
    title: "You hire faster and easier",
    body: "",
    icon: RocketLaunchIcon,
  },
];

export function HowItWorksSection() {
  return (
    <Section className="border-t border-border">
      <div className="flex flex-col items-center text-center">
        <Eyebrow>How it works</Eyebrow>
        <h2 className="text-display mt-5 text-4xl text-foreground md:text-5xl lg:text-6xl">
          Simple process
        </h2>
      </div>

      <div className="relative mt-16">
        {/* horizontal rail behind cards */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-8 right-8 top-[140px] hidden h-px bg-gradient-to-r from-transparent via-border-strong to-transparent lg:block"
        />

        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => {
            const images = [
              { webp: r1Webp, fallback: r1Img },
              { webp: r2Webp, fallback: r2Img },
              { webp: r4Img, fallback: r4Img }, // r4 is already jfif, no webp version
            ];
            const img = images[i];
            return (
              <li
                key={s.n}
                className="group relative flex flex-col overflow-hidden rounded-sm border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-foreground/25 hover:shadow-elevated"
              >
                {/* Picture plate */}
                <div className="relative aspect-[5/4] w-full overflow-hidden bg-secondary">
                  <ResponsiveImage
                    webpSrc={img.webp}
                    fallbackSrc={img.fallback}
                    alt={s.title}
                    width={1024}
                    height={1024}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  {/* gradient wash for legibility */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-foreground/25 via-transparent to-transparent" />

                  {/* Step number chip (top-left) */}
                  <div className="absolute left-5 top-5 flex items-center gap-2 rounded-sm border border-white/25 bg-white/10 px-2.5 py-1 backdrop-blur-md">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/85">
                      Step
                    </span>
                    <span className="font-mono text-[12px] font-bold text-white">{s.n}</span>
                  </div>

                  {/* Title overlay (bottom) */}
                  <div className="absolute inset-x-5 bottom-5">
                    <h3 className="font-display text-[20px] font-bold leading-tight tracking-tight text-white drop-shadow-sm">
                      {s.title}
                    </h3>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
