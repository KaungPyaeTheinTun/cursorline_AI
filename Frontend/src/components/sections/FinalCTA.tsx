import { useScrollReveal } from "../../hooks/useScrollReveal";

export default function FinalCTA() {
  const ref = useScrollReveal();

  return (
    <section className="py-20 md:py-28" ref={ref}>
      <div className="mx-auto max-w-3xl px-6 text-center scroll-reveal-scale">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
          Stop guessing. Start understanding.
        </h2>
        <p className="mb-8 text-lg text-muted">
          Cursorline gives your entire codebase the context it needs to autocomplete smarter, debug
          faster, and refactor safely — right inside your editor.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="#pricing"
            className="rounded-lg bg-blue px-6 py-3 text-sm font-semibold text-bg transition-all duration-200 hover:bg-blue/90 hover:scale-105"
          >
            Get Started Free
          </a>
          <a
            href="#demo"
            className="rounded-lg border border-line px-6 py-3 text-sm font-semibold text-ink transition-all duration-200 hover:bg-surface2 hover:scale-105"
          >
            View Demo
          </a>
        </div>
      </div>
    </section>
  );
}
