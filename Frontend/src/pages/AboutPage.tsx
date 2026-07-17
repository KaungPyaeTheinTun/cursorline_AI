import { Link } from "react-router-dom";
import { useScrollReveal } from "../hooks/useScrollReveal";

const TEAM = [
  { name: "Kaung Pyae Thein Tun", role: "Founder & Lead Engineer", bio: "Full-stack developer passionate about AI-powered developer tools." },
  { name: "Cursorline AI", role: "Engineering", bio: "The AI engine that powers every suggestion, debug, and refactor." },
  { name: "You", role: "Community", bio: "Every user shapes what Cursorline becomes next." },
];

const VALUES = [
  { title: "Developer First", description: "Every decision starts with: does this make a developer's life better? We obsess over DX, latency, and accuracy.", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" },
  { title: "Radical Transparency", description: "Our roadmap is public. Our pricing is simple. We communicate openly about what works and what doesn't.", icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" },
  { title: "Ship Fast, Iterate", description: "We release early and often. Real user feedback beats perfect plans every time.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { title: "Privacy by Default", description: "Your code is yours. We never train on your source code. Your repository stays private and secure.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
];

const MILESTONES = [
  { year: "2026 Q1", event: "Founded", detail: "Cursorline started as a side project to solve a personal pain point." },
  { year: "2026 Q2", event: "Public Beta", detail: "Launched public beta with IDE extensions and team workspaces." },
  { year: "2026 Q3", event: "10K Users", detail: "Reached 10,000 active developers across 50+ countries." },
  { year: "2027", event: "GA Launch", detail: "General availability with enterprise features and self-hosted options." },
];

export default function AboutPage() {
  const ref = useScrollReveal();

  return (
    <div className="min-h-screen bg-bg pt-28 pb-20" ref={ref}>
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="mb-14 text-center scroll-reveal">
          <Link to="/" className="mb-4 inline-block rounded-full border border-line bg-surface px-3 py-1 font-mono text-xs text-muted transition-colors hover:border-blue/40">
            ← Back to Home
          </Link>
          <h1 className="mb-4 font-mono text-4xl font-bold md:text-5xl">
            About <span className="text-blue">Cursorline</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted">
            We believe AI should understand your code — not just the file you have open, but your entire project, your patterns, and your intent.
          </p>
        </div>

        {/* Mission */}
        <div className="mb-16 scroll-reveal">
          <div className="rounded-xl border border-blue/30 bg-blue/5 p-8">
            <h2 className="mb-3 font-mono text-xl font-bold text-ink">Our Mission</h2>
            <p className="text-sm leading-relaxed text-muted">
              Cursorline is building the AI coding assistant that actually understands your codebase. Not just autocomplete — a real pair programmer that knows your architecture, your conventions, and your team's patterns. We started because existing tools felt like they were guessing. We wanted one that <em className="text-ink">knows</em>.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="mb-6 font-mono text-xl font-bold text-ink scroll-reveal">What We Believe</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {VALUES.map((val, i) => (
              <div
                key={val.title}
                className="scroll-reveal-up rounded-xl border border-line bg-surface/40 p-5 backdrop-blur-sm"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-blue/10 text-blue">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d={val.icon} />
                  </svg>
                </div>
                <h3 className="mb-1 font-mono text-sm font-bold text-ink">{val.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="mb-6 font-mono text-xl font-bold text-ink scroll-reveal">The Team</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {TEAM.map((member, i) => (
              <div
                key={member.name}
                className="scroll-reveal-up rounded-xl border border-line bg-surface/40 p-5 backdrop-blur-sm text-center"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue/20 font-mono text-lg font-bold text-blue">
                  {member.name.charAt(0)}
                </div>
                <h3 className="font-mono text-sm font-bold text-ink">{member.name}</h3>
                <p className="mb-2 text-xs text-blue">{member.role}</p>
                <p className="text-xs text-muted">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div className="mb-16">
          <h2 className="mb-6 font-mono text-xl font-bold text-ink scroll-reveal">Milestones</h2>
          <div className="relative">
            <div className="absolute left-[15px] top-0 bottom-0 w-px bg-line" />
            {MILESTONES.map((ms, i) => (
              <div key={ms.year} className="scroll-reveal-up relative mb-6 pl-10" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="absolute left-0 top-1 z-10">
                  <span className="block h-[10px] w-[10px] rounded-full border-2 border-bg bg-blue" />
                </div>
                <span className="font-mono text-xs font-bold text-blue">{ms.year}</span>
                <h3 className="font-mono text-sm font-bold text-ink">{ms.event}</h3>
                <p className="text-xs text-muted">{ms.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center scroll-reveal">
          <div className="mx-auto max-w-md rounded-xl border border-line bg-surface/60 p-8 backdrop-blur-sm">
            <h3 className="mb-2 font-mono text-lg font-bold">Want to help build Cursorline?</h3>
            <p className="mb-5 text-sm text-muted">
              We're always looking for passionate people to join us.
            </p>
            <Link to="/contact" className="inline-block rounded-lg bg-blue px-6 py-3 text-sm font-semibold text-bg transition-colors hover:bg-blue/90">
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
