import { Hero } from "../components/hero";
import { ProblemSection } from "../components/home/ProblemSection";
import { WhatWeDoSection } from "../components/home/WhatWeDoSection";
import { SpecializedTalentSection } from "../components/home/SpecializedTalentSection";
import { HowItWorksSection } from "../components/home/HowItWorksSection";
import { FinalCTASection } from "../components/home/FinalCTASection";
import { ScriptSlot } from "../components/ScriptSlot";
import { SEO, structuredDataSchemas } from "../components/SEO";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      structuredDataSchemas.organization,
      structuredDataSchemas.website,
      structuredDataSchemas.service,
      {
        "@type": "WebPage",
        "@id": "https://rareroles.com/#webpage",
        url: "https://rareroles.com/",
        name: "RareRoles — Rare Tech Talent, On Demand",
        description:
          "Specialized technical recruitment partner for hard-to-fill enterprise roles. Access pre-vetted AI engineers, Oracle PL/SQL developers, CCIE network engineers, AIX administrators, SharePoint specialists, and solution architects. Faster hiring, better candidates, reduced costs.",
        isPartOf: {
          "@id": "https://rareroles.com/#website",
        },
        about: {
          "@type": "Thing",
          name: "Technical Recruitment",
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: "https://rareroles.com/og-image.jpg",
        },
      },
    ],
  };

  return (
    <>
      <SEO
        title="Rare Tech Talent, On Demand"
        description="Specialized technical recruitment partner for hard-to-fill enterprise roles. Access pre-vetted AI engineers, Oracle PL/SQL developers, CCIE network engineers, AIX administrators, SharePoint specialists, and solution architects. Faster hiring, better candidates, reduced costs."
        keywords="technical recruitment, AI engineers, Oracle PL/SQL developers, CCIE network engineers, AIX administrators, SharePoint specialists, solution architects, enterprise recruitment, tech talent acquisition, specialized recruitment, contract hiring, permanent placement, executive search"
        structuredData={structuredData}
      />
      <Hero />
      <ScriptSlot id="home-hero-after" />
      <ProblemSection />
      <WhatWeDoSection />
      <SpecializedTalentSection />
      <HowItWorksSection />
      <FinalCTASection />
      <ScriptSlot id="home-cta-after" />
    </>
  );
}
