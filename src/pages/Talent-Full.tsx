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
import bperson1 from "../assets/bperson (1).jpg";
import bperson2 from "../assets/bperson (2).jpg";
import bperson3 from "../assets/bperson (3).jpg";
import bperson4 from "../assets/bperson (4).jpg";

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
            alt="Team collaboration"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/85" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/92 via-slate-900/82 to-accent/18" />
        </div>

        <div className="container-page relative z-10">
          <div className="max-w-4xl">
            <Eyebrow>Why Choose Us</Eyebrow>
            <h1 className="text-display mt-6 text-5xl text-white md:text-7xl lg:text-[88px]">
              Why Choose RareRoles
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-white/90 md:text-xl">
              Whether you're hiring or looking for opportunities, we connect the right people with
              the right roles.
            </p>
          </div>
        </div>
      </section>

      {/* TAB SWITCHER - Premium Design */}
      <Section>
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-3 rounded-full bg-muted p-1.5 shadow-sm">
            <button
              type="button"
              onClick={() => {
                setActiveTab("companies");
                trackClick("tab_switch_companies");
              }}
              className={`relative flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                activeTab === "companies"
                  ? "bg-accent text-white shadow-md"
                  : "text-foreground hover:bg-muted/50"
              }`}
            >
              <BuildingOfficeIcon className="h-4 w-4" strokeWidth={2} />
              <span>For Companies</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("talent");
                trackClick("tab_switch_talent");
              }}
              className={`relative flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                activeTab === "talent"
                  ? "bg-accent text-white shadow-md"
                  : "text-foreground hover:bg-muted/50"
              }`}
            >
              <BriefcaseIcon className="h-4 w-4" strokeWidth={2} />
              <span>For Talent</span>
            </button>
          </div>
        </div>
      </Section>

      {/* COMPANIES CONTENT */}
      {activeTab === "companies" && (
        <div className="animate-fadeIn">
          {/* Why RareRoles - Text + Image */}
          <Section>
            <div className="grid gap-12 lg:gap-16 lg:grid-cols-2 lg:items-center">
              <div>
                <Eyebrow>Why RareRoles</Eyebrow>
                <h2 className="text-display mt-6 text-4xl text-foreground md:text-5xl">
                  Why RareRoles
                </h2>
                <div className="mt-8 space-y-6">
                  {companyGains.map((g) => (
                    <div key={g.t} className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                        <svg
                          className="h-5 w-5 text-accent"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{g.t}</h3>
                        <p className="mt-1 text-base text-ink-muted">{g.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src={bperson1}
                    alt="Team collaboration"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 to-transparent" />
                </div>
                <div className="absolute -bottom-6 -right-6 -z-10 h-48 w-48 rounded-full bg-accent/5 blur-3xl" />
              </div>
            </div>
          </Section>

          {/* What You Get - 4 Benefit Cards */}
          <Section className="bg-muted/30 border-y border-border">
            <div className="max-w-2xl mx-auto mb-12 text-center">
              <Eyebrow className="flex justify-center">What you get</Eyebrow>
              <h2 className="text-display mt-6 text-4xl text-foreground md:text-5xl">
                What you get
              </h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  img: bperson1,
                  title: "Pre-Vetted Talent",
                  desc: "Access candidates who've already passed technical screening",
                },
                {
                  img: bperson2,
                  title: "Faster Hiring",
                  desc: "Fill roles in weeks, not months, with our curated pipeline",
                },
                {
                  img: bperson3,
                  title: "Reduced Risk",
                  desc: "Thorough vetting means better quality hires from day one",
                },
                {
                  img: bperson4,
                  title: "Ongoing Support",
                  desc: "Partnership that extends beyond the initial hire",
                },
              ].map((b, index) => (
                <div key={b.title} className="group relative">
                  <div className="overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="relative h-64">
                      <img
                        src={b.img}
                        alt={b.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="mb-2 inline-flex items-center justify-center rounded-full bg-accent/20 backdrop-blur-sm border border-accent/30 px-3 py-1">
                          <span className="text-xs font-bold text-white">0{index + 1}</span>
                        </div>
                        <h3
                          className="text-xl font-bold text-white mb-2"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          {b.title}
                        </h3>
                        <p className="text-sm text-white/90 leading-relaxed">{b.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Our Services - Horizontal Cards */}
          <Section>
            <div className="max-w-2xl mb-12">
              <Eyebrow>Our services</Eyebrow>
              <h2 className="text-display mt-6 text-4xl text-foreground md:text-5xl">
                What you get
              </h2>
            </div>

            <div className="space-y-8">
              {companyServices.map((s, index) => {
                const serviceImages = [stepBriefImg, stepShortlistImg, stepHireImg, teamMeetingImg];
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

                          <p className="mt-4 text-sm leading-relaxed text-ink-muted">{s.body}</p>

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
                              className="group/btn inline-flex items-center gap-2 font-semibold text-accent transition-all hover:gap-3"
                            >
                              {s.cta}
                              <svg
                                className="h-4 w-4 transition-transform"
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
          </Section>

          {/* Business Model CTA - Full Width */}
          <div className="relative overflow-hidden w-full">
            <div className="absolute inset-0">
              <img
                src={teamMeetingImg}
                alt="Business discussion"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-900/92" />
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-900/88 to-accent/15" />
            </div>

            <div className="relative z-10 py-16 md:py-20 px-6 md:px-8">
              <div className="mx-auto max-w-3xl text-center">
                <div className="flex items-center justify-center mb-4">
                  <BuildingOfficeIcon
                    className="h-10 w-10 text-accent drop-shadow-[0_0_20px_rgba(233,30,99,0.5)] md:h-12 md:w-12"
                    strokeWidth={1.5}
                  />
                </div>

                <h2 className="text-display text-3xl font-bold text-white md:text-4xl lg:text-5xl drop-shadow-xl">
                  Let's discuss your business model
                </h2>

                <p className="mt-4 text-base text-white/90 md:text-lg drop-shadow-md">
                  Book a consultation to explore how we can support your hiring needs
                </p>

                <div className="mt-8">
                  <button
                    type="button"
                    onClick={() => {
                      trackClick("business_model_cta");
                      openGetStarted("hiring");
                    }}
                    className="group inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-base font-bold text-white shadow-xl shadow-accent/25 transition-all duration-300 hover:scale-105 hover:shadow-accent/40"
                  >
                    Book Consultation
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
      )}

      {/* TALENT CONTENT */}
      {activeTab === "talent" && (
        <div className="animate-fadeIn">
          {/* Why Join Us */}
          <Section>
            <div className="grid gap-12 lg:gap-16 lg:grid-cols-2 lg:items-center">
              <div>
                <Eyebrow>Why join us</Eyebrow>
                <h2 className="text-display mt-6 text-4xl text-foreground md:text-5xl">
                  Why join us
                </h2>
                <div className="mt-8 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                      <svg
                        className="h-5 w-5 text-accent"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-lg text-foreground leading-relaxed">
                      We connect you to high-value and specialized roles.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                      <svg
                        className="h-5 w-5 text-accent"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 to-transparent" />
                </div>
                <div className="absolute -bottom-6 -right-6 -z-10 h-48 w-48 rounded-full bg-accent/5 blur-3xl" />
              </div>
            </div>
          </Section>

          {/* What You Get - 3 Benefits */}
          <section className="bg-ink py-24 text-primary-foreground md:py-32">
            <div className="container-page">
              <div className="max-w-2xl">
                <Eyebrow>What you get</Eyebrow>
                <h2 className="text-display mt-6 text-4xl md:text-5xl">What you get</h2>
              </div>
              <div className="mt-14 grid gap-6 sm:grid-cols-3">
                {talentBenefits.map((b, index) => (
                  <div
                    key={b.title}
                    className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-accent/40"
                  >
                    <div className="absolute -right-4 -top-4 font-display text-[120px] font-bold leading-none text-slate-100 opacity-50">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="relative">
                      <b.icon
                        className="h-12 w-12 text-accent drop-shadow-[0_2px_8px_rgba(233,30,99,0.25)]"
                        strokeWidth={1.5}
                      />
                    </div>

                    <h3
                      className="relative mt-6 text-lg font-bold leading-tight text-slate-900"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {b.title}
                    </h3>

                    <div className="mt-3 h-px w-12 bg-gradient-to-r from-accent to-transparent opacity-40" />

                    <p className="relative mt-4 text-sm leading-relaxed text-slate-600">
                      {b.description}
                    </p>

                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/0 via-accent/0 to-accent/0 transition-all duration-500 group-hover:from-accent/60 group-hover:via-accent group-hover:to-accent/60" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Join Network CTA - Full Width */}
          <div className="relative overflow-hidden w-full">
            <div className="absolute inset-0">
              <img
                src={enterpriseArchitectureImg}
                alt="Career opportunities"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-900/92" />
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-900/88 to-accent/15" />
            </div>

            <div className="relative z-10 py-16 md:py-20 px-6 md:px-8">
              <div className="mx-auto max-w-3xl text-center">
                <div className="flex items-center justify-center mb-4">
                  <BriefcaseIcon
                    className="h-10 w-10 text-accent drop-shadow-[0_0_20px_rgba(233,30,99,0.5)] md:h-12 md:w-12"
                    strokeWidth={1.5}
                  />
                </div>

                <h2 className="text-display text-3xl font-bold text-white md:text-4xl lg:text-5xl drop-shadow-xl">
                  Join our talent network
                </h2>

                <p className="mt-4 text-base text-white/90 md:text-lg drop-shadow-md">
                  Sign up and let us match you with exclusive opportunities at top companies
                </p>

                <div className="mt-8">
                  <button
                    type="button"
                    onClick={() => {
                      trackClick("join_network_cta");
                      openGetStarted("talent");
                    }}
                    className="group inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-base font-bold text-white shadow-xl shadow-accent/25 transition-all duration-300 hover:scale-105 hover:shadow-accent/40"
                  >
                    Join Now
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
      )}
    </>
  );
}
