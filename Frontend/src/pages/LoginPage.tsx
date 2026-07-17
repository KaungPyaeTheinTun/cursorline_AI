import { useState, useEffect, type FormEvent } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth, useToast } from "../hooks/useAuth";
import OAuthButton from "../components/ui/OAuthButton";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const { login, loginWithOAuth, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const from = (location.state as { from?: string })?.from || "/";

  useEffect(() => {
    const oauthError = searchParams.get("oauth_error");
    if (oauthError) {
      const msg = decodeURIComponent(oauthError);
      setError(msg);
      toast(msg, "error");
      window.history.replaceState({}, "", "/login");
    }
  }, [searchParams, toast]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      await login(email, password, remember);
      toast("Welcome back!", "success");
      navigate(from);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Invalid credentials.";
      setError(msg);
      toast(msg, "error");
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    try {
      await loginWithOAuth(provider);
    } catch (e) {
      const msg = e instanceof Error ? e.message : `Could not sign in with ${provider}.`;
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
          <h1 className="font-mono text-2xl font-bold">Welcome back</h1>
          <p className="mt-2 text-sm text-muted">
            Sign in to your account to continue.
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
            <span className="bg-bg px-3 text-muted">or sign in with email</span>
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
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full rounded-lg border border-line bg-surface2 px-4 py-3 text-sm text-ink placeholder-muted focus:border-blue focus:outline-none"
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-muted">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-line bg-surface2 accent-blue"
              />
              Remember me
            </label>
            <a href="/forgot-password" className="text-blue hover:underline">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue py-3 text-sm font-semibold text-bg transition-colors hover:bg-blue/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-blue hover:underline">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
