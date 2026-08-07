import { Hero } from "../components/hero";
import { ProblemSection } from "../components/home/ProblemSection";
import { WhatWeDoSection } from "../components/home/WhatWeDoSection";
import { SpecializedTalentSection } from "../components/home/SpecializedTalentSection";
import { HowItWorksSection } from "../components/home/HowItWorksSection";
import { FinalCTASection } from "../components/home/FinalCTASection";
import { ScriptSlot } from "../components/ScriptSlot";

export default function Home() {
  return (
    <>
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
