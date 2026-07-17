import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiClient } from "../lib/axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.post("/forgot-password", { email });
      navigate("/verify-code", { state: { email } });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to send code.";
      setError(msg);
    } finally {
      setIsLoading(false);
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
          <h1 className="font-mono text-2xl font-bold">Forgot password?</h1>
          <p className="mt-2 text-sm text-muted">
            Enter your email and we&apos;ll send you a verification code.
          </p>
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
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue py-3 text-sm font-semibold text-bg transition-colors hover:bg-blue/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending code..." : "Send Verification Code"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-muted">
          Remember your password?{" "}
          <Link to="/login" className="text-blue hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
