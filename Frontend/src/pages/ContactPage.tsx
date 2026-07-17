import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "../hooks/useScrollReveal";

const CONTACT_METHODS = [
  { label: "Email", value: "hello@cursorline.dev", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { label: "Twitter / X", value: "@cursorline", icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
  { label: "GitHub", value: "cursorline/cursorline", icon: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" },
];

const REASONS = [
  { title: "General Inquiry", description: "Questions about Cursorline, partnerships, or press." },
  { title: "Bug Report", description: "Found something broken? Tell us so we can fix it." },
  { title: "Feature Request", description: "Have an idea that would make Cursorline better for you?" },
  { title: "Enterprise", description: "Need SSO, self-hosting, or a custom plan for your team?" },
];

export default function ContactPage() {
  const ref = useScrollReveal();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-bg pt-28 pb-20" ref={ref}>
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="mb-14 text-center scroll-reveal">
          <Link to="/" className="mb-4 inline-block rounded-full border border-line bg-surface px-3 py-1 font-mono text-xs text-muted transition-colors hover:border-blue/40">
            ← Back to Home
          </Link>
          <h1 className="mb-4 font-mono text-4xl font-bold md:text-5xl">
            <span className="text-blue">Contact</span> Us
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted">
            Have a question, idea, or just want to say hi? We'd love to hear from you.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-5">
          {/* Contact methods + reasons */}
          <div className="md:col-span-2 scroll-reveal">
            <h2 className="mb-4 font-mono text-sm font-bold text-ink">Reach Us</h2>
            <div className="space-y-3 mb-8">
              {CONTACT_METHODS.map((method) => (
                <div key={method.label} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface2 text-muted">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d={method.icon} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-muted">{method.label}</p>
                    <p className="text-sm text-ink">{method.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="mb-4 font-mono text-sm font-bold text-ink">What can we help with?</h2>
            <div className="space-y-2">
              {REASONS.map((r) => (
                <button
                  key={r.title}
                  onClick={() => setReason(r.title)}
                  className={`w-full rounded-lg border p-3 text-left transition-all ${
                    reason === r.title
                      ? "border-blue bg-blue/5"
                      : "border-line bg-surface/40 hover:border-line/80"
                  }`}
                >
                  <p className="text-sm font-medium text-ink">{r.title}</p>
                  <p className="text-xs text-muted">{r.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3 scroll-reveal-up">
            {submitted ? (
              <div className="rounded-xl border border-green/30 bg-green/5 p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green/20">
                  <span className="text-3xl text-green">✓</span>
                </div>
                <h3 className="mb-2 font-mono text-lg font-bold text-ink">Message Sent!</h3>
                <p className="mb-5 text-sm text-muted">
                  Thanks for reaching out. We typically respond within 24 hours.
                </p>
                <Link to="/" className="inline-block rounded-lg bg-blue px-6 py-3 text-sm font-semibold text-bg transition-colors hover:bg-blue/90">
                  Back to Home
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-xl border border-line bg-surface/40 p-6 backdrop-blur-sm">
                <h2 className="mb-5 font-mono text-lg font-bold text-ink">Send a Message</h2>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block font-mono text-xs font-medium text-muted">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Your name"
                      className="w-full rounded-lg border border-line bg-surface2 px-4 py-3 text-sm text-ink placeholder-muted focus:border-blue focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block font-mono text-xs font-medium text-muted">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-line bg-surface2 px-4 py-3 text-sm text-ink placeholder-muted focus:border-blue focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block font-mono text-xs font-medium text-muted">Subject</label>
                    <select
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      required
                      className="w-full rounded-lg border border-line bg-surface2 px-4 py-3 text-sm text-ink focus:border-blue focus:outline-none"
                    >
                      <option value="">Select a reason...</option>
                      {REASONS.map((r) => (
                        <option key={r.title} value={r.title}>{r.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block font-mono text-xs font-medium text-muted">Message</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={5}
                      placeholder="Tell us what's on your mind..."
                      className="w-full resize-none rounded-lg border border-line bg-surface2 px-4 py-3 text-sm text-ink placeholder-muted focus:border-blue focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-blue py-3 text-sm font-semibold text-bg transition-colors hover:bg-blue/90"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
