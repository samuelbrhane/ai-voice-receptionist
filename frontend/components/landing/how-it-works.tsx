"use client";

import { useInView } from "@/components/motion";

const STEPS = [
  { title: "You speak", text: "Vapi streams your voice and turns it into text as you talk." },
  { title: "Sofia decides", text: "The language model follows the clinic's rules and picks a tool when it needs the calendar." },
  { title: "The clinic API answers", text: "A FastAPI backend checks free slots, books, moves or cancels, and enforces every rule." },
  { title: "She replies", text: "The answer is spoken back, and the calendar on this page updates at the same time." },
];

const STEP_DELAY_MS = 320;

export function HowItWorks() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section className="bg-surface py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-3xl font-bold tracking-tight">How a call works</h2>

        <div ref={ref} className="mt-8">
          {/* Progress line across the steps, on wider screens */}
          <div className="mb-5 hidden h-1 overflow-hidden rounded-full bg-mint md:block" aria-hidden>
            <div className={`progress-fill h-full bg-teal ${inView ? "progress-on" : ""}`} />
          </div>

          <ol className="grid gap-4 md:grid-cols-4">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className={`step rounded-2xl border border-line bg-porcelain p-5 ${inView ? "step-on" : ""}`}
                style={{ animationDelay: `${index * STEP_DELAY_MS}ms` }}
              >
                <span className="step-badge tabular grid h-9 w-9 place-items-center rounded-full bg-mint font-display text-lg font-bold text-teal">
                  {index + 1}
                </span>
                <h3 className="mt-3 font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-ink-soft">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-6 max-w-3xl text-ink-soft">
          The model never touches the database directly. It can only call five tools, and the backend
          rejects anything that breaks a rule: a taken slot, a time outside opening hours, or a dentist
          who doesn&apos;t do that treatment.
        </p>
      </div>
    </section>
  );
}