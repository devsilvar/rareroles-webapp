import { useEffect } from "react";
import {
  BriefcaseIcon,
  BuildingOfficeIcon,
  RocketLaunchIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { Section, Eyebrow, CTAButton } from "../components/ui-bits";
import teamMeetingImg from "../assets/team-meeting.jpg";

const benefits = [
  {
    icon: BriefcaseIcon,
    title: "Access to exclusive job opportunities",
    description: "Get connected to roles you won't easily find online",
  },
  {
    icon: BuildingOfficeIcon,
    title: "Visibility to top companies",
    description: "Your profile reaches hiring managers at leading organizations",
  },
  {
    icon: RocketLaunchIcon,
    title: "Career growth opportunities",
    description: "Advance your career with specialized, high-value roles",
  },
];

export default function Talent() {
  useEffect(() => {
    document.title = "For Talent — Access better opportunities | RareRoles";
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="container-page">
          <div className="max-w-4xl">
            <Eyebrow>For talent</Eyebrow>
            <h1 className="text-display mt-6 text-5xl text-foreground md:text-7xl lg:text-[88px]">
              Access Better Opportunities
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-ink-muted md:text-xl">
              Get connected to roles you won't easily find online
            </p>
          </div>
        </div>
      </section>

      {/* WHY JOIN US - Enhanced with image */}
      <Section className="border-t border-border">
        <div className="grid gap-12 lg:gap-16 lg:grid-cols-2 lg:items-center">
          {/* Left: Content */}
          <div>
            <Eyebrow>Why join us</Eyebrow>
            <h2 className="text-display mt-6 text-4xl text-foreground md:text-5xl">
              Why join us
            </h2>
            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E91E63]/10">
                  <svg className="h-5 w-5 text-[#E91E63]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-lg text-foreground leading-relaxed">
                  We connect you to high-value and specialized roles.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E91E63]/10">
                  <svg className="h-5 w-5 text-[#E91E63]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-lg text-foreground leading-relaxed">
                  We work with companies looking for your exact skills.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={teamMeetingImg}
                alt="Professionals collaborating"
                className="h-full w-full object-cover"
              />
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#E91E63]/10 to-transparent" />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 -z-10 h-48 w-48 rounded-full bg-[#E91E63]/5 blur-3xl" />
          </div>
        </div>
      </Section>

      {/* WHAT YOU GET - White boxes with standalone icons */}
      <section className="bg-ink py-24 text-primary-foreground md:py-32">
        <div className="container-page">
          <div className="max-w-2xl">
            <Eyebrow>What you get</Eyebrow>
            <h2 className="text-display mt-6 text-4xl md:text-5xl">
              What you get
            </h2>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {benefits.map((b, index) => (
              <div 
                key={b.title} 
                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-[#E91E63]/40"
              >
                {/* Subtle number in background */}
                <div className="absolute -right-4 -top-4 font-display text-[120px] font-bold leading-none text-slate-100 opacity-50">
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* Standalone icon - No background box */}
                <div className="relative">
                  <b.icon className="h-12 w-12 text-[#E91E63] drop-shadow-[0_2px_8px_rgba(233,30,99,0.25)]" strokeWidth={1.5} />
                </div>

                {/* Content */}
                <h3 className="relative mt-6 text-lg font-bold leading-tight text-slate-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {b.title}
                </h3>
                
                {/* Accent line */}
                <div className="mt-3 h-px w-12 bg-gradient-to-r from-[#E91E63] to-transparent opacity-40" />
                
                <p className="relative mt-4 text-sm leading-relaxed text-slate-600">
                  {b.description}
                </p>

                {/* Hover accent bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E91E63]/0 via-[#E91E63]/0 to-[#E91E63]/0 transition-all duration-500 group-hover:from-[#E91E63]/60 group-hover:via-[#E91E63] group-hover:to-[#E91E63]/60" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JOIN NETWORK */}
      <Section>
        <div className="mx-auto max-w-4xl">
          <div className="rounded-xl border border-border bg-surface-elevated p-10 shadow-lg md:p-16">
            <div className="mx-auto max-w-2xl text-center">
              <Eyebrow>Join our network</Eyebrow>
              <h2 className="text-display mt-6 text-4xl text-foreground md:text-5xl">
                Join our talent network
              </h2>
              <p className="mt-6 text-lg text-ink-muted">
                Sign up and let us match you with the right opportunities
              </p>
              <div className="mt-10">
                <CTAButton to="/contact">Join Now</CTAButton>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
