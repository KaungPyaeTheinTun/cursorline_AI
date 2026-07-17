import { Link } from "react-router-dom";
import { useScrollReveal } from "../hooks/useScrollReveal";

interface ChangelogEntry {
  readonly version: string;
  readonly date: string;
  readonly title: string;
  readonly type: "feature" | "improvement" | "fix";
  readonly description: string;
  readonly items: readonly string[];
}

const ENTRIES: readonly ChangelogEntry[] = [
  {
    version: "v0.9.0",
    date: "Jul 15, 2026",
    title: "Streaming Chat & Conversation History",
    type: "feature",
    description: "AI chat now streams responses in real-time with database-backed conversation persistence.",
    items: [
      "Token-by-token streaming via Groq API with SSE",
      "Conversation history saved to database",
      "Resume any previous conversation from the sidebar",
      "Collapsible sidebar with animated tooltips",
      "Markdown rendering with syntax-highlighted code blocks",
    ],
  },
  {
    version: "v0.8.0",
    date: "Jul 1, 2026",
    title: "OAuth & Social Login",
    type: "feature",
    description: "Sign in with Google and GitHub. One-click account creation with automatic profile sync.",
    items: [
      "Google OAuth 2.0 integration",
      "GitHub OAuth integration",
      "Unified account linking across providers",
      "Custom OAuth callback error handling",
    ],
  },
  {
    version: "v0.7.0",
    date: "Jun 20, 2026",
    title: "Stripe Payments & Subscriptions",
    type: "feature",
    description: "Full payment integration with dynamic pricing and subscription management.",
    items: [
      "Stripe Checkout Sessions with dynamic pricing",
      "Subscription status tracking via subscribed_at",
      "Payment success/cancel flow with user data refresh",
      "Pro and Plus plan tiers",
    ],
  },
  {
    version: "v0.6.0",
    date: "Jun 10, 2026",
    title: "Admin Dashboard & FAQ System",
    type: "feature",
    description: "Admin panel with FAQ management, role-based access, and profile settings.",
    items: [
      "Admin dashboard with overview cards",
      "Full CRUD for FAQ entries",
      "Role-based access control (admin/user)",
      "Collapsible admin sidebar",
      "Profile editing and account details",
    ],
  },
  {
    version: "v0.5.0",
    date: "May 28, 2026",
    title: "Auth System & Password Reset",
    type: "feature",
    description: "Complete authentication with email/password, remember me, and 3-step password reset.",
    items: [
      "Email/password registration and login",
      "Remember me with localStorage vs sessionStorage",
      "3-step password reset: email → verification code → new password",
      "HTML email templates for reset codes",
      "Protected routes with redirect-after-login",
    ],
  },
  {
    version: "v0.4.1",
    date: "May 15, 2026",
    title: "Performance & Stability",
    type: "improvement",
    description: "Major performance optimizations across the frontend and backend.",
    items: [
      "React.memo on all chat message components",
      "Throttled scroll-to-bottom (100ms)",
      "Axios interceptors replacing raw fetch",
      "Zustand stores replacing React Context",
      "N-tier Service/Repository architecture",
    ],
  },
  {
    version: "v0.4.0",
    date: "May 5, 2026",
    title: "N-Tier Architecture Migration",
    type: "improvement",
    description: "Backend refactored with Contract → Repository → Service → Controller pattern.",
    items: [
      "Service and Repository interfaces",
      "Dependency injection via RepositoryServiceProvider",
      "Separated business logic from controllers",
      "Custom AuthenticateToken middleware",
    ],
  },
  {
    version: "v0.3.0",
    date: "Apr 20, 2026",
    title: "Landing Page & Design System",
    type: "feature",
    description: "Complete landing page with dark code-editor aesthetic and scroll animations.",
    items: [
      "Hero with Lightfall WebGL background",
      "Animated terminal demo with auto-cycling conversations",
      "Logo marquee with 12 tech icons",
      "Scroll-reveal animations with staggered delays",
      "Floating bottom navbar with scroll behavior",
    ],
  },
  {
    version: "v0.2.0",
    date: "Apr 5, 2026",
    title: "Backend API Foundation",
    type: "feature",
    description: "Laravel 9 REST API with Sanctum authentication and Groq AI integration.",
    items: [
      "Laravel 9 API with Sanctum token auth",
      "Groq API integration with llama-3.3-70b-versatile",
      "User registration, login, and logout endpoints",
      "CORS configuration for frontend",
    ],
  },
  {
    version: "v0.1.0",
    date: "Mar 20, 2026",
    title: "Project Kickoff",
    type: "feature",
    description: "Initial project setup with React + TypeScript + Vite frontend and Laravel backend.",
    items: [
      "React 18 + TypeScript + Vite scaffolding",
      "Tailwind CSS with custom design tokens",
      "Laravel 9 project initialization",
      "XAMPP development environment setup",
    ],
  },
];

const TYPE_STYLES = {
  feature: { bg: "bg-blue/10", text: "text-blue", label: "Feature" },
  improvement: { bg: "bg-green/10", text: "text-green", label: "Improvement" },
  fix: { bg: "bg-orange/10", text: "text-orange", label: "Fix" },
} as const;

export default function ChangeLogPage() {
  const ref = useScrollReveal();

  return (
    <div className="min-h-screen bg-bg pt-28 pb-20" ref={ref}>
      <div className="mx-auto max-w-3xl px-6">
        {/* Header */}
        <div className="mb-12 text-center scroll-reveal">
          <Link to="/" className="mb-4 inline-block rounded-full border border-line bg-surface px-3 py-1 font-mono text-xs text-muted transition-colors hover:border-blue/40">
            ← Back to Home
          </Link>
          <h1 className="mb-4 font-mono text-4xl font-bold md:text-5xl">
            <span className="text-blue">Changelog</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted">
            A record of every feature, improvement, and fix shipped in Cursorline.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-[15px] top-0 bottom-0 w-px bg-line" />

          {ENTRIES.map((entry, i) => {
            const style = TYPE_STYLES[entry.type];
            return (
              <div
                key={entry.version}
                className="scroll-reveal-up relative mb-10 pl-10"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                {/* Dot */}
                <div className="absolute left-0 top-1 z-10">
                  <span className="block h-[10px] w-[10px] rounded-full border-2 border-bg bg-blue" />
                </div>

                <div className="rounded-xl border border-line bg-surface/40 p-5 backdrop-blur-sm transition-all duration-200 hover:border-line/80 hover:bg-surface/60">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-ink">{entry.version}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${style.bg} ${style.text}`}>
                      {style.label}
                    </span>
                    <span className="text-xs text-muted">{entry.date}</span>
                  </div>
                  <h3 className="mb-1 font-mono text-base font-bold text-ink">{entry.title}</h3>
                  <p className="mb-3 text-sm text-muted">{entry.description}</p>
                  <ul className="space-y-1">
                    {entry.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-blue/50" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
