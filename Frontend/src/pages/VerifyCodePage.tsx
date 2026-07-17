import { useState, useRef, type FormEvent, type KeyboardEvent, type ClipboardEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { apiClient } from "../lib/axios";

const CODE_LENGTH = 6;

export default function VerifyCodePage() {
  const [code, setCode] = useState<string[]>(new Array(CODE_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email || "";

  if (!email) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg px-6 py-12">
        <div className="w-full max-w-md text-center">
          <Link
            to="/"
            className="mb-6 inline-block font-mono text-2xl font-bold text-ink"
          >
            cursor<span className="text-blue">line</span>
          </Link>
          <h1 className="font-mono text-2xl font-bold">No email provided</h1>
          <p className="mt-2 text-sm text-muted">
            Please start from the forgot password page.
          </p>
          <Link
            to="/forgot-password"
            className="mt-6 inline-block rounded-lg bg-blue px-4 py-2 text-sm font-semibold text-bg transition-colors hover:bg-blue/90"
          >
            Go to Forgot Password
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError("");

    if (value && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (!pasted) return;

    const newCode = [...code];
    for (let i = 0; i < pasted.length; i++) {
      newCode[i] = pasted[i]!;
    }
    setCode(newCode);

    const nextEmpty = newCode.findIndex((c) => !c);
    const focusIndex = nextEmpty === -1 ? CODE_LENGTH - 1 : nextEmpty;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const codeStr = code.join("");
    if (codeStr.length !== CODE_LENGTH) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.post("/verify-code", { email, code: codeStr });
      navigate("/reset-password", { state: { email, code: codeStr } });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Invalid code.";
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
          <h1 className="font-mono text-2xl font-bold">Check your email</h1>
          <p className="mt-2 text-sm text-muted">
            We sent a 6-digit code to{" "}
            <span className="text-ink font-medium">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg border border-red/30 bg-red/10 px-4 py-3 text-sm text-red">
              {error}
            </div>
          )}

          <div className="flex justify-center gap-3">
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                className="h-14 w-12 rounded-lg border border-line bg-surface2 text-center font-mono text-xl text-ink focus:border-blue focus:outline-none transition-colors"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue py-3 text-sm font-semibold text-bg transition-colors hover:bg-blue/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-muted">
          Didn&apos;t receive a code?{" "}
          <button
            onClick={async () => {
              try {
                await apiClient.post("/forgot-password", { email });
              } catch {
                // silent
              }
            }}
            className="text-blue hover:underline"
          >
            Resend
          </button>
        </p>
      </div>
    </div>
  );
}
