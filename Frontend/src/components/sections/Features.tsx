import { useScrollReveal } from "../../hooks/useScrollReveal";
import { features } from "../../data/features";
import MouseGlow from "../ui/MouseGlow";

export default function Features() {
  const ref = useScrollReveal();

  return (
    <section id="features" className="py-20 md:py-28" ref={ref}>
      <MouseGlow className="mx-auto max-w-6xl px-6" glowColor="rgba(95, 168, 255, 0.15)" glowSize={600}>
        <div className="mb-12 text-center scroll-reveal">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Built for how you actually work
          </h2>
          <p className="mx-auto max-w-2xl text-muted">
            Every feature is designed around the reality of modern software development:
            large codebases, multiple files, and real debugging sessions.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="scroll-reveal-up rounded-xl border border-line bg-surface p-6 transition-all duration-200 hover:border-blue/30 hover:shadow-lg hover:shadow-blue/5 hover:-translate-y-1"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span className="mb-4 inline-block text-2xl" aria-hidden="true">
                {feature.icon}
              </span>
              <h3 className="mb-2 font-mono text-base font-semibold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{feature.description}</p>
            </div>
          ))}
        </div>
      </MouseGlow>
    </section>
  );
}
