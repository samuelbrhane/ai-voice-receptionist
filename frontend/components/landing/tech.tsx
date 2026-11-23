const STACK = [
  { name: "Vapi", role: "Voice pipeline, speech recognition and voices" },
  { name: "OpenAI", role: "The model that runs the conversation" },
  { name: "FastAPI", role: "Calendar tools and clinic rules" },
  { name: "Postgres on Neon", role: "Appointments, one calendar per visitor" },
  { name: "Next.js", role: "This page and the live calendar" },
  { name: "Vercel", role: "Hosting for both apps, in Frankfurt" },
];

export function Tech() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h2 className="font-display text-3xl font-bold tracking-tight">Built with</h2>
      <dl className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
        {STACK.map((item) => (
          <div key={item.name} className="border-t border-line pt-3">
            <dt className="font-semibold">{item.name}</dt>
            <dd className="text-sm text-ink-soft">{item.role}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}