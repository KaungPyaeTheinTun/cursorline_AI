import { useState } from "react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "../hooks/useScrollReveal";

interface DocSection {
  readonly id: string;
  readonly title: string;
  readonly icon: string;
  readonly items: readonly { readonly title: string; readonly description: string; readonly tag?: string }[];
}

const SECTIONS: readonly DocSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    items: [
      { title: "Installation", description: "Install Cursorline in under 2 minutes. Supports VS Code, Neovim, and JetBrains IDEs.", tag: "Start here" },
      { title: "Quick Start Guide", description: "Connect your first repository and get AI-powered suggestions instantly." },
      { title: "System Requirements", description: "Minimum specs, supported OS versions, and IDE compatibility matrix." },
      { title: "Authentication", description: "Set up your account with email/password, Google, or GitHub sign-in." },
    ],
  },
  {
    id: "core-features",
    title: "Core Features",
    icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    items: [
      { title: "AI Chat", description: "Natural language conversations about your codebase. Ask questions, get code suggestions." },
      { title: "Repo Indexing", description: "How Cursorline indexes your files and builds a semantic understanding of your code." },
      { title: "Context Window", description: "Control how much of your codebase the AI considers when generating responses." },
      { title: "Streaming Responses", description: "Real-time token-by-token output for instant feedback while coding." },
    ],
  },
  {
    id: "integrations",
    title: "Integrations",
    icon: "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z",
    items: [
      { title: "VS Code Extension", description: "Inline completions, code actions, and chat panel directly in your editor." },
      { title: "Neovim Plugin", description: "Lua-native integration with completion sources and floating window chat." },
      { title: "JetBrains Plugin", description: "Full IDE integration for IntelliJ, PyCharm, WebStorm, and more." },
      { title: "GitHub Integration", description: "Connect repos directly, get PR reviews, and sync project settings." },
    ],
  },
  {
    id: "api-reference",
    title: "API Reference",
    icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
    items: [
      { title: "REST API", description: "Full reference for all Cursorline API endpoints with authentication and rate limits." },
      { title: "Streaming API", description: "Server-Sent Events for real-time AI response streaming." },
      { title: "Webhooks", description: "Get notified about indexing completion, PR reviews, and account events." },
      { title: "SDKs & Libraries", description: "Official client libraries for Python, TypeScript, Go, and Rust." },
    ],
  },
  {
    id: "billing",
    title: "Billing & Plans",
    icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
    items: [
      { title: "Pricing Plans", description: "Compare Free, Pro, and Plus plans. What's included at each tier." },
      { title: "Managing Subscription", description: "Upgrade, downgrade, or cancel your plan. Payment methods and invoicing." },
      { title: "Usage Limits", description: "Understand token limits, request quotas, and how usage is calculated." },
      { title: "Enterprise & SSO", description: "Custom plans for teams with SAML, SCIM, and dedicated support." },
    ],
  },
];

export default function DocsPage() {
  const ref = useScrollReveal();
  const [search, setSearch] = useState("");

  const filtered = SECTIONS.map((s) => ({
    ...s,
    items: s.items.filter(
      (item) =>
        !search ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()),
    ),
  })).filter((s) => s.items.length > 0);

  return (
    <div className="min-h-screen bg-bg pt-28 pb-20" ref={ref}>
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="mb-10 text-center scroll-reveal">
          <Link to="/" className="mb-4 inline-block rounded-full border border-line bg-surface px-3 py-1 font-mono text-xs text-muted transition-colors hover:border-blue/40">
            ← Back to Home
          </Link>
          <h1 className="mb-4 font-mono text-4xl font-bold md:text-5xl">
            <span className="text-blue">Docs</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted">
            Everything you need to get the most out of Cursorline.
          </p>
        </div>

        {/* Search */}
        <div className="mb-12 max-w-md mx-auto scroll-reveal">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documentation..."
              className="w-full rounded-xl border border-line bg-surface pl-10 pr-4 py-3 text-sm text-ink placeholder-muted focus:border-blue focus:outline-none"
            />
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {filtered.map((section, si) => (
            <div key={section.id} className="scroll-reveal-up" style={{ transitionDelay: `${si * 80}ms` }}>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue/10 text-blue">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d={section.icon} />
                  </svg>
                </div>
                <h2 className="font-mono text-lg font-bold text-ink">{section.title}</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {section.items.map((item) => (
                  <div key={item.title} className="group rounded-xl border border-line bg-surface/40 p-5 backdrop-blur-sm transition-all duration-200 hover:border-line/80 hover:bg-surface/60 hover:shadow-lg hover:shadow-black/10 cursor-pointer">
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-ink group-hover:text-blue transition-colors">{item.title}</h3>
                      {item.tag && (
                        <span className="rounded-full bg-blue/10 px-2 py-0.5 text-[10px] font-medium text-blue">{item.tag}</span>
                      )}
                    </div>
                    <p className="text-xs leading-relaxed text-muted">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-muted">No results found for &quot;{search}&quot;</p>
          </div>
        )}
      </div>
    </div>
  );
}
