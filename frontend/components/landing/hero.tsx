import type { ReactNode } from "react";

export function Hero() {
  return (
    <section className="rise-in mx-auto max-w-6xl px-4 pb-8 pt-6 sm:px-6 sm:pt-12">
      <p className="text-sm font-semibold text-teal">AI voice receptionist · English and Italian</p>
      <h1 className="mt-3 max-w-4xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
        Call the clinic. Sofia books it while you talk.
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-ink-soft">
        Sofia answers the phone for Aurelia Dental in Cosenza. She checks the real calendar, offers free
        times, and books, moves or cancels appointments. Tap the orb, talk to her, and watch each change
        land in the calendar.
      </p>
    </section>
  );
}