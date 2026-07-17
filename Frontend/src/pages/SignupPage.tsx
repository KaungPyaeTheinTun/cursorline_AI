import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useToast } from "../hooks/useAuth";
import OAuthButton from "../components/ui/OAuthButton";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signup, loginWithOAuth, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    try {
      await signup(name, email, password);
      toast("Account created! Please sign in.", "success");
      navigate("/login");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not create your account.";
      setError(msg);
      toast(msg, "error");
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    try {
      await loginWithOAuth(provider);
    } catch (e) {
      const msg = e instanceof Error ? e.message : `Could not sign up with ${provider}.`;
      setError(msg);
      toast(msg, "error");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="mb-6 inline-block font-mono text-2xl font-bold text-ink"
          >
            cursor<span className="text-blue">line</span>
          </Link>
          <h1 className="font-mono text-2xl font-bold">Create your account</h1>
          <p className="mt-2 text-sm text-muted">
            Start debugging smarter — free, no credit card.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <OAuthButton
            provider="google"
            onClick={() => handleOAuth("google")}
            disabled={isLoading}
          />
          <OAuthButton
            provider="github"
            onClick={() => handleOAuth("github")}
            disabled={isLoading}
          />
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-line" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-bg px-3 text-muted">or sign up with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red/30 bg-red/10 px-4 py-3 text-sm text-red">
              {error}
            </div>
          )}
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block font-mono text-xs font-medium text-muted"
            >
              Full name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Smith"
              autoComplete="name"
              className="w-full rounded-lg border border-line bg-surface2 px-4 py-3 text-sm text-ink placeholder-muted focus:border-blue focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block font-mono text-xs font-medium text-muted"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full rounded-lg border border-line bg-surface2 px-4 py-3 text-sm text-ink placeholder-muted focus:border-blue focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block font-mono text-xs font-medium text-muted"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              className="w-full rounded-lg border border-line bg-surface2 px-4 py-3 text-sm text-ink placeholder-muted focus:border-blue focus:outline-none"
            />
          </div>
          <div className="text-xs text-muted">
            By signing up, you agree to our{" "}
            <a href="#" className="text-blue hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue hover:underline">
              Privacy Policy
            </a>
            .
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue py-3 text-sm font-semibold text-bg transition-colors hover:bg-blue/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link to="/login" className="text-blue hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
