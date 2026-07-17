import { Link } from "react-router-dom";
import { useScrollReveal } from "../hooks/useScrollReveal";

interface BlogPost {
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly date: string;
  readonly readTime: string;
  readonly category: string;
  readonly featured?: boolean;
}

const POSTS: readonly BlogPost[] = [
  {
    slug: "why-repo-indexing-matters",
    title: "Why Repo-Level Context Changes Everything for AI Coding",
    excerpt:
      "Most AI code assistants only see the file you have open. We built Cursorline to index your entire repository so every suggestion is informed by your full codebase.",
    date: "Jul 10, 2026",
    readTime: "6 min read",
    category: "Product",
    featured: true,
  },
  {
    slug: "groq-inference-deep-dive",
    title: "How We Use Groq for Real-Time Streaming AI Responses",
    excerpt:
      "Latency matters when you're coding. Here's why we chose Groq's LPU inference engine and how we stream responses token-by-token for instant feedback.",
    date: "Jul 3, 2026",
    readTime: "8 min read",
    category: "Engineering",
  },
  {
    slug: "building-auth-with-laravel-sanctum",
    title: "Building Secure Auth with Laravel 9 and Sanctum",
    excerpt:
      "A practical guide to setting up token-based authentication, custom middleware, and OAuth flows in a Laravel 9 API — the way we built it for Cursorline.",
    date: "Jun 25, 2026",
    readTime: "10 min read",
    category: "Tutorial",
  },
  {
    slug: "react-typescript-landing-page",
    title: "Building a Dark-Mode SaaS Landing Page with React & TypeScript",
    excerpt:
      "From zero to a fully animated, scroll-revealing landing page. We share our component architecture, design tokens, and animation patterns.",
    date: "Jun 18, 2026",
    readTime: "7 min read",
    category: "Frontend",
  },
  {
    slug: "n-tier-architecture-explained",
    title: "N-Tier Architecture: Service & Repository Patterns in PHP",
    excerpt:
      "Why we separated our Laravel controllers into Services and Repositories, how dependency injection ties it together, and when you should consider this pattern.",
    date: "Jun 10, 2026",
    readTime: "9 min read",
    category: "Backend",
  },
  {
    slug: "roadmap-2026",
    title: "Cursorline Roadmap: What's Coming in 2026",
    excerpt:
      "IDE extensions, multi-model support, team workspaces, and autonomous agents — here's our vision for the rest of the year.",
    date: "Jun 1, 2026",
    readTime: "5 min read",
    category: "Product",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Product: "bg-blue/10 text-blue border-blue/30",
  Engineering: "bg-green/10 text-green border-green/30",
  Tutorial: "bg-[#f0a]/10 text-[#f0a] border-[#f0a]/30",
  Frontend: "bg-purple/10 text-purple border-purple/30",
  Backend: "bg-orange/10 text-orange border-orange/30",
};

function PostCard({ post, index }: { readonly post: BlogPost; readonly index: number }) {
  const colors = CATEGORY_COLORS[post.category] ?? "bg-muted/10 text-muted border-line";

  if (post.featured) {
    return (
      <Link
        to={`/blog/${post.slug}`}
        className="scroll-reveal-up group block rounded-xl border border-blue/30 bg-surface/60 p-8 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue/5"
        style={{ transitionDelay: `${index * 80}ms` }}
      >
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors}`}>
            {post.category}
          </span>
          <span className="text-xs text-muted">{post.date}</span>
          <span className="text-xs text-muted">·</span>
          <span className="text-xs text-muted">{post.readTime}</span>
        </div>
        <h2 className="mb-3 font-mono text-xl font-bold text-ink transition-colors group-hover:text-blue md:text-2xl">
          {post.title}
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-muted">
          {post.excerpt}
        </p>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-blue transition-colors group-hover:gap-2">
          Read more
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      </Link>
    );
  }

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="scroll-reveal-up group block rounded-xl border border-line bg-surface/40 p-6 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-line/80 hover:shadow-lg hover:shadow-black/10"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors}`}>
          {post.category}
        </span>
        <span className="text-xs text-muted">{post.date}</span>
        <span className="text-xs text-muted">·</span>
        <span className="text-xs text-muted">{post.readTime}</span>
      </div>
      <h3 className="mb-2 font-mono text-base font-bold text-ink transition-colors group-hover:text-blue">
        {post.title}
      </h3>
      <p className="text-sm leading-relaxed text-muted line-clamp-2">
        {post.excerpt}
      </p>
    </Link>
  );
}

export default function BlogPage() {
  const ref = useScrollReveal();

  return (
    <div className="min-h-screen bg-bg pt-28 pb-20" ref={ref}>
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="mb-12 text-center scroll-reveal">
          <Link
            to="/"
            className="mb-4 inline-block rounded-full border border-line bg-surface px-3 py-1 font-mono text-xs text-muted transition-colors hover:border-blue/40"
          >
            ← Back to Home
          </Link>
          <h1 className="mb-4 font-mono text-4xl font-bold md:text-5xl">
            The <span className="text-blue">Blog</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted">
            Engineering deep dives, product updates, and tutorials from the Cursorline team.
          </p>
        </div>

        {/* Featured */}
        <div className="mb-10">
          {POSTS.filter((p) => p.featured).map((post, i) => (
            <PostCard key={post.slug} post={post} index={i} />
          ))}
        </div>

        {/* All posts */}
        <div className="grid gap-6 md:grid-cols-2">
          {POSTS.filter((p) => !p.featured).map((post, i) => (
            <PostCard key={post.slug} post={post} index={i + 1} />
          ))}
        </div>

        {/* Coming soon */}
        <div className="mt-16 text-center scroll-reveal">
          <div className="mx-auto max-w-md rounded-xl border border-line bg-surface/60 p-8 backdrop-blur-sm">
            <h3 className="mb-2 font-mono text-lg font-bold">More coming soon</h3>
            <p className="mb-5 text-sm text-muted">
              We publish regularly. Follow us for the latest posts.
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
