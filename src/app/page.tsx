import { Shell } from "@/components/Shell";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Story } from "@/components/Story";
import { Work } from "@/components/Work";
import { Outcomes } from "@/components/Outcomes";
import { Skills } from "@/components/Skills";
import { About } from "@/components/About";
import { HireMe } from "@/components/HireMe";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <Shell>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Story />
        <Work />
        <Outcomes />
        <Skills />
        <About />
        <HireMe />
      </main>
      <Footer />
    </Shell>
  );
}
