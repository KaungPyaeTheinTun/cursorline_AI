import { useAuth } from "../../hooks/useAuth";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import TerminalAnimation from "../ui/TerminalAnimation";
import Lightfall from "../ui/Lightfall";

export default function Hero() {
  const { user, isAuthLoaded } = useAuth();
  const isSubscribed = isAuthLoaded && !!user?.subscribed_at;
  const ref = useScrollReveal();

  return (
    <section
      className="relative overflow-hidden pt-32 pb-12 md:pt-40 md:pb-16"
      ref={ref}
    >
      <div className="absolute inset-0 z-0">
        <Lightfall
          colors={["#5FA8FF", "#232A38", "#11151C"]}
          backgroundColor="#0B0E14"
          speed={0.4}
          streakCount={6}
          streakWidth={0.8}
          streakLength={1.2}
          glow={0.8}
          density={0.5}
          twinkle={0.6}
          zoom={3}
          backgroundGlow={0.3}
          opacity={0.7}
          mouseInteraction={true}
          mouseStrength={0.4}
          mouseRadius={0.8}
          mouseDampening={0.15}
        />
      </div>
      <div className="mx-auto max-w-6xl px-6 text-center relative z-10">
        <span className="mb-4 inline-block rounded-full border border-line bg-surface px-3 py-1 font-mono text-xs text-muted">
          Now in public beta
        </span>
        <h1 className="mx-auto mb-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
          Your entire repo,
          <br />
          <span className="text-blue">understood.</span>
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-muted">
          Cursorline indexes every file in your repository so autocomplete,
          debugging, and refactors are informed by your full codebase — not just
          the file you have open.
        </p>
        <div className="mb-6 flex flex-wrap items-center justify-center gap-4">
          {!isAuthLoaded ? (
            <span className="text-lg text-muted loading-dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          ) : isSubscribed ? (
            <a
              href="/build"
              className="rounded-lg bg-blue px-6 py-3 text-sm font-semibold text-bg transition-colors hover:bg-blue/90"
            >
              Start Building →
            </a>
          ) : isAuthLoaded && user ? (
            <a
              href="#pricing"
              className="rounded-lg bg-blue px-6 py-3 text-sm font-semibold text-bg transition-colors hover:bg-blue/90"
            >
              View Plans
            </a>
          ) : (
            <a
              href="#pricing"
              className="rounded-lg bg-blue px-6 py-3 text-sm font-semibold text-bg transition-colors hover:bg-blue/90"
            >
              Start Free Trial
            </a>
          )}
          <a
            href="#demo"
            className="rounded-lg border border-line px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface2"
          >
            See It in Action
          </a>
        </div>
        <p className="mb-14 text-xs text-muted">
          Works with VS Code, Neovim & JetBrains. No credit card required.
        </p>

        {/* Full-width terminal animation card */}
        <div className="scroll-reveal mx-auto max-w-5xl">
          <TerminalAnimation />
        </div>
      </div>
    </section>
  );
}
