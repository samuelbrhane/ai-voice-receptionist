import { LiveDemo } from "@/components/demo";
import { Capabilities, Hero, HowItWorks, SiteFooter, SiteHeader, Tech } from "@/components/landing";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <section id="try" className="mx-auto max-w-6xl scroll-mt-6 px-4 pb-14 sm:px-6">
          <LiveDemo />
        </section>
        <Capabilities />
        <HowItWorks />
        <Tech />
      </main>
      <SiteFooter />
    </>
  );
}