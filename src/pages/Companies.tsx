import { useEffect } from "react";
import {
  CheckIcon,
  UsersIcon,
  UserPlusIcon,
  BriefcaseIcon,
  LightBulbIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import { Section, Eyebrow, CTAButton } from "../components/ui-bits";
import stepBriefImg from "../assets/step-brief.jpg";
import stepShortlistImg from "../assets/step-shortlist.jpg";
import stepHireImg from "../assets/step-hire.jpg";
import teamMeetingImg from "../assets/team-meeting.jpg";
import enterpriseArchitectureImg from "../assets/enterprise-architecture.jpg";

const gains = [
  {
    t: "Access to pre-vetted talent",
    d: "Not a cold search — a warm pipeline built long before you asked.",
  },
  { t: "Faster time to hire", d: "Curated shortlists in days. Fill critical seats in weeks." },
  {
    t: "Reduced hiring risk",
    d: "Deep technical vetting so the interview is the last filter, not the first.",
  },
  {
    t: "Support for critical roles",
    d: "One accountable partner for the seats that carry the roadmap.",
  },
];

const services = [
  {
    tag: "Contract",
    title: "Contract Talent",
    icon: UserPlusIcon,
    body: "Get skilled professionals quickly when you need them. Choose from flexible options—either hire from our network of contract experts or bring in full-time professionals that fit your needs.",
    bestFor: "Fast-moving teams and project-based work",
    cta: "Book Consultation",
  },
  {
    tag: "Permanent",
    title: "Permanent Talent",
    icon: BriefcaseIcon,
    body: "Hire the right people and grow faster. Quickly find experienced professionals—from entry-level to senior leaders—to build a strong, long-term team.",
    bestFor: "Building stable teams for long-term success",
    cta: "Book Consultation",
  },
  {
    tag: "Pipeline",
    title: "Talent Pipeline Access",
    icon: UsersIcon,
    body: "We give you access to talent even before roles open.",
    bestFor: "Strategic hiring and future planning",
    cta: "Learn More",
  },
  {
    tag: "Early Talent",
    title: "Early Talent Solutions",
    icon: AcademicCapIcon,
    body: "Build your future workforce with emerging talent and structured development programs.",
    bestFor: "Long-term talent pipeline development",
    cta: "Explore Options",
  },
];

const industries = [
  { n: "01", name: "Banking" },
  { n: "02", name: "Fintech" },
  { n: "03", name: "Consulting (Big 4)" },
  { n: "04", name: "Telecom" },
  { n: "05", name: "Enterprise Tech" },
];


export default function Companies() {
  useEffect(() => {
    document.title = "For Companies — Hire rare tech talent faster | RareRoles";
  }, []);

  return (
    <>
      {/* HERO with background image */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={enterpriseArchitectureImg}
            alt="Enterprise architecture"
            className="h-full w-full object-cover"
          />
          {/* Dark overlay for text visibility - Multi-layer professional approach */}
          <div className="absolute inset-0 bg-slate-900/85" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-[#E91E63]/20" />
          {/* Subtle noise texture for depth */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="container-page relative z-10">
          <div className="max-w-4xl">
            <Eyebrow className="[&>span]:text-white/90 [&>div]:to-white/60">For companies</Eyebrow>
            <h1 className="text-display mt-6 text-5xl text-white md:text-7xl lg:text-[88px] drop-shadow-2xl">
              Hire Rare Talent Faster
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-white/90 md:text-xl drop-shadow-lg">
              We help you fill hard-to-find roles without wasting time
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <CTAButton to="/contact">Book a call</CTAButton>
              <CTAButton
                to="/#roles"
                variant="ghost"
                classes="border-2 border-white/40 bg-white/10 text-white backdrop-blur-md hover:border-white/60 hover:bg-white/20"
              >
                See roles we cover
              </CTAButton>
            </div>
          </div>
        </div>
      </section>

      {/* WHY */}
      <Section className="border-t border-border">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <Eyebrow>Why RareRoles</Eyebrow>
            <h2 className="text-display mt-6 text-4xl text-foreground md:text-5xl">
              Why companies choose us
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p className="text-lg text-foreground">We focus only on rare and hard-to-fill roles.</p>
            <p className="mt-6 text-lg text-foreground">
              We understand where to find these professionals and how to engage them.
            </p>
          </div>
        </div>
      </Section>

      {/* WHAT YOU GET */}
      <section className="bg-ink py-24 text-primary-foreground md:py-32">
        <div className="container-page">
          <div className="max-w-2xl">
            <Eyebrow>What you get</Eyebrow>
            <h2 className="text-display mt-6 text-4xl md:text-5xl">
              Built for the seats that actually matter.
            </h2>
          </div>
          <div className="mt-14 grid gap-px overflow-hidden rounded-sm bg-white/10 sm:grid-cols-2">
            {gains.map((g) => (
              <div key={g.t} className="bg-ink p-8">
                <CheckIcon className="h-5 w-5 text-rare" />
                <h3 className="mt-6 text-xl font-medium">{g.t}</h3>
                <p className="mt-3 text-[15px] text-primary-foreground/70">{g.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES - With Images, Consistent Layout */}
      <Section>
        <div className="max-w-2xl">
          <Eyebrow>Our services</Eyebrow>
          <h2 className="text-display mt-6 text-4xl text-foreground md:text-5xl">What you get</h2>
        </div>

        {/* Consistent Layout with Images */}
        <div className="mt-16 space-y-8">
          {services.map((s, index) => {
            const serviceImages = [stepBriefImg, stepShortlistImg, stepHireImg, teamMeetingImg];
            const serviceImage = serviceImages[index];

            return (
              <div key={s.title} className="group relative">
                {/* Smaller Number Background */}
                <div className="absolute -left-4 -top-6 font-display text-[120px] font-bold leading-none text-accent/5 md:text-[140px]">
                  0{index + 1}
                </div>

                {/* Main Card - More Compact */}
                <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-md transition-all duration-500 hover:shadow-xl hover:-translate-y-0.5">
                  <div className="grid gap-0 md:grid-cols-5">
                    {/* Left Column - Smaller Image */}
                    <div className="md:col-span-2">
                      <div className="relative h-48 overflow-hidden md:h-full">
                        <img
                          src={serviceImage}
                          alt={s.title}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent md:bg-gradient-to-r" />

                        {/* Smaller Tag */}
                        <div className="absolute left-4 top-4">
                          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-2.5 py-1 backdrop-blur-md">
                            <div className="h-1 w-1 animate-pulse rounded-full bg-white" />
                            <span className="font-mono text-[9px] font-semibold uppercase tracking-widest text-white">
                              {s.tag}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Compact Content */}
                    <div className="p-6 md:col-span-3 md:p-7">
                      {/* Title */}
                      <h3
                        className="text-display text-xl font-bold leading-tight text-foreground md:text-2xl"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {s.title}
                      </h3>

                      {/* Thinner Accent Line */}
                      <div className="mt-3 h-px w-12 bg-gradient-to-r from-accent to-accent/20" />

                      {/* Description */}
                      <p className="mt-4 text-sm leading-relaxed text-ink-muted">{s.body}</p>

                      {/* Compact Best For Section */}
                      <div className="mt-5 flex items-start gap-2.5 rounded-lg bg-muted/30 p-3">
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-accent/10">
                          <svg
                            className="h-3 w-3 text-accent"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="text-[10px] font-semibold uppercase tracking-wider text-foreground/50">
                            Perfect for
                          </div>
                          <div className="mt-1 text-sm font-medium leading-snug text-foreground">
                            {s.bestFor}
                          </div>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <div className="mt-6">
                        <CTAButton to="/contact" variant="ghost">
                          {s.cta}
                        </CTAButton>
                      </div>
                    </div>
                  </div>

                  {/* Subtle Gradient Overlay on Hover */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/0 to-accent/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Our Business Model Section - Full width edge-to-edge with perfect balance */}
      <div className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={teamMeetingImg}
            alt="Business discussion"
            className="h-full w-full object-cover"
          />
          {/* Professional dark overlay - Multiple layers for depth */}
          <div className="absolute inset-0 bg-slate-900/92" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-900/88 to-[#E91E63]/15" />
          {/* Subtle radial gradient for focus */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-slate-900/20 to-slate-900/70" />
          {/* Fine grain texture for premium feel */}
          <div
            className="absolute inset-0 opacity-[0.012]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulance type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Content - Elevated above background with perfect proportions */}
        <div className="relative z-10 py-20 md:py-24 lg:py-28">
          <div className="container-page">
            <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
              {/* Icon - Proportionally sized, minimalist */}
              <div className="flex items-center justify-center">
                <LightBulbIcon
                  className="h-12 w-12 text-[#E91E63] drop-shadow-[0_0_24px_rgba(233,30,99,0.6)] md:h-14 md:w-14"
                  strokeWidth={1.5}
                />
              </div>

              {/* Headline with subtle accent line - Perfectly balanced */}
              <div className="mt-6 space-y-2 md:mt-8">
                <div className="mx-auto h-px w-10 bg-gradient-to-r from-transparent via-[#E91E63] to-transparent opacity-50" />
                <h3
                  className="text-display text-2xl font-bold leading-tight text-white md:text-3xl lg:text-4xl drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
                  style={{ fontFamily: "Montserrat, sans-serif", letterSpacing: "-0.02em" }}
                >
                  Our Business Model
                </h3>
              </div>

              {/* Body text - Refined sizing for readability */}
              <p className="mt-5 max-w-lg text-base leading-relaxed text-white/85 md:text-lg drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
                Talk to our team to learn more
              </p>

              {/* CTA - Properly proportioned */}
              <div className="mt-8 md:mt-10">
                <CTAButton
                  to="/contact"
                  classes="shadow-2xl shadow-[#E91E63]/25 hover:shadow-[#E91E63]/40 transition-all duration-300 hover:scale-105"
                >
                  Contact Us
                </CTAButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* INDUSTRIES - Clean Minimalist Design */}
      <Section className="border-t border-border">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <Eyebrow>Industries we serve</Eyebrow>
            <h2 className="text-display mt-6 text-4xl text-foreground md:text-5xl">
              Regulated, technical, and complex.
            </h2>
            <p className="mt-6 text-ink-muted">
              We work best inside industries where the wrong hire is expensive and the right one
              moves the roadmap.
            </p>
          </div>
          <div className="md:col-span-7">
            {/* Minimalist List */}
            <ul className="space-y-0 border-t border-border">
              {industries.map((i) => (
                <li
                  key={i.name}
                  className="group flex items-center justify-between border-b border-border py-6 transition-colors duration-200 hover:bg-muted/30"
                >
                  <div className="flex items-center gap-6">
                    {/* Number */}
                    <span className="font-mono text-sm font-semibold text-ink-muted transition-colors duration-200 group-hover:text-accent">
                      {i.n}
                    </span>

                    {/* Industry Name */}
                    <span className="text-2xl font-semibold text-foreground transition-colors duration-200 group-hover:text-accent md:text-3xl">
                      {i.name}
                    </span>
                  </div>

                  {/* Arrow */}
                  <svg
                    className="h-5 w-5 text-ink-muted transition-all duration-200 group-hover:translate-x-1 group-hover:text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
