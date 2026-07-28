import { useEffect } from "react";
import { Section, Eyebrow, CTAButton } from "../components/ui-bits";
import logoWhite from "../assets/logo-white.jpg";
import aboutHeroImg from "../assets/step-shortlist.jpg";
import teamMeetingImg from "../assets/team-meeting.jpg";
import missionImg from "../assets/step-brief.jpg";
import visionImg from "../assets/step-hire.jpg";

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
  useEffect(() => {
    document.title = "About — The talent partner for rare tech roles | RareRoles";
  }, []);

  return (
    <>
      <section className="relative overflow-hidden">
        {/* Background image — tech team working on laptops */}
        <img
          src={aboutHeroImg}
          alt="Young tech professionals collaborating on laptops"
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
            <Eyebrow className="[&>span]:text-white/90 [&>div]:to-white/60">
              About
            </Eyebrow>
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
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <Eyebrow>Who we are</Eyebrow>
            <h2 className="text-display mt-6 text-4xl text-foreground md:text-5xl">
              Who we are
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p className="text-lg text-foreground">
              RareRoles is a talent company focused on rare and hard-to-fill tech roles.
            </p>
            <p className="mt-6 text-lg text-foreground">
              We help companies find the right talent, and we help professionals find better opportunities.
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="mt-24 space-y-6">
          {/* Mission Row - Image on Right */}
          <div className="group relative flex flex-col md:flex-row overflow-hidden bg-white transition-all duration-500 hover:shadow-2xl">
            {/* Mission Content - Left */}
            <div className="relative flex w-full md:w-1/2 flex-col justify-center px-8 py-8 md:px-10 md:py-10 lg:px-12 lg:py-12">
              {/* Minimalist decorative element */}
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#E91E63] via-[#E91E63]/60 to-transparent" />
              
              {/* Icon - Bigger and no background */}
              <div className="mb-4 flex">
                <svg
                  className="h-12 w-12 text-[#E91E63] md:h-14 md:w-14"
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
                <div className="h-px w-8 bg-gradient-to-r from-[#E91E63] to-transparent" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E91E63]">Mission</span>
              </div>
              
              <h3 className="mb-4 text-2xl font-bold leading-tight tracking-tight text-slate-900 md:text-3xl" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Our mission
              </h3>
              
              <p className="max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
                To help companies hire rare talent faster and help professionals grow in specialized careers
              </p>
            </div>

            {/* Mission Image - Right */}
            <div className="relative w-full md:w-1/2 overflow-hidden h-[280px] md:h-[320px]">
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/5 to-white/60 md:to-white/60 hidden md:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent block md:hidden" />
              <img
                src={missionImg}
                alt="Professional business meeting and collaboration"
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
              <img
                src={visionImg}
                alt="Business vision and professional growth"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Sophisticated overlay pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(233,30,99,0.03)_50%,transparent_52%)] bg-[length:20px_20px]" />
            </div>

            {/* Vision Content - Right (appears on bottom on mobile) */}
            <div className="relative flex w-full md:w-1/2 flex-col justify-center px-8 py-8 md:px-10 md:py-10 lg:px-12 lg:py-12 order-last md:order-last">
              {/* Minimalist decorative element */}
              <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-[#E91E63] via-[#E91E63]/60 to-transparent" />
              
              {/* Icon - Bigger and no background */}
              <div className="mb-4 flex">
                <svg
                  className="h-12 w-12 text-[#E91E63] md:h-14 md:w-14"
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
                <div className="h-px w-8 bg-gradient-to-r from-[#E91E63] to-transparent" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E91E63]">Vision</span>
              </div>
              
              <h3 className="mb-4 text-2xl font-bold leading-tight tracking-tight text-white md:text-3xl" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Our vision
              </h3>
              
              <p className="max-w-xl text-base leading-relaxed text-slate-300 md:text-lg">
                To become the go-to company for rare and emerging tech roles
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <Eyebrow>How we work</Eyebrow>
            <h2 className="text-display mt-6 text-4xl text-foreground md:text-5xl">
              How we work
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p className="text-lg text-foreground">
              We build talent pipelines before companies need them.
            </p>
            <p className="mt-6 text-lg text-foreground">
              This helps companies hire faster and with less stress.
            </p>
          </div>
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
                  className="shadow-2xl shadow-accent/20 hover:shadow-accent/30 transition-shadow duration-300"
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
    </>
  );
}
