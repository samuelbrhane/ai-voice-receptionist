import { LiveDemo } from "@/components/demo";
import { Capabilities, HowItWorks, SiteFooter, SiteHeader, Tech } from "@/components/landing";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <LiveDemo />
        <Capabilities />
        <HowItWorks />
        <Tech />
      </main>
      <SiteFooter />
    </>
  );
}