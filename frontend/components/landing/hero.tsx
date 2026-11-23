import type { ReactNode } from "react";

export function Hero({ children }: { children: ReactNode }) {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-12 pt-6 sm:px-6 sm:pt-12 lg:grid-cols-[1.15fr_1fr]">
      <div className="rise-in">
        <p className="text-sm font-semibold text-teal">AI voice receptionist · English and Italian</p>
        <h1 className="mt-3 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
          Call the clinic. Sofia books it while you talk.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-ink-soft">
          Sofia answers the phone for Aurelia Dental in Cosenza. She checks the real calendar, offers free
          times, and books, moves or cancels appointments. Tap the orb, talk to her, and watch each change
          land in the calendar below.
        </p>
      </div>
      <div className="rise-in flex justify-center" style={{ animationDelay: "150ms" }}>
        {children}
      </div>
    </section>
  );
}