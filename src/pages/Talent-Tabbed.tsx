import { useEffect, useState } from "react";
import {
  CheckIcon,
  UsersIcon,
  UserPlusIcon,
  BriefcaseIcon,
  LightBulbIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import { Section, Eyebrow, CTAButton } from "../components/ui-bits";
import { usePageView } from "@/hooks/useAnalytics";
import { useGetStarted } from "../components/get-started-modal";
import { useClickTracking } from "@/hooks/useAnalytics";
import stepBriefImg from "../assets/step-brief.jpg";
import stepShortlistImg from "../assets/step-shortlist.jpg";
import stepHireImg from "../assets/step-hire.jpg";
import teamMeetingImg from "../assets/team-meeting.jpg";
import enterpriseArchitectureImg from "../assets/enterprise-architecture.jpg";

// Type for tab selection
type TabType = "companies" | "talent";

// Company Benefits
const companyGains = [
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

// Company Services
const companyServices = [
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

// Talent Benefits
const talentBenefits = [
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
  const { open: openGetStarted } = useGetStarted();
  const trackClick = useClickTracking("why_choose_us");
  const [activeTab, setActiveTab] = useState<TabType>("companies");

  usePageView();

  useEffect(() => {
    document.title = "Why Choose Us — For Companies & Talent | RareRoles";
  }, []);

  return (
    <>
      {/* HERO - Clean & Professional */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="absolute inset-0">
          <img
            src={enterpriseArchitectureImg}
            alt="Professional business environment"
            width={1920}
            height={1280}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/88" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/92 via-slate-900/82 to-[#E91E63]/18" />
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="container-page relative z-10">
          <div className="mx-auto max-w-5xl text-center">
            <Eyebrow className="[&>span]:text-white/90 [&>div]:to-white/60">Why Choose Us</Eyebrow>
            <h1 className="text-display mt-6 text-5xl text-white md:text-7xl lg:text-[88px] drop-shadow-2xl leading-[1.1]">
              Built for Success
            </h1>
            <p className="mt-8 mx-auto max-w-3xl text-lg text-white/90 md:text-xl drop-shadow-lg leading-relaxed">
              Whether you're hiring rare talent or seeking exclusive opportunities, we deliver
              results that matter.
            </p>
          </div>
        </div>
      </section>

      {/* PREMIUM TAB INTERFACE - Stripe/Notion Style */}
      <Section className="border-t border-border">
        <div className="mx-auto max-w-6xl">
          {/* Tab Switcher - Premium Design */}
          <div className="relative flex justify-center">
            <div className="inline-flex rounded-full border-2 border-border bg-surface-elevated p-1.5 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("companies");
                  trackClick("tab_switch_companies");
                }}
                className={`relative flex items-center gap-2.5 rounded-full px-8 py-3.5 text-base font-bold transition-all duration-300 ${
                  activeTab === "companies"
                    ? "bg-[#E91E63] text-white shadow-lg"
                    : "text-foreground hover:bg-muted/50"
                }`}
              >
                <BuildingOfficeIcon className="h-5 w-5" strokeWidth={2} />
                <span>For Companies</span>
                {activeTab === "companies" && (
                  <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("talent");
                  trackClick("tab_switch_talent");
                }}
                className={`relative flex items-center gap-2.5 rounded-full px-8 py-3.5 text-base font-bold transition-all duration-300 ${
                  activeTab === "talent"
                    ? "bg-[#E91E63] text-white shadow-lg"
                    : "text-foreground hover:bg-muted/50"
                }`}
              >
                <BriefcaseIcon className="h-5 w-5" strokeWidth={2} />
                <span>For Talent</span>
                {activeTab === "talent" && (
                  <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
                )}
              </button>
            </div>
          </div>

          {/* TAB CONTENT - Smooth Transitions */}
          <div className="mt-16">
            {/* COMPANIES CONTENT */}
            {activeTab === "companies" && (
              <div className="animate-fadeIn">
                {/* Why RareRoles */}
                <div className="mb-24">
                  <div className="grid gap-16 md:grid-cols-12">
                    <div className="md:col-span-5">
                      <Eyebrow>Why RareRoles</Eyebrow>
                      <h2 className="text-display mt-6 text-4xl text-foreground md:text-5xl">
                        Why companies choose us
                      </h2>
                    </div>
                    <div className="md:col-span-6 md:col-start-7">
                      <p className="text-lg text-foreground">
                        We focus only on rare and hard-to-fill roles.
                      </p>
                      <p className="mt-6 text-lg text-foreground">
                        We understand where to find these professionals and how to engage them.
                      </p>
                    </div>
                  </div>
                </div>

                {/* What You Get */}
                <div className="mb-24">
                  <div className="max-w-2xl mb-12">
                    <Eyebrow>What you get</Eyebrow>
                    <h2 className="text-display mt-6 text-4xl md:text-5xl">
                      Built for the seats that actually matter.
                    </h2>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {companyGains.map((g) => (
                      <div
                        key={g.t}
                        className="group relative overflow-hidden rounded-xl border border-border bg-card p-8 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#E91E63]/40"
                      >
                        <CheckIcon className="h-6 w-6 text-[#E91E63]" strokeWidth={2.5} />
                        <h3
                          className="mt-5 text-xl font-bold text-foreground"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          {g.t}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-ink-muted">{g.d}</p>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E91E63]/0 via-[#E91E63]/0 to-[#E91E63]/0 transition-all duration-500 group-hover:from-[#E91E63]/60 group-hover:via-[#E91E63] group-hover:to-[#E91E63]/60" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Our Services */}
                <div className="mb-24">
                  <div className="max-w-2xl mb-12">
                    <Eyebrow>Our services</Eyebrow>
                    <h2 className="text-display mt-6 text-4xl text-foreground md:text-5xl">
                      What you get
                    </h2>
                  </div>

                  <div className="space-y-8">
                    {companyServices.map((s, index) => {
                      const serviceImages = [
                        stepBriefImg,
                        stepShortlistImg,
                        stepHireImg,
                        teamMeetingImg,
                      ];
                      const serviceImage = serviceImages[index];

                      return (
                        <div key={s.title} className="group relative">
                          <div className="absolute -left-4 -top-6 font-display text-[120px] font-bold leading-none text-accent/5 md:text-[140px]">
                            0{index + 1}
                          </div>

                          <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-md transition-all duration-500 hover:shadow-xl hover:-translate-y-0.5">
                            <div className="grid gap-0 md:grid-cols-5">
                              <div className="md:col-span-2">
                                <div className="relative h-48 overflow-hidden md:h-full">
                                  <img
                                    src={serviceImage}
                                    alt={s.title}
                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent md:bg-gradient-to-r" />

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

                              <div className="p-6 md:col-span-3 md:p-7">
                                <h3
                                  className="text-display text-xl font-bold leading-tight text-foreground md:text-2xl"
                                  style={{ fontFamily: "Montserrat, sans-serif" }}
                                >
                                  {s.title}
                                </h3>

                                <div className="mt-3 h-px w-12 bg-gradient-to-r from-accent to-accent/20" />

                                <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                                  {s.body}
                                </p>

                                <div className="mt-5 flex items-start gap-2.5 rounded-lg bg-muted/30 p-3">
                                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-accent/10">
                                    <svg
                                      className="h-3 w-3 text-accent"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth={2.5}
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                      />
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

                                <div className="mt-6">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      trackClick(`service_${s.tag.toLowerCase()}`);
                                      openGetStarted("hiring", s.title);
                                    }}
                                    className="group/btn inline-flex items-center gap-2 rounded-full border-2 border-accent/20 bg-accent/5 px-6 py-2.5 font-display text-sm font-bold text-accent transition-all duration-300 hover:border-accent hover:bg-accent hover:text-white hover:shadow-lg"
                                  >
                                    {s.cta}
                                    <svg
                                      className="h-4 w-4 transition-transform group-hover/btn:translate-x-1"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth={2}
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/0 to-accent/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Business Model CTA */}
                <div className="relative overflow-hidden rounded-2xl">
                  <div className="absolute inset-0">
                    <img
                      src={teamMeetingImg}
                      alt="Business discussion"
                      width={1920}
                      height={1280}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/92" />
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-900/88 to-[#E91E63]/15" />
                  </div>

                  <div className="relative z-10 py-20 md:py-24">
                    <div className="container-page">
                      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
                        <LightBulbIcon
                          className="h-12 w-12 text-[#E91E63] drop-shadow-[0_0_24px_rgba(233,30,99,0.6)] md:h-14 md:w-14"
                          strokeWidth={1.5}
                        />

                        <h3
                          className="mt-8 text-display text-2xl font-bold leading-tight text-white md:text-3xl lg:text-4xl drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          Our Business Model
                        </h3>

                        <p className="mt-5 text-base leading-relaxed text-white/85 md:text-lg drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
                          Talk to our team to learn more
                        </p>

                        <div className="mt-8">
                          <button
                            type="button"
                            onClick={() => {
                              trackClick("business_model_cta");
                              openGetStarted("hiring");
                            }}
                            className="group inline-flex items-center gap-2 rounded-full bg-[#E91E63] px-8 py-4 text-base font-bold text-white shadow-2xl shadow-[#E91E63]/25 transition-all duration-300 hover:scale-105 hover:shadow-[#E91E63]/40"
                          >
                            Contact Us
                            <svg
                              className="h-5 w-5 transition-transform group-hover:translate-x-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TALENT CONTENT */}
            {activeTab === "talent" && (
              <div className="animate-fadeIn">
                {/* Why Join Us */}
                <div className="-mb-5">
                  <div className="grid gap-12 lg:gap-16 lg:grid-cols-2 lg:items-center">
                    <div>
                      <Eyebrow>Why join us</Eyebrow>
                      <h2 className="text-display mt-6 text-4xl text-foreground md:text-5xl">
                        Why join us
                      </h2>
                      <div className="mt-8 space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E91E63]/10">
                            <svg
                              className="h-5 w-5 text-[#E91E63]"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <p className="text-lg text-foreground leading-relaxed">
                            We connect you to high-value and specialized roles.
                          </p>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E91E63]/10">
                            <svg
                              className="h-5 w-5 text-[#E91E63]"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <p className="text-lg text-foreground leading-relaxed">
                            We work with companies looking for your exact skills.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                        <img
                          src={teamMeetingImg}
                          alt="Professionals collaborating"
                          width={800}
                          height={600}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#E91E63]/10 to-transparent" />
                      </div>
                      <div className="absolute -bottom-6 -right-6 -z-10 h-48 w-48 rounded-full bg-[#E91E63]/5 blur-3xl" />
                    </div>
                  </div>
                </div>

                {/* What You Get */}
                <div className="mb-24">
                  <div className="max-w-2xl mb-12">
                    <Eyebrow>What you get</Eyebrow>
                    <h2 className="text-display mt-6 text-4xl md:text-5xl">What you get</h2>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-3">
                    {talentBenefits.map((b, index) => (
                      <div
                        key={b.title}
                        className="group relative overflow-hidden rounded-xl border border-border bg-card p-8 shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-[#E91E63]/40"
                      >
                        <div className="absolute -right-4 -top-4 font-display text-[120px] font-bold leading-none text-muted/10 opacity-50">
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        <div className="relative">
                          <b.icon
                            className="h-12 w-12 text-[#E91E63] drop-shadow-[0_2px_8px_rgba(233,30,99,0.25)]"
                            strokeWidth={1.5}
                          />
                        </div>

                        <h3
                          className="relative mt-6 text-lg font-bold leading-tight text-foreground"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          {b.title}
                        </h3>

                        <div className="mt-3 h-px w-12 bg-gradient-to-r from-[#E91E63] to-transparent opacity-40" />

                        <p className="relative mt-4 text-sm leading-relaxed text-ink-muted">
                          {b.description}
                        </p>

                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E91E63]/0 via-[#E91E63]/0 to-[#E91E63]/0 transition-all duration-500 group-hover:from-[#E91E63]/60 group-hover:via-[#E91E63] group-hover:to-[#E91E63]/60" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Join Network CTA */}
                <div className="rounded-2xl border-2 border-[#E91E63]/20 bg-gradient-to-br from-[#E91E63]/5 via-surface-elevated to-surface-elevated p-10 shadow-xl md:p-16">
                  <div className="mx-auto max-w-2xl text-center">
                    <Eyebrow>Join our network</Eyebrow>
                    <h2 className="text-display mt-6 text-4xl text-foreground md:text-5xl">
                      Join our talent network
                    </h2>
                    <p className="mt-6 text-lg text-ink-muted">
                      Sign up and let us match you with the right opportunities
                    </p>
                    <div className="mt-10">
                      <button
                        type="button"
                        onClick={() => {
                          trackClick("join_network_cta");
                          openGetStarted("talent");
                        }}
                        className="group inline-flex items-center gap-2 rounded-full bg-[#E91E63] px-10 py-5 text-lg font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[#E91E63]/50"
                      >
                        Join Now
                        <svg
                          className="h-6 w-6 transition-transform group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
