export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-6 sm:pt-14">
      <p className="text-sm font-semibold text-teal">AI voice receptionist · English and Italian</p>
      <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
        Call the clinic. Sofia books it while you talk.
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-ink-soft">
        Sofia answers the phone for Aurelia Dental, a clinic in Cosenza. She checks the real calendar,
        offers free times, and books, moves or cancels appointments. Try it in your browser and watch
        each change appear in the calendar.
      </p>
      <a
        href="#try"
        className="mt-7 inline-block rounded-full bg-teal px-6 py-3 font-semibold text-white hover:bg-teal-deep"
      >
        Try a call
      </a>
    </section>
  );
}