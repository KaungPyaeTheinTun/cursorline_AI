import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { apiClient } from "../lib/axios";
import { useToast } from "../hooks/useAuth";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const state = location.state as { email?: string; code?: string } | null;
  const email = state?.email || "";
  const code = state?.code || "";

  if (!email || !code) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg px-6 py-12">
        <div className="w-full max-w-md text-center">
          <Link
            to="/"
            className="mb-6 inline-block font-mono text-2xl font-bold text-ink"
          >
            cursor<span className="text-blue">line</span>
          </Link>
          <h1 className="font-mono text-2xl font-bold">Invalid session</h1>
          <p className="mt-2 text-sm text-muted">
            Please start the password reset process again.
          </p>
          <Link
            to="/forgot-password"
            className="mt-6 inline-block rounded-lg bg-blue px-4 py-2 text-sm font-semibold text-bg transition-colors hover:bg-blue/90"
          >
            Start Over
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("Please enter a new password.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.post("/reset-password", {
        email,
        code,
        password,
        password_confirmation: passwordConfirmation,
      });
      toast("Password reset successfully! You can now sign in.", "success");
      navigate("/login");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to reset password.";
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
          <h1 className="font-mono text-2xl font-bold">Set new password</h1>
          <p className="mt-2 text-sm text-muted">
            Choose a strong password for your account.
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
              htmlFor="password"
              className="mb-1.5 block font-mono text-xs font-medium text-muted"
            >
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              className="w-full rounded-lg border border-line bg-surface2 px-4 py-3 text-sm text-ink placeholder-muted focus:border-blue focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="password_confirmation"
              className="mb-1.5 block font-mono text-xs font-medium text-muted"
            >
              Confirm Password
            </label>
            <input
              id="password_confirmation"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              className="w-full rounded-lg border border-line bg-surface2 px-4 py-3 text-sm text-ink placeholder-muted focus:border-blue focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue py-3 text-sm font-semibold text-bg transition-colors hover:bg-blue/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
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
