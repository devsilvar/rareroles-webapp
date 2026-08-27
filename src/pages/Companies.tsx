import { useEffect, useState } from "react";
import {
  CheckIcon,
  UsersIcon,
  UserPlusIcon,
  BriefcaseIcon,
  LightBulbIcon,
  AcademicCapIcon,
  BoltIcon,
  ArrowUpRightIcon,
} from "@heroicons/react/24/outline";
import { Section, Eyebrow } from "../components/ui-bits";
import { useGetStarted } from "../components/get-started-modal";
import { ResponsiveImage } from "../components/responsive-image";
import { ScriptSlot } from "../components/ScriptSlot";
import { SEO, structuredDataSchemas } from "../components/SEO";
import { frontierRoles } from "../constants/roles";
import herooImg from "../assets/heroo.jpg";
import herooWebp from "../assets/heroo.webp";
import oraclePlsqlImg from "../assets/Oracle PLSQL Developers.jfif";
import networkEngineerImg from "../assets/networkengineer.jfif";
import aixAdminImg from "../assets/AIX System Administrators.jfif";
import sharepointImg from "../assets/sharepoint.jfif";
import aiMlEngineersImg from "../assets/AI  Machine Learning Engineers.jfif";
import aiAutomationImg from "../assets/AI Automation Engineers.jfif";
import solutionArchitectImg from "../assets/solutionArchitect.jfif";
import aiOperatorsImg from "../assets/AI Operators.jfif";
import aiEnabledSoftwareImg from "../assets/aienabledsoftwareengineer.jfif";
import stepBriefImg from "../assets/step-brief.jpg";
import stepShortlistImg from "../assets/step-shortlist.jpg";
import stepHireImg from "../assets/step-hire.jpg";
import teamMeetingImg from "../assets/team-meeting.jpg";
import enterpriseArchitectureImg from "../assets/enterprise-architecture.jpg";
import blackpepImg from "../assets/blackpep.jpeg";
import shakeeImg from "../assets/shakeee.webp";
import telecomImg from "../assets/telecom.jpg";
import telecomWebp from "../assets/telecom.webp";
import fintechImg from "../assets/fintech.jpg";
import fintechWebp from "../assets/fintech.webp";

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
    tag: "Outsourcing",
    title: "Talent Outsourcing",
    icon: BriefcaseIcon,
    body: "We manage your hiring process end-to-end, acting as an extension of your internal team. From sourcing and screening to shortlisting and coordination, we streamline your recruitment operations so you can focus on growing your business.",
    description:
      "We manage your hiring process end-to-end, acting as an extension of your internal team. From sourcing and screening to shortlisting and coordination, we streamline your recruitment operations so you can focus on growing your business. Using intelligent workflows and structured evaluation methods, we ensure faster turnaround times and consistent candidate quality.",
    bestFor: "Companies looking to scale hiring without building an in-house recruitment team",
    cta: "Book Consultation",
  },
  {
    tag: "Contract",
    title: "Contract Placements",
    icon: UserPlusIcon,
    body: "Access skilled professionals on a flexible, short-term or project basis. We connect you with pre-vetted contract talent who can step in quickly and deliver immediate value.",
    description:
      "Access skilled professionals on a flexible, short-term or project basis. We connect you with pre-vetted contract talent who can step in quickly and deliver immediate value — whether for urgent projects, temporary roles, or specialized expertise. Our screening approach ensures you get candidates who are ready to perform from day one.",
    bestFor: "Startups, fast-moving teams, and project-based work",
    cta: "Book Consultation",
  },
  {
    tag: "Permanent",
    title: "Permanent Hiring",
    icon: UsersIcon,
    body: "We help you secure long-term talent that aligns with both your technical needs and company culture. Find candidates positioned to grow with your organization.",
    description:
      "We help you secure long-term talent that aligns with both your technical needs and company culture. Through a combination of targeted sourcing and structured screening, we identify candidates who are not only qualified but also positioned to grow with your organization.",
    bestFor: "Building strong, stable teams for long-term success",
    cta: "Book Consultation",
  },
  {
    tag: "Executive",
    title: "C-Suite & Executive Search",
    icon: LightBulbIcon,
    body: "We support organizations in hiring senior leadership and executive-level talent with discretion, precision, and deep evaluation.",
    description:
      "We support organizations in hiring senior leadership and executive-level talent. Our approach focuses on discretion, precision, and deep evaluation — ensuring you find leaders who can drive strategy, growth, and impact. Every candidate is carefully assessed for leadership capability, experience, and organizational fit.",
    bestFor: "Companies hiring senior executives, directors, and leadership roles",
    cta: "Schedule Call",
  },
  {
    tag: "Internships",
    title: "Internship Programs",
    icon: AcademicCapIcon,
    body: "Build a pipeline of emerging talent through structured internship placements and early career development.",
    description:
      "We help you build a pipeline of emerging talent through structured internship placements. We source and match high-potential interns who are eager to learn and contribute, giving your organization access to future talent while supporting early career development.",
    bestFor: "Companies looking to nurture junior talent and build long-term pipelines",
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
  const { open: openGetStarted } = useGetStarted();
  const [selectedService, setSelectedService] = useState<(typeof services)[0] | null>(null);

  useEffect(() => {
    document.title = "Our Services — Specialized Talent Solutions | RareRoles";
  }, []);

  const scrollToRoles = () => {
    const rolesSection = document.getElementById("roles-we-specialize");
    if (rolesSection) {
      rolesSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      structuredDataSchemas.organization,
      structuredDataSchemas.service,
      {
        "@type": "WebPage",
        "@id": "https://rarerolestechnologies.com/companies#webpage",
        url: "https://rarerolestechnologies.com/companies",
        name: "Enterprise Technical Recruitment Services for Companies",
        description:
          "Specialized technical recruitment services including talent outsourcing, contract placements, permanent hiring, and executive search. Access pre-vetted enterprise technology talent with faster time-to-hire and reduced hiring risk.",
        isPartOf: {
          "@id": "https://rarerolestechnologies.com/#website",
        },
      },
      structuredDataSchemas.breadcrumbList([
        { name: "Home", url: "https://rarerolestechnologies.com/" },
        { name: "For Companies", url: "https://rarerolestechnologies.com/companies" },
      ]),
    ],
  };

  return (
    <>
      <SEO
        title="Enterprise Technical Recruitment Services for Companies"
        description="Specialized technical recruitment services including talent outsourcing, contract placements, permanent hiring, and executive search. Access pre-vetted enterprise technology talent with faster time-to-hire and reduced hiring risk."
        keywords="technical recruitment services, talent outsourcing, contract placements, permanent hiring, executive search, C-suite recruitment, enterprise hiring, tech talent acquisition, recruitment process outsourcing, RPO services, fintech recruitment, banking tech recruitment, telecom recruitment"
        structuredData={structuredData}
        canonical="https://rarerolestechnologies.com/companies"
      />
      {/* HERO with background image */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
        {/* Background Image */}
        <div className="absolute inset-0">
          <ResponsiveImage
            webpSrc={herooWebp}
            fallbackSrc={herooImg}
            alt="Black professionals in tech and business"
            priority={true}
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
            <Eyebrow className="[&>span]:text-white/90 [&>div]:to-white/60">Our services</Eyebrow>
            <h1 className="text-display mt-4 sm:mt-6 text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-[88px] text-white drop-shadow-2xl">
              Specialized Talent Solutions
            </h1>
            <p className="mt-4 sm:mt-8 max-w-2xl text-base sm:text-lg md:text-xl text-white/90 drop-shadow-lg">
              From contract placements to executive search — flexible hiring solutions for every
              need
            </p>
            <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => openGetStarted()}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-display text-sm font-bold tracking-tight text-accent-foreground shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:bg-accent/90 hover:shadow-xl"
              >
                Get Started
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>
              <button
                onClick={scrollToRoles}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/30 px-6 py-3 text-sm sm:text-base font-bold text-white shadow-lg transition-all duration-300 hover:bg-white/20 hover:border-white/50 hover:scale-105"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                See Our Roles
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* OUR SERVICES — PREMIUM MODAL CARDS WITH BRAND COLORS */}
      <Section className="border-t border-border">
        {/* Header - centered */}
        <div className="mx-auto max-w-3xl mb-12 sm:mb-16">
          <div className="flex flex-col items-center text-center">
            <Eyebrow>Our services</Eyebrow>
            <h2 className="text-display mt-4 sm:mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground">
              Five ways to work with us.
            </h2>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-ink-muted md:text-xl max-w-2xl">
              Click any card to learn more about our flexible hiring solutions.
            </p>
          </div>
        </div>

        {/* Premium Card Grid - 5 cards (3 top row, 2 centered bottom row) */}
        <div className="mx-auto max-w-7xl">
          {/* First Row - 3 cards */}
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6 sm:mb-8">
            {services.slice(0, 3).map((s, index) => (
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
            {services.slice(3, 5).map((s) => (
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
        <div className="mt-12 text-center">
          <p className="text-sm text-ink-muted">
            💡 <span className="font-medium">Tap any service card</span> to get started and discuss
            your specific hiring needs
          </p>
        </div>
      </Section>

      {/* ROLES WE SPECIALIZE IN */}
      <Section id="roles-we-specialize" className="relative overflow-hidden bg-slate-100">
        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgb(0 0 0) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Header - centered */}
        <div className="relative mx-auto max-w-4xl">
          <div className="flex flex-col items-center text-center">
            <Eyebrow>Specialized Talent</Eyebrow>
            <h2 className="text-display mt-6 text-4xl text-foreground md:text-5xl lg:text-6xl">
              Roles we specialize in
            </h2>
          </div>
        </div>

        {/* Role cards - Professional image-focused design */}
        <div className="relative mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {frontierRoles.map((r, index) => {
            // Professional images of Black professionals in tech roles - mapped to specific roles
            const roleImages = [
              oraclePlsqlImg, // Oracle PL/SQL Developers
              networkEngineerImg, // CCIE Network Engineers
              aixAdminImg, // AIX System Administrators
              sharepointImg, // SharePoint Engineers
              aiMlEngineersImg, // AI / Machine Learning Engineers
              aiAutomationImg, // AI Automation Engineers
              solutionArchitectImg, // Solution Architects
              aiOperatorsImg, // AI Operators
              aiEnabledSoftwareImg, // AI-Enabled Software Engineers
            ];

            return (
              <article
                key={r.title}
                className="group relative flex flex-col overflow-hidden rounded-xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
              >
                {/* Professional Background Image - Responsive height */}
                <div className="relative h-[280px] sm:h-[350px] md:h-[420px] overflow-hidden">
                  <img
                    src={roleImages[index]}
                    alt={`${r.title} professional`}
                    className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Elegant gradient overlay - allows face to show, darkens bottom for text */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/40 to-slate-900/95" />

                  {/* Subtle accent glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-purple-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Vetted badge - top right, clean design */}
                  <div className="absolute right-3 sm:right-4 top-3 sm:top-4 flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-sm px-2.5 sm:px-3 py-1 sm:py-1.5 shadow-lg">
                    <div className="h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-900">
                      Vetted
                    </span>
                  </div>

                  {/* Number badge - top left, elegant */}
                  <div className="absolute left-3 sm:left-4 top-3 sm:top-4 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-slate-900/80 backdrop-blur-sm border border-white/20 shadow-lg">
                    <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-white">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                {/* Content area - Clean, spacious */}
                <div className="relative flex flex-col bg-white p-4">
                  {/* Role title - prominent */}
                  <h3
                    className="text-base sm:text-lg font-bold leading-tight tracking-tight text-slate-900 mb-3"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {r.title}
                  </h3>

                  {/* CTA Button - Premium gradient */}
                  <button
                    type="button"
                    onClick={() => openGetStarted("hiring", r.title)}
                    className="group/btn relative overflow-hidden rounded-full bg-gradient-to-r from-accent via-pink-500 to-accent px-4 py-2.5 text-center text-xs sm:text-sm font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-accent/30 active:scale-[0.98] animate-gradient-slow"
                    style={{ backgroundSize: "200% 200%" }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <span>Hire This Role</span>
                      <ArrowUpRightIcon className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </span>
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      {/* INDUSTRIES - Matching "What You Get" Style with Image Cards */}
      <Section className="bg-muted/30 border-y border-border">
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <Eyebrow className="flex justify-center">Industries we serve</Eyebrow>
          <h2 className="text-display mt-4 sm:mt-6 text-3xl sm:text-4xl md:text-5xl text-foreground">
            Regulated, technical, and complex.
          </h2>
          <p className="mt-4 sm:mt-6 text-sm sm:text-base text-ink-muted">
            We work best inside industries where the wrong hire is expensive and the right one moves
            the roadmap.
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { img: blackpepImg, webp: blackpepImg, name: "Banking", n: "01" },
            { img: fintechImg, webp: fintechWebp, name: "Fintech", n: "02" },
            { img: shakeeImg, webp: shakeeImg, name: "Consulting (Big 4)", n: "03" },
            { img: telecomImg, webp: telecomWebp, name: "Telecom", n: "04" },
            {
              img: enterpriseArchitectureImg,
              webp: enterpriseArchitectureImg,
              name: "Enterprise Tech",
              n: "05",
            },
          ].map((i) => (
            <div key={i.name} className="group relative">
              <div className="overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="relative h-56 sm:h-64">
                  <ResponsiveImage
                    webpSrc={i.webp}
                    fallbackSrc={i.img}
                    alt={i.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                    <div className="mb-2 inline-flex items-center justify-center rounded-full bg-accent/20 backdrop-blur-sm border border-accent/30 px-2.5 sm:px-3 py-0.5 sm:py-1">
                      <span className="text-xs font-bold text-white">{i.n}</span>
                    </div>
                    <h3
                      className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {i.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                      Expert talent placement in this sector
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Service Detail Modal */}
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

            {/* Modal Header - Dark brand blue */}
            <div className="relative overflow-hidden bg-gradient-to-br from-ink via-primary to-accent p-5 sm:p-6 rounded-t-2xl">
              {/* Animated orbs */}
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

            {/* Modal Body */}
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
                  className="text-xs sm:text-[13px] leading-relaxed text-slate-600"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {selectedService.description}
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
      <ScriptSlot id="companies-cta-after" />
    </>
  );
}
