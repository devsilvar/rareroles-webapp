import { Link } from "react-router-dom";
import {
  ArrowUpRightIcon,
  CpuChipIcon,
  SparklesIcon,
  ArrowPathIcon,
  CloudArrowUpIcon,
  BuildingLibraryIcon,
  ChartBarIcon,
  CogIcon,
  ChartBarSquareIcon,
  FlagIcon,
  UserGroupIcon,
  RocketLaunchIcon,
  BoltIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import type { SVGProps } from "react";
import { Section, Eyebrow, CTAButton } from "../components/ui-bits";
import { Hero } from "../components/hero";
import { useGetStarted } from "../components/get-started-modal";
import { StatCard } from "../components/stat-card";
import { AnimatedCounter } from "../components/animated-counter";
import stepBriefImg from "../assets/step-brief.jpg";
import stepShortlistImg from "../assets/step-shortlist.jpg";
import stepHireImg from "../assets/step-hire.jpg";
import teamMeetingImg from "../assets/team-meeting.jpg";
import enterpriseArchitectureImg from "../assets/enterprise-architecture.jpg";

type FrontierRole = {
  title: string;
  blurb: string;
  cta: string;
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
};

const frontierRoles: FrontierRole[] = [
  {
    title: "Oracle PL/SQL Developers",
    blurb: "",
    cta: "",
    icon: BuildingLibraryIcon,
  },
  {
    title: "CCIE Network Engineers",
    blurb: "",
    cta: "",
    icon: CloudArrowUpIcon,
  },
  {
    title: "AIX System Administrators",
    blurb: "",
    cta: "",
    icon: CogIcon,
  },
  {
    title: "SharePoint Engineers",
    blurb: "",
    cta: "",
    icon: ArrowPathIcon,
  },
  {
    title: "AI / Machine Learning Engineers",
    blurb: "",
    cta: "",
    icon: CpuChipIcon,
  },
  {
    title: "AI Automation Engineers",
    blurb: "",
    cta: "",
    icon: SparklesIcon,
  },
  {
    title: "Solution Architects",
    blurb: "",
    cta: "",
    icon: ChartBarIcon,
  },
];

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

export default function Home() {
  const { open: openGetStarted } = useGetStarted();

  return (
    <>
      <Hero />

      {/* THE PROBLEM - Minimalist split layout with refined elegance */}
      <section className="relative overflow-hidden border-t border-border">
        {/* Background with subtle texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50" />
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="container-page relative py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 lg:items-center">
            
            {/* LEFT: Pure minimalist typography with elegant details */}
            <div className="relative">
              
              <Eyebrow>The Problem</Eyebrow>
              
              {/* Headline - Bold and confident */}
              <h2 className="mt-6 text-4xl md:text-5xl font-bold text-slate-900 leading-[1.1] tracking-tight">
                Hiring rare tech roles is not easy
              </h2>

              {/* Subtle visual break */}
              <div className="mt-6 flex items-center gap-3">
                <div className="h-px w-12 bg-[#E91E63]" />
                <div className="h-1 w-1 rounded-full bg-[#E91E63]/40" />
                <div className="h-1 w-1 rounded-full bg-[#E91E63]/20" />
              </div>

              {/* Body content - Perfect spacing and typography */}
              <div className="mt-8 space-y-5 text-lg md:text-xl leading-relaxed text-slate-700">
                <p>Some roles are hard to fill.</p>
                
                <p>Not because people are not hiring, but because the right talent is hard to find.</p>
                
                <p className="text-base md:text-lg text-slate-600">
                  These roles remain open for months, slowing business growth.
                </p>
              </div>
              
              {/* Conclusion - Minimalist emphasis */}
              <div className="relative mt-10 pl-4 border-l-2 border-[#E91E63]">
                <p className="text-xl md:text-2xl font-bold text-slate-900 leading-relaxed">
                  That is where RareRoles comes in.
                </p>
              </div>

            </div>

            {/* RIGHT: Pure minimalist stat cards with elegant movement */}
            <div className="space-y-0">
              {problemStats.map((s, idx) => (
                <div 
                  key={s.label}
                  className="group relative border-b border-slate-200/60 last:border-0"
                >
                  {/* Pure card - no background, no shadows, just content */}
                  <div className="relative py-8 transition-all duration-700 ease-out hover:pl-4">
                    
                    {/* Left accent line - slides in on hover */}
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-[#E91E63] scale-y-0 origin-top transition-transform duration-700 ease-out group-hover:scale-y-100" />
                    
                    <div className="flex items-start gap-6">
                      {/* Pure icon - no decoration */}
                      <div className="shrink-0 pt-1">
                        <s.icon 
                          className="h-10 w-10 md:h-11 md:w-11 text-[#E91E63] transition-transform duration-700 ease-out group-hover:scale-105" 
                          strokeWidth={1.5}
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Number - clean and bold with animation */}
                        <AnimatedCounter 
                          value={s.value}
                          duration={2500}
                          className="font-display text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-none transition-colors duration-700 group-hover:text-[#E91E63]"
                        />
                        
                        {/* Label - simple and clear */}
                        <div className="mt-2 text-sm md:text-base text-slate-500 leading-snug">
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

      {/* WHAT WE DO */}
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
          <img
            src={teamMeetingImg}
            alt="Senior advisors reviewing a search mandate"
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
                title: "Less stress",
                description: "One point of contact, done properly",
                icon: ShieldCheckIcon,
              },
            ].map((item) => (
              <div key={item.title} className="group relative">
                {/* Refined card - smaller, tighter */}
                <div className="relative overflow-hidden rounded-xl border-2 border-border bg-card/95 backdrop-blur-xl px-6 py-8 shadow-lg transition-all duration-500 hover:border-accent hover:shadow-2xl hover:shadow-accent/10">
                  {/* Large beautiful icon - no circles */}
                  <item.icon className="h-10 w-10 text-accent transition-transform duration-500 group-hover:scale-110" />

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

      {/* SPECIALIZED TALENT — Header centered, cards left-aligned */}
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
              <div className="relative border-b border-border bg-secondary/40 px-6 py-6">
                <div className="flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-sm border border-border bg-card shadow-soft transition-transform duration-300 group-hover:scale-105">
                    <r.icon className="h-7 w-7 text-foreground" />
                  </div>
                  <span className="font-mono text-[11px] font-semibold tracking-[0.2em] text-ink-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 text-[19px] font-bold leading-tight tracking-tight text-foreground">
                  {r.title}
                </h3>
              </div>

              {/* Body content with button */}
              <div className="flex flex-1 flex-col justify-between p-6">
                {/* CTA Button - Beautiful pill-shaped with modal gradient */}
                <button
                  type="button"
                  onClick={() => openGetStarted("hiring", r.title)}
                  className="group/btn relative overflow-hidden rounded-full bg-foreground from-[#E91E63] to-[#FF5722] px-4 py-3 text-center font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#E91E63]/30 active:scale-[0.98]"
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

      {/* HOW IT WORKS — Simple process */}
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
              const img = [stepBriefImg, stepShortlistImg, stepHireImg][i];
              return (
                <li
                  key={s.n}
                  className="group relative flex flex-col overflow-hidden rounded-sm border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-foreground/25 hover:shadow-elevated"
                >
                  {/* Picture plate */}
                  <div className="relative aspect-[5/4] w-full overflow-hidden bg-secondary">
                    <img
                      src={img}
                      alt={s.title}
                      width={1024}
                      height={1024}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
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
                      <h3 className="text-[20px] font-bold leading-tight tracking-tight text-white drop-shadow-sm">
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

      {/* FINAL CTA */}
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
                    <CTAButton to="/contact">Get Started</CTAButton>
                  </div>
                </div>
              </div>
              <div className="relative hidden min-h-[320px] md:block">
                <img
                  src={enterpriseArchitectureImg}
                  alt="Modern enterprise headquarters"
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
    </>
  );
}
