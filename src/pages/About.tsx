import { useEffect } from "react";
import { Section, Eyebrow, CTAButton } from "../components/ui-bits";
import { useGetStarted } from "../components/get-started-modal";
import { ResponsiveImage } from "../components/responsive-image";
import { ScriptSlot } from "../components/ScriptSlot";
import { SEO, structuredDataSchemas } from "../components/SEO";
import logoWhite from "../assets/logo-white.jpg";
import herooImg from "../assets/heroo.jpg";
import herooWebp from "../assets/heroo.webp";
import blackpepImg from "../assets/blackpep.jpeg";
import shakeeImg from "../assets/shakeee.webp";
import aboutHeroImg from "../assets/step-shortlist.jpg";
import hiringImg from "../assets/hiring.jpg";
import hiringWebp from "../assets/hiring.webp";
import missionImg from "../assets/step-brief.jpg";
import visionImg from "../assets/vision.jpg";
import visionWebp from "../assets/vision.webp";

// Add real logos here as they're shared. Set `logo` to an imported image path
// (e.g. `import acmeLogo from "../assets/logos/acme.svg"`) to swap the text placeholder.
type CompanyLogo = { name: string; logo?: string };

const companyLogos: CompanyLogo[] = [
  { name: "Acme Corp", logo: logoWhite },
  { name: "Northwind", logo: logoWhite },
  { name: "Globex", logo: logoWhite },
  { name: "Initech", logo: logoWhite },
  { name: "Umbrella", logo: logoWhite },
  { name: "Stark Industries", logo: logoWhite },
  { name: "Wayne Enterprises", logo: logoWhite },
  { name: "Soylent", logo: logoWhite },
  { name: "Tech Corp", logo: logoWhite },
  { name: "Digital Solutions", logo: logoWhite },
];

export default function About() {
  const { open: openGetStarted } = useGetStarted();

  useEffect(() => {
    document.title = "About — The talent partner for rare tech roles | RareRoles";
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      structuredDataSchemas.organization,
      {
        "@type": "AboutPage",
        "@id": "https://rareroles.com/about#webpage",
        url: "https://rareroles.com/about",
        name: "About RareRoles - Specialized Technical Recruitment Partner",
        description:
          "RareRoles is the specialized talent partner for hard-to-fill enterprise technology roles. We maintain warm talent pipelines for AI engineers, Oracle PL/SQL developers, CCIE network engineers, AIX administrators, and other niche technical specializations.",
        isPartOf: {
          "@id": "https://rareroles.com/#website",
        },
        about: {
          "@type": "Organization",
          name: "RareRoles",
        },
      },
      structuredDataSchemas.breadcrumbList([
        { name: "Home", url: "https://rareroles.com/" },
        { name: "About", url: "https://rareroles.com/about" },
      ]),
    ],
  };

  return (
    <>
      <SEO
        title="About RareRoles - Specialized Technical Recruitment Partner"
        description="RareRoles is the specialized talent partner for hard-to-fill enterprise technology roles. We maintain warm talent pipelines for AI engineers, Oracle PL/SQL developers, CCIE network engineers, AIX administrators, and other niche technical specializations."
        keywords="about rareroles, specialized recruitment, technical recruitment partner, enterprise technology recruitment, niche tech recruitment, talent pipeline, pre-vetted technical talent"
        structuredData={structuredData}
        canonical="https://rareroles.com/about"
      />
      <section className="relative overflow-hidden">
        {/* Background image — tech team working on laptops */}
        <img
          src={herooImg}
          alt="Black professionals in tech and business"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Layered overlays keep the copy readable over the photo */}
        <div className="absolute inset-0 bg-gradient-to-br from-ink/92 via-ink/80 to-brand-purple/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />

        {/* Subtle dot texture for depth */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />

        <div className="container-page relative z-10 pt-28 pb-20 md:pt-40 md:pb-28">
          <div className="max-w-4xl">
            <Eyebrow className="[&>span]:text-white/90 [&>div]:to-white/60">About</Eyebrow>
            <h1 className="text-display mt-6 text-5xl text-white md:text-7xl lg:text-[88px]">
              A talent company built for the{" "}
              <span className="italic text-white/70">rare stuff.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-white/85 md:text-xl">
              RareRoles is a talent company focused on rare and hard-to-fill tech roles. We help
              companies find the right talent, and we help professionals find better opportunities.
            </p>
          </div>
        </div>
      </section>

      <Section className="border-t border-border">
        {/* Who We Are */}
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <Eyebrow className="flex justify-center">Who we are</Eyebrow>
            <h2 className="text-display mt-6 text-4xl text-foreground md:text-5xl lg:text-6xl">
              Built for the <span className="italic text-accent">rare stuff</span>
            </h2>
            <div className="mx-auto mt-8 max-w-3xl space-y-6">
              <p className="text-lg leading-relaxed text-foreground md:text-xl">
                RareRoles is a talent company focused on rare and hard-to-fill tech roles.
              </p>
              <p className="text-lg leading-relaxed text-foreground md:text-xl">
                We help companies find the right talent, and we help professionals find better
                opportunities.
              </p>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="mt-24 space-y-6">
          {/* Mission Row - Image on Right */}
          <div className="group relative flex flex-col md:flex-row overflow-hidden bg-white transition-all duration-500 hover:shadow-2xl">
            {/* Mission Content - Left */}
            <div className="relative flex w-full md:w-1/2 flex-col justify-center px-8 py-8 md:px-10 md:py-10 lg:px-12 lg:py-12">
              {/* Minimalist decorative element */}
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent via-accent/60 to-transparent" />

              {/* Icon - Bigger and no background */}
              <div className="mb-4 flex">
                <svg
                  className="h-12 w-12 text-accent md:h-14 md:w-14"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>

              {/* Eyebrow text */}
              <div className="mb-3 flex items-center gap-2">
                <div className="h-px w-8 bg-gradient-to-r from-accent to-transparent" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  Mission
                </span>
              </div>

              <h3
                className="mb-4 text-2xl font-bold leading-tight tracking-tight text-slate-900 md:text-3xl"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Our mission
              </h3>

              <p className="max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
                To help companies hire rare talent faster and help professionals grow in specialized
                careers
              </p>
            </div>

            {/* Mission Image - Right */}
            <div className="relative w-full md:w-1/2 overflow-hidden h-[280px] md:h-[320px]">
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/5 to-white/60 md:to-white/60 hidden md:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent block md:hidden" />
              <img
                src={shakeeImg}
                alt="Professional business collaboration"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Sophisticated overlay pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(233,30,99,0.03)_50%,transparent_52%)] bg-[length:20px_20px]" />
            </div>
          </div>

          {/* Vision Row - Image on Left */}
          <div className="group relative flex flex-col md:flex-row overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 transition-all duration-500 hover:shadow-2xl">
            {/* Vision Image - Left (appears on top on mobile) */}
            <div className="relative w-full md:w-1/2 overflow-hidden h-[280px] md:h-[320px] order-first md:order-first">
              <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-slate-900/5 to-slate-900/60 md:to-slate-900/60 hidden md:block" />
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent block md:hidden" />
              <ResponsiveImage
                webpSrc={visionWebp}
                fallbackSrc={visionImg}
                alt="Tech professionals representing our vision for talent growth"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Sophisticated overlay pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(233,30,99,0.03)_50%,transparent_52%)] bg-[length:20px_20px]" />
            </div>

            {/* Vision Content - Right (appears on bottom on mobile) */}
            <div className="relative flex w-full md:w-1/2 flex-col justify-center px-8 py-8 md:px-10 md:py-10 lg:px-12 lg:py-12 order-last md:order-last">
              {/* Minimalist decorative element */}
              <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-accent via-accent/60 to-transparent" />

              {/* Icon - Bigger and no background */}
              <div className="mb-4 flex">
                <svg
                  className="h-12 w-12 text-accent md:h-14 md:w-14"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>

              {/* Eyebrow text */}
              <div className="mb-3 flex items-center gap-2">
                <div className="h-px w-8 bg-gradient-to-r from-accent to-transparent" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  Vision
                </span>
              </div>

              <h3
                className="mb-4 text-2xl font-bold leading-tight tracking-tight text-white md:text-3xl"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Our vision
              </h3>

              <p className="max-w-xl text-base leading-relaxed text-slate-300 md:text-lg">
                To become the go-to company for rare and emerging tech roles
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
        {/* Subtle background patterns */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgb(148 163 184) 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* How We Work */}
        <div className="relative z-10 mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="text-center">
            <Eyebrow className="flex justify-center">How we work</Eyebrow>
            <h2 className="text-display mt-6 text-4xl text-foreground md:text-5xl lg:text-6xl">
              Our Hiring <span className="italic text-accent">Approach</span>
            </h2>
            <div className="mx-auto mt-8 max-w-3xl">
              <p className="text-lg leading-relaxed text-slate-600 md:text-xl">
                We combine AI-powered talent analysis with expert human judgment to deliver
                exceptional hiring outcomes.
              </p>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="mt-16 md:mt-20">
            <div className="group relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-900/5 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-900/10">
              {/* Decorative gradient border */}
              <div
                className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent/20 via-primary/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ padding: "1px" }}
              >
                <div className="h-full w-full rounded-3xl bg-white" />
              </div>

              <div className="relative flex flex-col md:flex-row">
                {/* Left Side - Image */}
                <div className="relative w-full md:w-5/12 overflow-hidden">
                  <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/5 to-white/40 md:to-white/60" />

                  {/* Image with overlay */}
                  <div className="relative h-[320px] md:h-full min-h-[400px]">
                    <ResponsiveImage
                      webpSrc={hiringWebp}
                      fallbackSrc={hiringImg}
                      alt="AI-powered recruitment process with human expertise"
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Sophisticated overlay pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_48%,rgba(233,30,99,0.04)_50%,transparent_52%)] bg-[length:30px_30px]" />

                    {/* Bottom gradient fade */}
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/60 to-transparent md:from-white md:via-white/40" />
                  </div>

                  {/* Floating accent element */}
                  <div className="absolute bottom-8 left-8 flex items-center gap-3 rounded-full bg-white/95 backdrop-blur-sm px-5 py-3 shadow-lg shadow-accent/10">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent to-primary">
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-bold text-slate-900">AI + Human</span>
                  </div>
                </div>

                {/* Right Side - Content */}
                <div className="relative w-full md:w-7/12 px-8 py-10 md:px-12 md:py-14 lg:px-16 lg:py-16">
                  {/* Decorative accent line */}
                  <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent via-accent/40 to-transparent" />

                  {/* Main description */}
                  <p className="text-xl leading-relaxed text-slate-900 md:text-2xl">
                    Our process leverages{" "}
                    <span className="font-semibold text-accent">intelligent screening</span> to
                    rapidly evaluate candidate fit — enabling us to:
                  </p>

                  {/* Feature List - Minimal editorial hairlines */}
                  <div className="mt-10">
                    {[
                      {
                        n: "01",
                        title: "Reduce time-to-hire significantly",
                      },
                      {
                        n: "02",
                        title: "Surface top-tier candidates faster",
                      },
                      {
                        n: "03",
                        title: "Maintain consistency across evaluations",
                      },
                    ].map((feature) => (
                      <div
                        key={feature.n}
                        className="group/item flex items-center gap-6 border-t border-slate-100 py-6 transition-all duration-300 hover:border-accent/30 md:gap-8"
                      >
                        <span className="w-8 shrink-0 font-mono text-sm font-semibold tracking-widest text-accent">
                          {feature.n}
                        </span>
                        <p className="flex-1 text-lg font-semibold leading-snug tracking-tight text-slate-900 transition-transform duration-300 group-hover/item:translate-x-1 md:text-xl">
                          {feature.title}
                        </p>
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-300 transition-all duration-300 group-hover/item:border-accent group-hover/item:bg-accent group-hover/item:text-white">
                          <svg
                            className="h-3.5 w-3.5"
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
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Statement */}
                  <div className="mt-10">
                    <div className="h-px w-16 bg-gradient-to-r from-accent to-transparent" />
                    <p className="mt-5 text-base leading-relaxed text-slate-600 md:text-lg">
                      <span className="font-semibold text-slate-900">
                        Technology accelerates the process,
                      </span>{" "}
                      but every decision is validated by experienced recruiters — quality and
                      precision on every hire.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* WE MIGHT BE FOR YOU — EDITORIAL LIST */}
      <Section className="relative overflow-hidden border-t border-border bg-gradient-to-b from-white via-slate-50/60 to-white">
        {/* Subtle background texture */}
        <div className="absolute inset-0 surface-grain opacity-70" />
        <div className="absolute inset-0 aurora opacity-40" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

        <div className="relative z-10 mx-auto max-w-5xl">
          {/* Header */}
          <div className="max-w-3xl">
            <Eyebrow>Sound familiar?</Eyebrow>
            <h2 className="text-display mt-6 text-4xl text-foreground md:text-5xl lg:text-6xl">
              We might be <span className="italic text-accent">for you</span> if…
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted md:text-xl">
              Any of these sound familiar — all of them usually do.
            </p>
          </div>

          {/* List */}
          <ol className="mt-14 md:mt-20">
            {[
              "Your last search took three months — and the person you hired left within a year.",
              "Your board or investors have flagged a leadership gap that's holding back growth.",
              "You're the one running the search on top of everything else, and you know the pipeline you're seeing isn't good enough for where the company needs to go.",
              "You've been burned before by a search firm that promised a lot, presented a thin pipeline, and then went quiet.",
              "You need access to passive candidates — the ones who aren't on LinkedIn, aren't applying anywhere, and need to be personally introduced.",
              "You want a search partner who understands your business model and what success actually looks like at your stage.",
            ].map((statement, i) => (
              <li key={i} className="group">
                <div className="relative flex items-center gap-5 border-t border-border py-7 transition-all duration-300 hover:px-4 md:gap-8 md:py-9">
                  {/* Index */}
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-strong bg-white font-mono text-xs font-semibold tracking-widest text-ink-muted transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white md:h-11 md:w-11 md:text-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Statement */}
                  <p className="max-w-3xl text-lg font-medium leading-snug text-foreground/85 transition-colors duration-300 group-hover:text-foreground md:text-xl lg:text-2xl">
                    {statement}
                  </p>

                  {/* Hover accent tick */}
                  <span className="absolute left-0 top-1/2 h-0 w-[3px] -translate-y-1/2 rounded-full bg-gradient-to-b from-accent via-accent/70 to-accent/20 transition-all duration-500 group-hover:h-3/4" />
                </div>
              </li>
            ))}
          </ol>
          
        </div>
      </Section>

      {/* Ready to Talk - HERO STYLE WITH BACKGROUND IMAGE */}
      <section className="relative overflow-hidden">
        {/* Background Image Layer */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${new URL("../assets/team-meeting.jpg", import.meta.url).href})`,
          }}
        >
          {/* Multi-Layer Overlay for Professional Depth */}
          <div className="absolute inset-0 bg-ink/85" />
          <div className="absolute inset-0 bg-gradient-to-br from-ink/90 via-ink/80 to-accent/20" />

          {/* Subtle Noise Texture */}
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Vignette Effect */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-ink/60" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 py-24 md:py-32 lg:py-20">
          <div className="container-page">
            <div className="mx-auto max-w-4xl text-center">
              {/* Eyebrow */}
              <Eyebrow className="[&>span]:text-white/80 [&>div]:to-white/60">
                Let's connect
              </Eyebrow>

              {/* Main Heading */}
              <h2 className="text-display mt-8 text-4xl font-bold text-white md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] tracking-tight">
                Ready to{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 italic text-rare">talk?</span>
                  <span className="absolute bottom-1 left-0 right-0 h-3 bg-rare/20 -z-0 md:h-4" />
                </span>
              </h2>

              {/* Supporting Copy */}
              <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl lg:text-2xl">
                If this resonates, let's have a conversation about what you're building and how we
                can help.
              </p>

              {/* CTA Button */}
              <div className="mt-12 flex flex-wrap justify-center gap-4 md:gap-5">
                <CTAButton
                  to="/contact"
                  classes="shadow-2xl shadow-accent/20 hover:shadow-accent/30 transition-shadow duration-300"
                >
                  Book a call
                </CTAButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border pb-24 pt-24 md:pb-32 md:pt-32">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow>Trusted by</Eyebrow>
            <h2 className="text-display mt-6 text-4xl text-foreground md:text-5xl">
              Companies we work with
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
              From fast-scaling startups to enterprise teams, organizations trust us to fill their
              hardest technical roles.
            </p>
          </div>

          {/* Infinite Marquee Animation */}
          <div className="relative mt-16 overflow-hidden">
            {/* Gradient masks on edges */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-background to-transparent" />

            {/* Marquee container */}
            <div className="flex">
              {/* First set of logos */}
              <div className="flex shrink-0 animate-marquee items-center justify-around gap-16 pr-16">
                {companyLogos.map((company, index) => (
                  <div
                    key={`first-${index}`}
                    className="flex h-20 w-32 shrink-0 items-center justify-center"
                    title={company.name}
                  >
                    {company.logo ? (
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="h-12 w-auto object-contain opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 md:h-14"
                      />
                    ) : (
                      <span className="text-base font-semibold text-ink-muted">{company.name}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Duplicate set for seamless loop */}
              <div
                className="flex shrink-0 animate-marquee items-center justify-around gap-16 pr-16"
                aria-hidden="true"
              >
                {companyLogos.map((company, index) => (
                  <div
                    key={`second-${index}`}
                    className="flex h-20 w-32 shrink-0 items-center justify-center"
                    title={company.name}
                  >
                    {company.logo ? (
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="h-12 w-auto object-contain opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 md:h-14"
                      />
                    ) : (
                      <span className="text-base font-semibold text-ink-muted">{company.name}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <ScriptSlot id="about-content-after" />
    </>
  );
}
