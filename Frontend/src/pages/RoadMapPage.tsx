import { Link } from "react-router-dom";
import { useScrollReveal } from "../hooks/useScrollReveal";

interface RoadmapItem {
  readonly quarter: string;
  readonly title: string;
  readonly status: "shipped" | "in-progress" | "planned";
  readonly description: string;
  readonly tags: readonly string[];
}

const ROADMAP: readonly RoadmapItem[] = [
  {
    quarter: "Q1 2026",
    title: "Core AI Chat & Repo Indexing",
    status: "shipped",
    description:
      "Full-codebase indexing, streaming AI chat powered by Groq, conversation persistence with database-backed history, and markdown rendering with syntax highlighting.",
    tags: ["AI Chat", "Groq API", "Conversation History"],
  },
  {
    quarter: "Q1 2026",
    title: "Authentication & Payments",
    status: "shipped",
    description:
      "Email/password auth, Google & GitHub OAuth, Stripe checkout with subscription management, and role-based access control.",
    tags: ["OAuth", "Stripe", "RBAC"],
  },
  {
    quarter: "Q1 2026",
    title: "Admin Dashboard",
    status: "shipped",
    description:
      "Admin panel with FAQ management, user profile settings, and role assignment. Collapsible sidebar with responsive layout.",
    tags: ["Admin", "FAQ CRUD", "Dashboard"],
  },
  {
    quarter: "Q2 2026",
    title: "IDE Extensions",
    status: "in-progress",
    description:
      "VS Code, Neovim, and JetBrains extensions that bring Cursorline's AI assistant directly into your editor. Inline suggestions, code actions, and context-aware completions.",
    tags: ["VS Code", "Neovim", "JetBrains"],
  },
  {
    quarter: "Q2 2026",
    title: "Multi-Model Support",
    status: "in-progress",
    description:
      "Choose between GPT-4o, Claude 3.5, Gemini, and local models. Per-task model routing for optimal speed and quality.",
    tags: ["GPT-4o", "Claude", "Gemini", "Local Models"],
  },
  {
    quarter: "Q2 2026",
    title: "Team Workspaces",
    status: "in-progress",
    description:
      "Shared workspaces for teams with collaborative indexing, shared conversation threads, and role-based permissions.",
    tags: ["Teams", "Collaboration", "Permissions"],
  },
  {
    quarter: "Q3 2026",
    title: "Automated Code Review",
    status: "planned",
    description:
      "AI-powered PR reviews that catch bugs, suggest improvements, and enforce coding standards. GitHub and GitLab integration.",
    tags: ["Code Review", "PR Analysis", "CI/CD"],
  },
  {
    quarter: "Q3 2026",
    title: "Custom Context Providers",
    status: "planned",
    description:
      "Connect external docs, Notion, Confluence, or internal wikis as context sources. The AI will reference your full knowledge base when answering.",
    tags: ["Notion", "Confluence", "Custom Docs"],
  },
  {
    quarter: "Q3 2026",
    title: "Semantic Search Across Repos",
    status: "planned",
    description:
      "Find code by meaning, not just keywords. Ask \"where is the payment validation logic?\" and get precise file and line references.",
    tags: ["Semantic Search", "Code Navigation"],
  },
  {
    quarter: "Q4 2026",
    title: "Autonomous Agents",
    status: "planned",
    description:
      "Let AI agents run multi-step tasks autonomously: fix bugs, write tests, refactor code, and create PRs — all with your approval.",
    tags: ["Agents", "Automation", "Multi-step"],
  },
  {
    quarter: "Q4 2026",
    title: "Self-Hosted & On-Premise",
    status: "planned",
    description:
      "Deploy Cursorline on your own infrastructure with full data control. Docker images, Kubernetes manifests, and air-gapped support.",
    tags: ["Self-Hosted", "Docker", "Kubernetes"],
  },
  {
    quarter: "Q1 2027",
    title: "Full IDE Integration Suite",
    status: "planned",
    description:
      "End-to-end coding workflows: from natural language prompt to tested, reviewed, and deployed code. Full project scaffolding and migration support.",
    tags: ["Full Stack", "Scaffolding", "Migrations"],
  },
];

const STATUS_STYLES = {
  shipped: { bg: "bg-green/10", text: "text-green", border: "border-green/30", label: "Shipped" },
  "in-progress": { bg: "bg-blue/10", text: "text-blue", border: "border-blue/30", label: "In Progress" },
  planned: { bg: "bg-muted/10", text: "text-muted", border: "border-line", label: "Planned" },
} as const;

const TIMELINE_DOT: Record<string, string> = {
  shipped: "bg-green",
  "in-progress": "bg-blue animate-pulse",
  planned: "bg-muted/50",
};

export default function RoadMapPage() {
  const ref = useScrollReveal();

  return (
    <div className="min-h-screen bg-bg pt-28 pb-20" ref={ref}>
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="mb-16 text-center scroll-reveal">
          <Link
            to="/"
            className="mb-4 inline-block rounded-full border border-line bg-surface px-3 py-1 font-mono text-xs text-muted transition-colors hover:border-blue/40"
          >
            ← Back to Home
          </Link>
          <h1 className="mb-4 font-mono text-4xl font-bold md:text-5xl">
            Product <span className="text-blue">Roadmap</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted">
            What we&apos;ve built, what we&apos;re working on, and where we&apos;re headed.
            Transparency is core to how we build Cursorline.
          </p>
        </div>

        {/* Legend */}
        <div className="mb-12 flex flex-wrap items-center justify-center gap-6 scroll-reveal">
          {Object.entries(STATUS_STYLES).map(([key, style]) => (
            <div key={key} className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${TIMELINE_DOT[key]}`} />
              <span className={`text-sm font-medium ${style.text}`}>{style.label}</span>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[18px] top-0 bottom-0 w-px bg-line md:left-1/2 md:-translate-x-px" />

          {ROADMAP.map((item, i) => {
            const style = STATUS_STYLES[item.status];
            const isRight = i % 2 === 0;

            return (
              <div
                key={`${item.quarter}-${item.title}`}
                className={`scroll-reveal-up relative mb-12 flex items-start gap-6 md:gap-0 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                {/* Mobile dot */}
                <div className="relative z-10 mt-1 md:hidden">
                  <span className={`block h-[14px] w-[14px] rounded-full border-2 border-bg ${TIMELINE_DOT[item.status]}`} />
                </div>

                {/* Desktop spacer for opposite side */}
                <div className="hidden md:block md:w-1/2" />

                {/* Desktop center dot */}
                <div className="relative z-10 mt-1 hidden md:flex md:w-0 md:justify-center">
                  <span className={`block h-3.5 w-3.5 rounded-full border-2 border-bg ${TIMELINE_DOT[item.status]}`} />
                </div>

                {/* Card */}
                <div className={`flex-1 md:w-1/2 ${isRight ? "md:pl-8" : "md:pr-8"}`}>
                  <div className={`rounded-xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10 ${style.border} bg-surface/60 backdrop-blur-sm`}>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-muted">{item.quarter}</span>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${style.bg} ${style.text} ${style.border} border`}>
                        {style.label}
                      </span>
                    </div>
                    <h3 className="mb-2 font-mono text-base font-bold text-ink">{item.title}</h3>
                    <p className="mb-3 text-sm leading-relaxed text-muted">{item.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-surface2 px-2 py-0.5 font-mono text-[11px] text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center scroll-reveal">
          <div className="mx-auto max-w-md rounded-xl border border-line bg-surface/60 p-8 backdrop-blur-sm">
            <h3 className="mb-2 font-mono text-lg font-bold">Have a feature request?</h3>
            <p className="mb-5 text-sm text-muted">
              We build what our users need. Tell us what matters most to you.
            </p>
            <Link
              to="/"
              className="inline-block rounded-lg bg-blue px-6 py-3 text-sm font-semibold text-bg transition-colors hover:bg-blue/90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
