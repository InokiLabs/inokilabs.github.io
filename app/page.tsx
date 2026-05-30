import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { ProblemBand } from "@/components/ProblemBand";
import { Workflow } from "@/components/Workflow";
import { Instrument } from "@/components/Instrument";
import { SimToReal } from "@/components/SimToReal";
import { Curriculum } from "@/components/Curriculum";
import { MVP } from "@/components/MVP";
import { Platform } from "@/components/Platform";
import { Company } from "@/components/Company";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ProblemBand />
        <Workflow />
        <Instrument />
        <SimToReal />
        <Curriculum />
        <MVP />
        <Platform />
        <Company />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
