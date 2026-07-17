import { useScrollReveal } from "../../hooks/useScrollReveal";

const STEPS = [
  {
    number: 1,
    title: "Connect your repository",
    description:
      "Install the Cursorline extension and point it at your repo. Indexing runs in the background — most projects are ready in under a minute.",
  },
  {
    number: 2,
    title: "Work normally",
    description:
      "Cursorline watches your code as you type. Autocomplete suggestions, inline explanations, and refactoring options appear automatically, informed by your full codebase.",
  },
  {
    number: 3,
    title: "Ship with confidence",
    description:
      "Get git-aware PR reviews, cross-file bug detection, and plain-English reasoning behind every suggestion — so you merge faster without breaking things.",
  },
];

export default function HowItWorks() {
  const ref = useScrollReveal();

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-surface/30" ref={ref}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center scroll-reveal">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">How it works</h2>
          <p className="mx-auto max-w-xl text-muted">
            Three steps from install to production-grade AI assistance.
          </p>
        </div>
        <div className="relative mx-auto max-w-2xl">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-line" aria-hidden="true" />
          <div className="space-y-12">
            {STEPS.map((step, i) => (
              <div
                key={step.number}
                className="scroll-reveal-left relative flex gap-6"
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line bg-bg font-mono text-sm font-bold text-blue transition-all duration-300 hover:border-blue hover:shadow-lg hover:shadow-blue/20">
                  {step.number}
                </div>
                <div className="pt-2">
                  <h3 className="mb-2 font-mono text-lg font-semibold">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
