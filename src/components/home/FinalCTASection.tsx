/**
 * FinalCTASection Component
 * Final call-to-action section with image and get started button
 */

import { Eyebrow } from "../ui-bits";
import { ResponsiveImage } from "../responsive-image";
import { useGetStarted } from "../get-started-modal";
import techgirlImg from "../../assets/techgirl.jpg";
import techgirlWebp from "../../assets/techgirl.webp";

export function FinalCTASection() {
  const { open: openGetStarted } = useGetStarted();

  return (
    <section className="pb-24 md:pb-32">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-sm border border-border-strong bg-surface-elevated shadow-elevated">
          <div className="pointer-events-none absolute inset-0 surface-grid opacity-60" />
          <div className="grid md:grid-cols-2">
            <div className="relative p-10 md:p-16 lg:p-20">
              <div className="relative max-w-xl">
                <Eyebrow>Get started</Eyebrow>
                <h2 className="text-display mt-6 text-4xl text-foreground md:text-5xl lg:text-6xl">
                  Let's help you fill your hardest roles
                </h2>
                <div className="mt-10">
                  <button
                    type="button"
                    onClick={() => openGetStarted()}
                    className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-display text-sm font-bold tracking-tight text-accent-foreground shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:bg-accent/90 hover:shadow-xl"
                  >
                    Get Started
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="relative hidden min-h-[320px] md:block">
              <ResponsiveImage
                webpSrc={techgirlWebp}
                fallbackSrc={techgirlImg}
                alt="Tech professional ready for their next role"
                width={1024}
                height={768}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-surface-elevated via-surface-elevated/40 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
