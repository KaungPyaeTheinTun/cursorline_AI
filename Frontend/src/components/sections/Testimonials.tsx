import { useScrollReveal } from "../../hooks/useScrollReveal";
import { testimonials } from "../../data/testimonials";

export default function Testimonials() {
  const ref = useScrollReveal();

  return (
    <section className="py-20 md:py-28 bg-surface/30" ref={ref}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center scroll-reveal">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Trusted by engineers who ship
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="scroll-reveal-up flex flex-col justify-between rounded-xl border border-line bg-surface p-6 transition-all duration-200 hover:border-blue/20 hover:shadow-lg hover:shadow-blue/5"
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <p className="mb-6 text-sm leading-relaxed text-muted italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <p className="font-mono text-sm font-semibold text-ink">{t.role}</p>
                <p className="text-xs text-muted">{t.team}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
