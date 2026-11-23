const ITEMS = [
  {
    title: "Books new appointments",
    text: "Asks what you need, checks both dentists' calendars, offers two or three real times, and confirms the booking.",
  },
  {
    title: "Moves and cancels",
    text: "Finds your booking by phone number, offers new times, and mentions the late fee if you cancel within 24 hours.",
  },
  {
    title: "Handles urgent calls",
    text: "For pain or a broken tooth it offers today's earliest emergency slot, and points serious cases to 112.",
  },
  {
    title: "Speaks your language",
    text: "Separate English and Italian lines, each with its own voice and speech recognition tuned for names and times.",
  },
];

export function Capabilities() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h2 className="font-display text-3xl font-bold tracking-tight">What Sofia handles</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {ITEMS.map((item) => (
          <div key={item.title} className="rounded-2xl border border-line bg-surface p-5">
            <h3 className="font-semibold">{item.title}</h3>
            <p className="mt-1 text-ink-soft">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}