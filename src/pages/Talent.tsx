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
  ArrowUpRightIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import { Section, Eyebrow, CTAButton } from "../components/ui-bits";
import { useGetStarted } from "../components/get-started-modal";
import { ScriptSlot } from "../components/ScriptSlot";
import { SEO, structuredDataSchemas } from "../components/SEO";
import stepBriefImg from "../assets/step-brief.jpg";
import stepShortlistImg from "../assets/step-shortlist.jpg";
import stepHireImg from "../assets/step-hire.jpg";
import joinusImg from "../assets/joinus.jpg";
import enterpriseArchitectureImg from "../assets/enterprise-architecture.jpg";
import blackpepImg from "../assets/blackpep.jpeg";
import herooImg from "../assets/heroo.jpg";
import bperson2Img from "../assets/bperson (2).jpg";
import bperson3Img from "../assets/bperson (3).jpg";
import bperson4Img from "../assets/bperson (4).jpg";
import semberImg from "../../public/sember adeeka.jpg";
import shakeeImg from "../assets/shakeee.webp";

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
    tag: "Outsourcing",
    title: "Talent Outsourcing",
    icon: BriefcaseIcon,
    body: "We manage your hiring process end-to-end, acting as an extension of your internal team. From sourcing and screening to shortlisting and coordination, we streamline your recruitment operations so you can focus on growing your business. Using intelligent workflows and structured evaluation methods, we ensure faster turnaround times and consistent candidate quality.",
    bestFor: "Companies looking to scale hiring without building an in-house recruitment team",
    cta: "Book Consultation",
  },
  {
    tag: "Contract",
    title: "Contract Placements",
    icon: UserPlusIcon,
    body: "Access skilled professionals on a flexible, short-term or project basis. We connect you with pre-vetted contract talent who can step in quickly and deliver immediate value — whether for urgent projects, temporary roles, or specialized expertise. Our screening approach ensures you get candidates who are ready to perform from day one.",
    bestFor: "Startups, fast-moving teams, and project-based work",
    cta: "Book Consultation",
  },
  {
    tag: "Permanent",
    title: "Permanent Hiring",
    icon: UsersIcon,
    body: "We help you secure long-term talent that aligns with both your technical needs and company culture. Through a combination of targeted sourcing and structured screening, we identify candidates who are not only qualified but also positioned to grow with your organization.",
    bestFor: "Building strong, stable teams for long-term success",
    cta: "Book Consultation",
  },
  {
    tag: "Executive",
    title: "C-Suite & Executive Search",
    icon: LightBulbIcon,
    body: "We support organizations in hiring senior leadership and executive-level talent. Our approach focuses on discretion, precision, and deep evaluation — ensuring you find leaders who can drive strategy, growth, and impact. Every candidate is carefully assessed for leadership capability, experience, and organizational fit.",
    bestFor: "Companies hiring senior executives, directors, and leadership roles",
    cta: "Schedule Call",
  },
  {
    tag: "Internships",
    title: "Internship Programs",
    icon: AcademicCapIcon,
    body: "We help you build a pipeline of emerging talent through structured internship placements. We source and match high-potential interns who are eager to learn and contribute, giving your organization access to future talent while supporting early career development.",
    bestFor: "Companies looking to nurture junior talent and build long-term pipelines",
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
  const [activeTab, setActiveTab] = useState<TabType>("companies");
  const [selectedService, setSelectedService] = useState<(typeof companyServices)[0] | null>(null);

  useEffect(() => {
    document.title = "Why Choose Us — For Companies & Talent | RareRoles";
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      structuredDataSchemas.organization,
      {
        "@type": "WebPage",
        "@id": "https://rarerolestechnologies.com/talent#webpage",
        url: "https://rarerolestechnologies.com/talent",
        name: "Join RareRoles - Enterprise Technology Career Opportunities",
        description:
          "Access exclusive enterprise technology career opportunities. Join our curated talent network for AI engineering, Oracle PL/SQL, CCIE network engineering, AIX administration, SharePoint, and solution architecture roles. Higher compensation, better opportunities.",
        isPartOf: {
          "@id": "https://rarerolestechnologies.com/#website",
        },
      },
      structuredDataSchemas.breadcrumbList([
        { name: "Home", url: "https://rarerolestechnologies.com/" },
        { name: "For Talent", url: "https://rarerolestechnologies.com/talent" },
      ]),
      {
        "@type": "ItemList",
        name: "Benefits for Technology Professionals",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Access to exclusive enterprise opportunities",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Higher compensation packages",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Career guidance and support",
          },
          {
            "@type": "ListItem",
            position: 4,
            name: "Direct access to hiring managers",
          },
        ],
      },
    ],
  };

  return (
    <>
      <SEO
        title="Join RareRoles - Enterprise Technology Career Opportunities"
        description="Access exclusive enterprise technology career opportunities. Join our curated talent network for AI engineering, Oracle PL/SQL, CCIE network engineering, AIX administration, SharePoint, and solution architecture roles. Higher compensation, better opportunities."
        keywords="technology careers, AI engineer jobs, Oracle PL/SQL jobs, CCIE network engineer jobs, AIX administrator jobs, SharePoint specialist jobs, solution architect jobs, enterprise technology careers, tech job opportunities, specialized tech recruitment, contract tech roles, permanent tech positions"
        structuredData={structuredData}
        canonical="https://rarerolestechnologies.com/talent"
      />
      {/* HERO - Clean & Professional */}
      <section className="relative overflow-hidden pt-20 pb-12 sm:pb-16 md:pt-32 md:pb-24">
        <div className="absolute inset-0">
          <img
            src={herooImg}
            alt="Black professionals in team collaboration"
            className="h-full w-full object-cover"
          />
          {/* Layered overlays - Dark purple brand tint like homepage */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a0b2e]/70 via-[#2d1b4e]/60 to-[#4a1d6f]/50" />
          {/* Subtle dot texture for depth */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <div className="container-page relative z-10">
          <div className="max-w-4xl">
            <Eyebrow>Why Choose Us</Eyebrow>
            <h1 className="text-display mt-4 sm:mt-6 text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-[88px] text-white">
              Why Choose RareRoles
            </h1>
            <p className="mt-4 sm:mt-8 max-w-2xl text-base sm:text-lg md:text-xl text-white/90">
              Whether you're hiring or looking for opportunities, we connect the right people with
              the right roles.
            </p>
          </div>
        </div>
      </section>

      {/* TAB SWITCHER - Premium Design */}
      <Section className="py-8 sm:py-12 md:py-16">
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1.5 sm:gap-3 rounded-full bg-muted p-1 sm:p-1.5 shadow-sm max-w-full">
            <button
              type="button"
              onClick={() => {
                setActiveTab("companies");
              }}
              className={`relative flex items-center gap-1.5 sm:gap-2 rounded-full px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 ${
                activeTab === "companies"
                  ? "bg-accent text-white shadow-md"
                  : "text-foreground hover:bg-muted/50"
              }`}
            >
              <BuildingOfficeIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} />
              <span>For Companies</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("talent");
              }}
              className={`relative flex items-center gap-1.5 sm:gap-2 rounded-full px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 ${
                activeTab === "talent"
                  ? "bg-accent text-white shadow-md"
                  : "text-foreground hover:bg-muted/50"
              }`}
            >
              <BriefcaseIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} />
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
            <div className="grid gap-10 lg:gap-16 lg:grid-cols-2 lg:items-center">
              <div>
                <Eyebrow>Why RareRoles</Eyebrow>
                <h2 className="text-display mt-4 sm:mt-6 text-3xl sm:text-4xl md:text-5xl text-foreground">
                  Why RareRoles
                </h2>
                <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
                  {companyGains.map((g) => (
                    <div key={g.t} className="flex items-start gap-3 sm:gap-4">
                      <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                        <svg
                          className="h-4 w-4 sm:h-5 sm:w-5 text-accent"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-foreground">{g.t}</h3>
                        <p className="mt-1 text-sm sm:text-base text-ink-muted">{g.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative flex justify-center w-full">
                <div className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full max-w-[480px] overflow-hidden rounded-2xl shadow-2xl mx-auto">
                  <img
                    src={semberImg}
                    alt="Sember - RareRoles professional"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 to-transparent" />
                </div>
                <div className="absolute -bottom-6 -right-6 -z-10 h-48 w-48 rounded-full bg-accent/5 blur-3xl" />
              </div>
            </div>
          </Section>

          {/* What You Get - Revolutionary Floating Isometric Liquid Morphism Design */}
          <Section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-pink-50/30">
            {/* Animated background particles */}
            <div className="absolute inset-0 opacity-30">
              <div
                className="absolute top-20 left-10 h-64 w-64 rounded-full bg-accent/10 blur-3xl animate-pulse"
                style={{ animationDuration: "4s" }}
              />
              <div
                className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-purple-300/10 blur-3xl animate-pulse"
                style={{ animationDuration: "6s", animationDelay: "1s" }}
              />
              <div
                className="absolute top-1/2 left-1/3 h-72 w-72 rounded-full bg-pink-300/10 blur-3xl animate-pulse"
                style={{ animationDuration: "5s", animationDelay: "2s" }}
              />
            </div>

            <div className="relative max-w-7xl mx-auto">
              {/* Section Header - Centered with Magnetic Pull Effect */}
              <div className="max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20 text-center">
                <div className="inline-flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent via-accent to-transparent animate-shimmer" />
                  <Eyebrow className="flex justify-center">What you get</Eyebrow>
                  <div
                    className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent via-accent to-transparent animate-shimmer"
                    style={{ animationDelay: "0.5s" }}
                  />
                </div>
                <h2 className="text-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tight">
                  Your{" "}
                  <span className="relative inline-block">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-pink-600 to-purple-600 animate-gradient">
                      Competitive
                    </span>
                    <div className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-2 sm:h-3 bg-gradient-to-r from-accent/20 via-pink-500/20 to-purple-500/20 blur-sm" />
                  </span>{" "}
                  Edge
                </h2>
                <p className="mt-4 sm:mt-6 text-base sm:text-lg text-ink-muted/80 leading-relaxed max-w-2xl mx-auto">
                  Four pillars of excellence that transform how you hire rare talent
                </p>
              </div>

              {/* Revolutionary Floating Isometric Cards Grid */}
              <div className="relative">
                {/* Connection Lines - Animated SVG */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none opacity-20 hidden md:block"
                  style={{ zIndex: 0 }}
                >
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgb(233, 30, 99)" stopOpacity="0.4" />
                      <stop offset="50%" stopColor="rgb(236, 72, 153)" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="rgb(168, 85, 247)" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>
                  <line
                    x1="25%"
                    y1="50%"
                    x2="75%"
                    y2="50%"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    className="animate-dash"
                  />
                  <line
                    x1="50%"
                    y1="25%"
                    x2="50%"
                    y2="75%"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    className="animate-dash"
                    style={{ animationDelay: "0.5s" }}
                  />
                </svg>

                <div
                  className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 relative"
                  style={{ zIndex: 1 }}
                >
                  {[
                    {
                      img: bperson2Img,
                      title: "Pre-Vetted Talent",
                      desc: "Access candidates who've already passed technical screening",
                      gradient: "from-pink-500/90 via-rose-600/90 to-red-600/90",
                      glowColor: "pink",
                      rotation: "-rotate-2",
                    },
                    {
                      img: bperson3Img,
                      title: "Faster Hiring",
                      desc: "Fill roles in weeks, not months, with our curated pipeline",
                      gradient: "from-purple-500/90 via-violet-600/90 to-purple-700/90",
                      glowColor: "purple",
                      rotation: "rotate-2",
                    },
                    {
                      img: bperson4Img,
                      title: "Reduced Risk",
                      desc: "Thorough vetting means better quality hires from day one",
                      gradient: "from-blue-500/90 via-indigo-600/90 to-purple-600/90",
                      glowColor: "blue",
                      rotation: "rotate-1",
                    },
                    {
                      img: shakeeImg,
                      title: "Ongoing Support",
                      desc: "Partnership that extends beyond the initial hire",
                      gradient: "from-accent/90 via-pink-600/90 to-fuchsia-600/90",
                      glowColor: "accent",
                      rotation: "-rotate-1",
                    },
                  ].map((item, index) => (
                    <div
                      key={item.title}
                      className="group relative"
                      style={{
                        animationDelay: `${index * 150}ms`,
                      }}
                    >
                      {/* Floating Animation Wrapper - Rotation only on desktop */}
                      <div
                        className={`relative transition-all duration-700 hover:scale-[1.02] sm:${item.rotation} hover:rotate-0`}
                      >
                        {/* Glowing Orb Background - Expands on Hover */}
                        <div
                          className={`absolute -inset-4 sm:-inset-8 rounded-full bg-gradient-to-br ${item.gradient} opacity-0 blur-2xl sm:blur-3xl transition-all duration-700 group-hover:opacity-30 group-hover:-inset-8 sm:group-hover:-inset-12`}
                        />

                        {/* Main Card Container - Liquid Morphism */}
                        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl transition-all duration-700 group-hover:shadow-accent/30">
                          {/* Image Layer with Parallax Effect */}
                          <div className="relative h-72 sm:h-80 overflow-hidden">
                            <img
                              src={item.img}
                              alt={item.title}
                              className="h-full w-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-2"
                            />

                            {/* Dynamic Gradient Overlay - Shifts on Hover */}
                            <div
                              className={`absolute inset-0 bg-gradient-to-br ${item.gradient} mix-blend-multiply transition-all duration-700`}
                            />

                            {/* Liquid Glass Effect Layer */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/70 to-transparent backdrop-blur-[1px]" />

                            {/* Animated Mesh Gradient Overlay */}
                            <div className="absolute inset-0 opacity-40">
                              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent animate-shimmer-slow" />
                            </div>

                            {/* Floating Number Badge - Morphs on Hover */}
                            <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 transition-all duration-700 group-hover:scale-110 sm:group-hover:scale-125 group-hover:rotate-12">
                              <div className="relative">
                                {/* Glow ring */}
                                <div
                                  className={`absolute inset-0 rounded-full bg-${item.glowColor}-400/50 blur-xl animate-pulse`}
                                />
                                {/* Badge */}
                                <div className="relative flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-br from-white to-slate-100 shadow-2xl border-2 sm:border-4 border-white/50 backdrop-blur-xl">
                                  <span
                                    className="text-lg sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-accent via-pink-600 to-purple-600"
                                    style={{ fontFamily: "Montserrat, sans-serif" }}
                                  >
                                    {index + 1}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Content Layer - Slides Up on Hover */}
                            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 md:p-8 transition-all duration-700 group-hover:pb-10 sm:group-hover:pb-12">
                              {/* Icon/Decorative Element */}
                              <div className="mb-3 sm:mb-4 flex items-center gap-3">
                                <div className="h-1 w-8 sm:w-12 rounded-full bg-gradient-to-r from-white via-white/60 to-transparent transition-all duration-700 group-hover:w-16 sm:group-hover:w-20" />
                                <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white animate-pulse" />
                              </div>

                              {/* Title - Expands on Hover */}
                              <h3
                                className="text-xl sm:text-2xl font-black text-white mb-2 sm:mb-3 transition-all duration-700 group-hover:text-2xl sm:group-hover:text-3xl group-hover:tracking-wide"
                                style={{
                                  fontFamily: "Montserrat, sans-serif",
                                  textShadow: "0 4px 20px rgba(0,0,0,0.5)",
                                }}
                              >
                                {item.title}
                              </h3>

                              {/* Description - Fades In on Hover */}
                              <p
                                className="text-xs sm:text-sm text-white/90 leading-relaxed transition-all duration-700 opacity-90 group-hover:opacity-100 group-hover:text-sm sm:group-hover:text-base"
                                style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}
                              >
                                {item.desc}
                              </p>

                              {/* Interactive Arrow - Appears on Hover */}
                              <div className="mt-3 sm:mt-4 flex items-center gap-2 text-white font-semibold text-xs sm:text-sm opacity-0 translate-y-4 transition-all duration-700 group-hover:opacity-100 group-hover:translate-y-0">
                                <span>Explore benefit</span>
                                <svg
                                  className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-2"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={3}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                  />
                                </svg>
                              </div>
                            </div>

                            {/* Holographic Shine Effect - Moves on Hover */}
                            <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
                              <div
                                className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
                                style={{ transform: "skewX(-20deg)" }}
                              />
                            </div>
                          </div>

                          {/* Bottom Accent Bar - Expands on Hover */}
                          <div className="absolute bottom-0 left-0 right-0 h-1.5 sm:h-2 bg-gradient-to-r from-accent via-pink-500 to-purple-500 transition-all duration-700 group-hover:h-2.5 sm:group-hover:h-3" />
                        </div>

                        {/* Floating Shadow - Grows on Hover */}
                        <div className="absolute -bottom-4 sm:-bottom-6 left-1/2 -translate-x-1/2 h-3 sm:h-4 w-3/4 rounded-full bg-slate-900/20 blur-lg sm:blur-xl transition-all duration-700 group-hover:w-5/6 group-hover:bg-slate-900/30" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* OUR SERVICES — PREMIUM MODAL CARDS WITH BRAND COLORS */}
          <Section className="bg-muted/60">
            {/* Header - centered */}
            <div className="mx-auto max-w-3xl mb-12 sm:mb-16">
              <div className="flex flex-col items-center text-center">
                <Eyebrow className="justify-center">Our services</Eyebrow>
                <h2 className="text-display mt-4 sm:mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground">
                  What you get
                </h2>
                <p className="mt-4 sm:mt-6 text-base sm:text-lg text-ink-muted md:text-xl max-w-2xl">
                  Five flexible engagement models, one accountable partner. Every service is built to reduce friction, speed up delivery, and de-risk the seats that carry your roadmap.
                </p>
              </div>
            </div>

            {/* Premium Card Grid - 5 cards (3 top row, 2 centered bottom row) */}
            <div className="mx-auto max-w-7xl">
              {/* First Row - 3 cards */}
              <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6 sm:mb-8">
                {companyServices.slice(0, 3).map((s, index) => (
                  <button
                    key={s.title}
                    type="button"
                    onClick={() => {
                      setSelectedService(s);
                    }}
                    className="group relative text-left w-full"
                  >
                    {/* Inner dark card */}
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 sm:p-6 md:p-8 min-h-[280px] sm:min-h-[340px] md:min-h-[380px] flex flex-col">
                      {/* Animated gradient orbs - Brand Pink Only */}
                      <div className="absolute -left-12 -top-12 h-32 w-32 bg-gradient-to-br from-accent/40 via-pink-500/30 to-transparent rounded-full blur-2xl animate-pulse" />
                      <div
                        className="absolute -right-16 -bottom-16 h-40 w-40 bg-gradient-to-br from-pink-500/30 via-accent/20 to-transparent rounded-full blur-3xl animate-pulse"
                        style={{ animationDelay: "1s" }}
                      />

                      {/* Floating particles effect - Pink variations */}
                      <div className="absolute inset-0 opacity-20">
                        <div
                          className="absolute top-1/4 left-1/4 h-2 w-2 bg-accent rounded-full animate-ping"
                          style={{ animationDelay: "0.5s" }}
                        />
                        <div
                          className="absolute top-3/4 right-1/4 h-1.5 w-1.5 bg-pink-400 rounded-full animate-ping"
                          style={{ animationDelay: "1.5s" }}
                        />
                        <div
                          className="absolute top-1/2 right-1/3 h-1 w-1 bg-pink-500 rounded-full animate-ping"
                          style={{ animationDelay: "2s" }}
                        />
                      </div>

                      {/* Badge with checkmark - top center */}
                      <div className="relative flex justify-center mb-4 sm:mb-6">
                        <div className="flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gradient-to-br from-white to-pink-100 shadow-xl shadow-accent/30">
                          <svg
                            className="h-5 w-5 sm:h-7 sm:w-7 text-accent"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>

                      {/* Service Title */}
                      <div className="relative flex-1 flex flex-col justify-center text-center">
                        <h3
                          className="text-xl sm:text-2xl md:text-3xl font-black uppercase leading-tight tracking-tight text-white"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          {s.title}
                        </h3>
                      </div>

                      {/* Click indicator */}
                      <div className="relative flex justify-center items-center gap-2 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-white/10">
                        <span className="text-[11px] sm:text-xs font-semibold text-white/70 uppercase tracking-wider">
                          Click to learn more
                        </span>
                        <svg
                          className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/70 transition-transform group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </div>

                      {/* Hover shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-t from-accent/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-xl" />
                      <div className="absolute inset-0 rounded-xl ring-2 ring-accent/0 group-hover:ring-accent/50 transition-all duration-500" />
                    </div>
                  </button>
                ))}
              </div>

              {/* Second Row - 2 cards centered */}
              <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto">
                {companyServices.slice(3, 5).map((s) => (
                  <button
                    key={s.title}
                    type="button"
                    onClick={() => {
                      setSelectedService(s);
                    }}
                    className="group relative text-left w-full"
                  >
                    {/* Inner dark card - same as first row */}
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 sm:p-6 md:p-8 min-h-[280px] sm:min-h-[340px] md:min-h-[380px] flex flex-col">
                      {/* Animated gradient orbs - Brand Pink Only */}
                      <div className="absolute -left-12 -top-12 h-32 w-32 bg-gradient-to-br from-accent/40 via-pink-500/30 to-transparent rounded-full blur-2xl animate-pulse" />
                      <div
                        className="absolute -right-16 -bottom-16 h-40 w-40 bg-gradient-to-br from-pink-500/30 via-accent/20 to-transparent rounded-full blur-3xl animate-pulse"
                        style={{ animationDelay: "1s" }}
                      />

                      {/* Floating particles effect - Pink variations */}
                      <div className="absolute inset-0 opacity-20">
                        <div
                          className="absolute top-1/4 left-1/4 h-2 w-2 bg-accent rounded-full animate-ping"
                          style={{ animationDelay: "0.5s" }}
                        />
                        <div
                          className="absolute top-3/4 right-1/4 h-1.5 w-1.5 bg-pink-400 rounded-full animate-ping"
                          style={{ animationDelay: "1.5s" }}
                        />
                        <div
                          className="absolute top-1/2 right-1/3 h-1 w-1 bg-pink-500 rounded-full animate-ping"
                          style={{ animationDelay: "2s" }}
                        />
                      </div>

                      {/* Badge with checkmark - top center */}
                      <div className="relative flex justify-center mb-4 sm:mb-6">
                        <div className="flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gradient-to-br from-white to-pink-100 shadow-xl shadow-accent/30">
                          <svg
                            className="h-5 w-5 sm:h-7 sm:w-7 text-accent"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>

                      {/* Service Title */}
                      <div className="relative flex-1 flex flex-col justify-center text-center">
                        <h3
                          className="text-xl sm:text-2xl md:text-3xl font-black uppercase leading-tight tracking-tight text-white"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          {s.title}
                        </h3>
                      </div>

                      {/* Click indicator */}
                      <div className="relative flex justify-center items-center gap-2 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-white/10">
                        <span className="text-[11px] sm:text-xs font-semibold text-white/70 uppercase tracking-wider">
                          Click to learn more
                        </span>
                        <svg
                          className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/70 transition-transform group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </div>

                      {/* Hover shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-t from-accent/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-xl" />
                      <div className="absolute inset-0 rounded-xl ring-2 ring-accent/0 group-hover:ring-accent/50 transition-all duration-500" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Info note */}
            <div className="mt-8 sm:mt-12 text-center px-4">
              <p className="text-xs sm:text-sm text-ink-muted">
                💡 <span className="font-medium">Tap any service card</span> to get started and discuss
                your specific hiring needs
              </p>
            </div>
          </Section>

          {/* Business Model CTA - Full Width */}
          <div className="relative overflow-hidden w-full">
            <div className="absolute inset-0">
              <img
                src={blackpepImg}
                alt="Black professionals in business discussion"
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
                    src={joinusImg}
                    alt="Professionals joining the RareRoles talent community"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 to-transparent" />
                </div>
                <div className="absolute -bottom-6 -right-6 -z-10 h-48 w-48 rounded-full bg-accent/5 blur-3xl" />
              </div>
            </div>
          </Section>

          {/* What You Get - 3 Benefits */}
          <section className="bg-ink py-16 sm:py-20 md:py-24 lg:py-32 text-primary-foreground">
            <div className="container-page">
              <div className="max-w-2xl">
                <Eyebrow>What you get</Eyebrow>
                <h2 className="text-display mt-4 sm:mt-6 text-3xl sm:text-4xl md:text-5xl">What you get</h2>
              </div>
              <div className="mt-10 sm:mt-14 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {talentBenefits.map((b, index) => (
                  <div
                    key={b.title}
                    className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-accent/40"
                  >
                    <div className="absolute -right-2 sm:-right-4 -top-2 sm:-top-4 font-display text-[80px] sm:text-[100px] md:text-[120px] font-bold leading-none text-slate-100 opacity-50 select-none pointer-events-none">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="relative">
                      <b.icon
                        className="h-10 w-10 sm:h-12 sm:w-12 text-accent drop-shadow-[0_2px_8px_rgba(233,30,99,0.25)]"
                        strokeWidth={1.5}
                      />
                    </div>

                    <h3
                      className="relative mt-5 sm:mt-6 text-base sm:text-lg font-bold leading-tight text-slate-900"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {b.title}
                    </h3>

                    <div className="mt-3 h-px w-12 bg-gradient-to-r from-accent to-transparent opacity-40" />

                    <p className="relative mt-3 sm:mt-4 text-xs sm:text-sm leading-relaxed text-slate-600">
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

            <div className="relative z-10 py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8">
              <div className="mx-auto max-w-3xl text-center">
                <div className="flex items-center justify-center mb-3 sm:mb-4">
                  <BriefcaseIcon
                    className="h-8 w-8 sm:h-10 sm:w-10 text-accent drop-shadow-[0_0_20px_rgba(233,30,99,0.5)] md:h-12 md:w-12"
                    strokeWidth={1.5}
                  />
                </div>

                <h2 className="text-display text-2xl sm:text-3xl font-bold text-white md:text-4xl lg:text-5xl drop-shadow-xl">
                  Join our talent network
                </h2>

                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-white/90 md:text-lg drop-shadow-md">
                  Sign up and let us match you with exclusive opportunities at top companies
                </p>

                <div className="mt-6 sm:mt-8">
                  <button
                    type="button"
                    onClick={() => {
                      openGetStarted("talent");
                    }}
                    className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-bold text-white shadow-xl shadow-accent/25 transition-all duration-300 hover:scale-105 hover:shadow-accent/40"
                  >
                    Join Now
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1"
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

      {/* Service Detail Modal - Clean & Minimalistic with safe mobile bounds */}
      {selectedService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-[calc(100vw-2rem)] max-w-lg mx-auto max-h-[85vh] sm:max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setSelectedService(null)}
              className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all hover:bg-slate-200 hover:scale-110"
              aria-label="Close modal"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Header - Clean brand gradient */}
            <div className="relative overflow-hidden bg-gradient-to-br from-ink via-primary to-accent p-5 sm:p-6 rounded-t-2xl">
              {/* Subtle animated orbs */}
              <div className="absolute -left-10 -top-10 h-28 w-28 rounded-full bg-white/10 blur-2xl animate-pulse" />
              <div
                className="absolute -right-10 -bottom-12 h-32 w-32 rounded-full bg-accent/20 blur-3xl animate-pulse"
                style={{ animationDelay: "1s" }}
              />

              <div className="relative">
                <div className="mb-3 sm:mb-4 pr-6">
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-white/60 mb-1">
                    RareRoles Service
                  </p>
                  <h3
                    className="text-xl sm:text-2xl font-black leading-tight text-white mb-1"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {selectedService.title}
                  </h3>
                  {/* Elegant underline accent */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="h-0.5 w-10 bg-white/40" />
                    <div className="h-1 w-1 rounded-full bg-white/60" />
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                  </div>
                </div>

                {/* Best For - Elegant Card Style */}
                <div className="relative overflow-hidden rounded-lg bg-white/10 backdrop-blur-md border border-white/20 p-2.5 sm:p-3">
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                  
                  <div className="relative">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/50">
                        Ideal For
                      </span>
                      <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
                    </div>
                    <p
                      className="text-xs sm:text-[13px] font-medium leading-snug text-white"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {selectedService.bestFor}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body - Clean & Spacious */}
            <div className="p-5 sm:p-6">
              {/* Description */}
              <div className="mb-4 sm:mb-5">
                <div className="mb-2 sm:mb-3 flex items-center gap-2">
                  <div className="h-px w-8 bg-gradient-to-r from-accent via-accent/60 to-transparent" />
                  <h4
                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Service Overview
                  </h4>
                  <div className="h-px flex-1 bg-gradient-to-r from-accent/20 to-transparent" />
                </div>
                <p
                  className="text-xs sm:text-[13px] leading-relaxed text-slate-700"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {selectedService.body}
                </p>
              </div>

              {/* CTA Button */}
              <div className="pt-3 sm:pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedService(null);
                    openGetStarted("hiring", selectedService.title);
                  }}
                  className="group w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent via-[#E91E63] to-[#C2185B] px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 hover:scale-[1.02] transition-all duration-300"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {selectedService.cta}
                  <ArrowUpRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ScriptSlot id="talent-cta-after" />
    </>
  );
}
