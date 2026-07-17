import { Link } from "react-router-dom";
import { useScrollReveal } from "../hooks/useScrollReveal";

interface CommunityChannel {
  readonly name: string;
  readonly description: string;
  readonly icon: string;
  readonly members: string;
  readonly href: string;
}

const CHANNELS: readonly CommunityChannel[] = [
  {
    name: "Discord",
    description: "Real-time chat with the Cursorline community. Get help, share projects, and connect with other developers.",
    icon: "M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z",
    members: "2,400+",
    href: "#",
  },
  {
    name: "GitHub Discussions",
    description: "Ask questions, propose features, and discuss architecture decisions with the team.",
    icon: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z",
    members: "1,800+",
    href: "#",
  },
  {
    name: "Twitter / X",
    description: "Follow us for product updates, tips, and behind-the-scenes content.",
    icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
    members: "5,200+",
    href: "#",
  },
  {
    name: "Reddit",
    description: "r/cursorline — community tips, showcases, and feature discussions.",
    icon: "M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z",
    members: "3,100+",
    href: "#",
  },
];

const EVENT_TYPES = [
  { title: "Community Calls", description: "Monthly video calls to discuss roadmap, review PRs, and answer questions.", schedule: "First Friday of every month" },
  { title: "Show & Tell", description: "Share what you've built with Cursorline. Demo your projects and get feedback.", schedule: "Bi-weekly" },
  { title: "Office Hours", description: "Drop in with questions. The Cursorline team is live and ready to help.", schedule: "Wednesdays 2-3pm UTC" },
];

const CONTRIBUTOR_LINKS = [
  { label: "Contributing Guide", description: "How to contribute code, docs, or bug reports." },
  { label: "Code of Conduct", description: "Our community standards and expectations." },
  { label: "Open Issues", description: "Browse issues tagged for community contribution." },
];

export default function CommunityPage() {
  const ref = useScrollReveal();

  return (
    <div className="min-h-screen bg-bg pt-28 pb-20" ref={ref}>
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="mb-14 text-center scroll-reveal">
          <Link to="/" className="mb-4 inline-block rounded-full border border-line bg-surface px-3 py-1 font-mono text-xs text-muted transition-colors hover:border-blue/40">
            ← Back to Home
          </Link>
          <h1 className="mb-4 font-mono text-4xl font-bold md:text-5xl">
            <span className="text-blue">Community</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted">
            Join thousands of developers building the future of AI-assisted coding.
          </p>
        </div>

        {/* Channels */}
        <div className="mb-16">
          <h2 className="mb-6 font-mono text-xl font-bold text-ink scroll-reveal">Join the Conversation</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {CHANNELS.map((ch, i) => (
              <a
                key={ch.name}
                href={ch.href}
                target="_blank"
                rel="noopener noreferrer"
                className="scroll-reveal-up group flex items-start gap-4 rounded-xl border border-line bg-surface/40 p-5 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue/30 hover:bg-surface/60 hover:shadow-lg hover:shadow-black/10"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface2 text-muted transition-colors group-hover:bg-blue/10 group-hover:text-blue">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d={ch.icon} />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-ink transition-colors group-hover:text-blue">{ch.name}</h3>
                    <span className="text-xs text-muted">{ch.members} members</span>
                  </div>
                  <p className="mt-1 text-xs text-muted leading-relaxed">{ch.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Events */}
        <div className="mb-16">
          <h2 className="mb-6 font-mono text-xl font-bold text-ink scroll-reveal">Events</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {EVENT_TYPES.map((ev, i) => (
              <div
                key={ev.title}
                className="scroll-reveal-up rounded-xl border border-line bg-surface/40 p-5 backdrop-blur-sm"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <h3 className="mb-1 font-mono text-sm font-bold text-ink">{ev.title}</h3>
                <p className="mb-3 text-xs text-muted leading-relaxed">{ev.description}</p>
                <span className="inline-block rounded-full bg-blue/10 px-2.5 py-0.5 text-[10px] font-medium text-blue">{ev.schedule}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contributing */}
        <div className="scroll-reveal">
          <h2 className="mb-6 font-mono text-xl font-bold text-ink">Contributing</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {CONTRIBUTOR_LINKS.map((link, i) => (
              <div
                key={link.label}
                className="scroll-reveal-up rounded-xl border border-line bg-surface/40 p-5 backdrop-blur-sm transition-all duration-200 hover:border-line/80 hover:bg-surface/60 cursor-pointer"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <h3 className="mb-1 text-sm font-semibold text-ink">{link.label}</h3>
                <p className="text-xs text-muted">{link.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center scroll-reveal">
          <div className="mx-auto max-w-md rounded-xl border border-line bg-surface/60 p-8 backdrop-blur-sm">
            <h3 className="mb-2 font-mono text-lg font-bold">Ready to join?</h3>
            <p className="mb-5 text-sm text-muted">
              Start building with Cursorline today and become part of the community.
            </p>
            <Link to="/signup" className="inline-block rounded-lg bg-blue px-6 py-3 text-sm font-semibold text-bg transition-colors hover:bg-blue/90">
              Get Started Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
