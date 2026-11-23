const STEPS = [
  { title: "You speak", text: "Vapi streams your voice and turns it into text as you talk." },
  { title: "Sofia decides", text: "The language model follows the clinic's rules and picks a tool when it needs the calendar." },
  { title: "The clinic API answers", text: "A FastAPI backend checks free slots, books, moves or cancels, and enforces every rule." },
  { title: "She replies", text: "The answer is spoken back, and the calendar on this page updates at the same time." },
];

export function HowItWorks() {
  return (
    <section className="bg-surface py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-3xl font-bold tracking-tight">How a call works</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="rounded-2xl bg-porcelain p-5">
              <span className="tabular font-display text-2xl font-bold text-teal">{index + 1}</span>
              <h3 className="mt-2 font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm text-ink-soft">{step.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-3xl text-ink-soft">
          The model never touches the database directly. It can only call five tools, and the backend
          rejects anything that breaks a rule: a taken slot, a time outside opening hours, or a dentist
          who doesn't do that treatment.
        </p>
      </div>
    </section>
  );
}