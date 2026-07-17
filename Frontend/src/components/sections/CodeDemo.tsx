import { useScrollReveal } from "../../hooks/useScrollReveal";

const BEFORE_LINES = [
  { type: "keyword", text: "import" },
  { type: "plain", text: " { getUser, getPosts, getSettings } " },
  { type: "keyword", text: "from" },
  { type: "string", text: " './api'" },
  { type: "plain", text: ";" },
  { type: "indent", text: "\n" },
  { type: "keyword", text: "import" },
  { type: "plain", text: " { cache } " },
  { type: "keyword", text: "from" },
  { type: "string", text: " './cache'" },
  { type: "plain", text: ";" },
  { type: "indent", text: "\n\n" },
  { type: "comment", text: "// Types" },
  { type: "indent", text: "\n" },
  { type: "keyword", text: "interface" },
  { type: "plain", text: " " },
  { type: "func", text: "UserProfile" },
  { type: "plain", text: " {" },
  { type: "indent", text: "\n  " },
  { type: "prop", text: "id" },
  { type: "plain", text: ": " },
  { type: "keyword", text: "string" },
  { type: "plain", text: ";" },
  { type: "indent", text: "\n  " },
  { type: "prop", text: "email" },
  { type: "plain", text: ": " },
  { type: "keyword", text: "string" },
  { type: "plain", text: ";" },
  { type: "indent", text: "\n  " },
  { type: "prop", text: "profile" },
  { type: "plain", text: ": { " },
  { type: "prop", text: "settings" },
  { type: "plain", text: ": " },
  { type: "func", text: "UserSettings" },
  { type: "plain", text: "; };" },
  { type: "indent", text: "\n}" },
  { type: "indent", text: "\n\n" },
  { type: "comment", text: "/**" },
  { type: "indent", text: "\n" },
  { type: "comment", text: " * Fetches the full user profile including" },
  { type: "indent", text: "\n" },
  { type: "comment", text: " * settings and recent posts for the dashboard." },
  { type: "indent", text: "\n" },
  { type: "comment", text: " */" },
  { type: "indent", text: "\n" },
  { type: "keyword", text: "export async function" },
  { type: "plain", text: " " },
  { type: "func", text: "getUserProfile" },
  { type: "plain", text: "(" },
  { type: "prop", text: "userId" },
  { type: "plain", text: ": " },
  { type: "keyword", text: "string" },
  { type: "plain", text: ") {" },
  { type: "indent", text: "\n  " },
  { type: "keyword", text: "const" },
  { type: "plain", text: " cached = cache.get(" },
  { type: "string", text: "`user:${userId}`" },
  { type: "plain", text: ");" },
  { type: "indent", text: "\n  " },
  { type: "keyword", text: "if" },
  { type: "plain", text: " (cached) " },
  { type: "keyword", text: "return" },
  { type: "plain", text: " cached;" },
  { type: "indent", text: "\n\n  " },
  { type: "keyword", text: "const" },
  { type: "plain", text: " user = " },
  { type: "keyword", text: "await" },
  { type: "plain", text: " " },
  { type: "func", text: "getUser" },
  { type: "plain", text: "(userId);" },
  { type: "indent", text: "\n\n  " },
  { type: "comment", text: "// BUG: user can be null when session" },
  { type: "indent", text: "\n  " },
  { type: "comment", text: "// expires — causes TypeError below" },
  { type: "indent", text: "\n  " },
  { type: "keyword", text: "const" },
  { type: "plain", text: " posts = " },
  { type: "keyword", text: "await" },
  { type: "plain", text: " " },
  { type: "func", text: "getPosts" },
  { type: "plain", text: "(user." },
  { type: "prop", text: "id" },
  { type: "plain", text: ");" },
  { type: "indent", text: "\n  " },
  { type: "keyword", text: "const" },
  { type: "plain", text: " settings = " },
  { type: "keyword", text: "await" },
  { type: "plain", text: " " },
  { type: "func", text: "getSettings" },
  { type: "plain", text: "(user." },
  { type: "prop", text: "id" },
  { type: "plain", text: ");" },
  { type: "indent", text: "\n\n  " },
  { type: "keyword", text: "const" },
  { type: "plain", text: " result = { " },
  { type: "plain", text: "...user, posts, settings };" },
  { type: "indent", text: "\n  " },
  { type: "func", text: "cache" },
  { type: "plain", text: ".set(" },
  { type: "string", text: "`user:${userId}`" },
  { type: "plain", text: ", result, " },
  { type: "string", text: "3600" },
  { type: "plain", text: ");" },
  { type: "indent", text: "\n  " },
  { type: "keyword", text: "return" },
  { type: "plain", text: " result;" },
  { type: "indent", text: "\n}" },
];

const AFTER_LINES = [
  { type: "keyword", text: "import" },
  { type: "plain", text: " { getUser, getPosts, getSettings } " },
  { type: "keyword", text: "from" },
  { type: "string", text: " './api'" },
  { type: "plain", text: ";" },
  { type: "indent", text: "\n" },
  { type: "keyword", text: "import" },
  { type: "plain", text: " { cache } " },
  { type: "keyword", text: "from" },
  { type: "string", text: " './cache'" },
  { type: "plain", text: ";" },
  { type: "indent", text: "\n" },
  { type: "keyword", text: "import" },
  { type: "plain", text: " { logger } " },
  { type: "keyword", text: "from" },
  { type: "string", text: " './logger'" },
  { type: "plain", text: ";" },
  { type: "indent", text: "\n\n" },
  { type: "comment", text: "// Types" },
  { type: "indent", text: "\n" },
  { type: "keyword", text: "interface" },
  { type: "plain", text: " " },
  { type: "func", text: "UserProfile" },
  { type: "plain", text: " {" },
  { type: "indent", text: "\n  " },
  { type: "prop", text: "id" },
  { type: "plain", text: ": " },
  { type: "keyword", text: "string" },
  { type: "plain", text: ";" },
  { type: "indent", text: "\n  " },
  { type: "prop", text: "email" },
  { type: "plain", text: ": " },
  { type: "keyword", text: "string" },
  { type: "plain", text: ";" },
  { type: "indent", text: "\n  " },
  { type: "prop", text: "profile" },
  { type: "plain", text: ": { " },
  { type: "prop", text: "settings" },
  { type: "plain", text: ": " },
  { type: "func", text: "UserSettings" },
  { type: "plain", text: "; };" },
  { type: "indent", text: "\n}" },
  { type: "indent", text: "\n\n" },
  { type: "comment", text: "/**" },
  { type: "indent", text: "\n" },
  { type: "comment", text: " * Fetches the full user profile including" },
  { type: "indent", text: "\n" },
  { type: "comment", text: " * settings and recent posts for the dashboard." },
  { type: "indent", text: "\n" },
  { type: "comment", text: " * @throws {Error} If the user ID is invalid" },
  { type: "indent", text: "\n" },
  { type: "comment", text: " */" },
  { type: "indent", text: "\n" },
  { type: "keyword", text: "export async function" },
  { type: "plain", text: " " },
  { type: "func", text: "getUserProfile" },
  { type: "plain", text: "(" },
  { type: "prop", text: "userId" },
  { type: "plain", text: ": " },
  { type: "keyword", text: "string" },
  { type: "plain", text: ") {" },
  { type: "indent", text: "\n  " },
  { type: "keyword", text: "const" },
  { type: "plain", text: " cached = cache.get(" },
  { type: "string", text: "`user:${userId}`" },
  { type: "plain", text: ");" },
  { type: "indent", text: "\n  " },
  { type: "keyword", text: "if" },
  { type: "plain", text: " (cached) " },
  { type: "keyword", text: "return" },
  { type: "plain", text: " cached;" },
  { type: "indent", text: "\n\n  " },
  { type: "keyword", text: "const" },
  { type: "plain", text: " user = " },
  { type: "keyword", text: "await" },
  { type: "plain", text: " " },
  { type: "func", text: "getUser" },
  { type: "plain", text: "(userId);" },
  { type: "indent", text: "\n\n  " },
  { type: "comment", text: "// FIX: guard against null / expired session" },
  { type: "indent", text: "\n  " },
  { type: "keyword", text: "if" },
  { type: "plain", text: " (!user) {" },
  { type: "indent", text: "\n    " },
  { type: "func", text: "logger" },
  { type: "plain", text: ".warn(" },
  { type: "string", text: "`User not found: ${userId}`" },
  { type: "plain", text: ");" },
  { type: "indent", text: "\n    " },
  { type: "keyword", text: "return" },
  { type: "plain", text: " " },
  { type: "keyword", text: "null" },
  { type: "plain", text: ";" },
  { type: "indent", text: "\n  }" },
  { type: "indent", text: "\n\n  " },
  { type: "keyword", text: "const" },
  { type: "plain", text: " [posts, settings] = " },
  { type: "keyword", text: "await" },
  { type: "plain", text: " Promise.all([" },
  { type: "indent", text: "\n    " },
  { type: "func", text: "getPosts" },
  { type: "plain", text: "(user." },
  { type: "prop", text: "id" },
  { type: "plain", text: ")," },
  { type: "indent", text: "\n    " },
  { type: "func", text: "getSettings" },
  { type: "plain", text: "(user." },
  { type: "prop", text: "id" },
  { type: "plain", text: ")," },
  { type: "indent", text: "\n  ]);" },
  { type: "indent", text: "\n\n  " },
  { type: "keyword", text: "const" },
  { type: "plain", text: " result = { " },
  { type: "plain", text: "...user, posts, settings };" },
  { type: "indent", text: "\n  " },
  { type: "func", text: "cache" },
  { type: "plain", text: ".set(" },
  { type: "string", text: "`user:${userId}`" },
  { type: "plain", text: ", result, " },
  { type: "string", text: "3600" },
  { type: "plain", text: ");" },
  { type: "indent", text: "\n  " },
  { type: "keyword", text: "return" },
  { type: "plain", text: " result;" },
  { type: "indent", text: "\n}" },
];

function colorForType(type: string): string {
  switch (type) {
    case "keyword":
      return "text-purple";
    case "string":
      return "text-green";
    case "comment":
      return "text-muted";
    case "func":
      return "text-blue";
    case "prop":
      return "text-orange";
    default:
      return "text-ink";
  }
}

function CodePanel({
  title,
  lines,
  variant,
}: {
  title: string;
  lines: typeof BEFORE_LINES;
  variant: "before" | "after";
}) {
  return (
    <div className="flex-1 rounded-xl border border-line bg-surface overflow-hidden transition-all duration-200 hover:border-line/80 hover:shadow-xl hover:shadow-black/20">
      <div className="flex items-center gap-2 border-b border-line px-4 py-2">
        <span
          className={`h-2 w-2 rounded-full ${
            variant === "before" ? "bg-red" : "bg-green"
          }`}
        />
        <span className="font-mono text-xs text-muted">{title}</span>
      </div>
      <pre className="p-4 font-mono text-xs leading-relaxed overflow-x-auto">
        <code>
          {lines.map((token, i) => (
            <span key={i} className={colorForType(token.type)}>
              {token.text}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

export default function CodeDemo() {
  const ref = useScrollReveal();

  return (
    <section id="demo" className="py-20 md:py-28" ref={ref}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center scroll-reveal">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            See a real fix, in context
          </h2>
          <p className="mx-auto max-w-xl text-muted">
            Cursorline traced a <code className="text-red font-mono text-sm">TypeError</code> across
            three files and suggested the minimal safe fix.
          </p>
        </div>
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="scroll-reveal-left flex-1" style={{ transitionDelay: "0ms" }}>
            <CodePanel title="Before" lines={BEFORE_LINES} variant="before" />
          </div>
          <div className="scroll-reveal-right flex-1" style={{ transitionDelay: "150ms" }}>
            <CodePanel title="After" lines={AFTER_LINES} variant="after" />
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-muted italic scroll-reveal">
          Reasoning:{" "}
          <span className="text-ink">
            getUser() can return null when the Redis session expires. The null-guard prevents the
            TypeError at line 17. Additionally, posts and settings are now fetched in parallel with
            Promise.all for better performance.
          </span>
        </p>
      </div>
    </section>
  );
}
