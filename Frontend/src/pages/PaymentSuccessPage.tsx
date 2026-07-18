import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { apiClient } from "../lib/axios";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [details, setDetails] = useState<{
    email?: string;
    plan?: string;
  }>({});
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setStatus("error");
      setErrorMessage("No session ID found in the URL.");
      return;
    }

    apiClient.get(`/payment/success?session_id=${sessionId}`)
      .then(async ({ data: result }) => {
        if (result.status === "complete" || result.status === "open") {
          await refreshUser();
          setStatus("success");
          setDetails({
            email: result.customer_email,
            plan: result.plan,
          });
        } else {
          setStatus("error");
          setErrorMessage(`Payment status: ${result.status || "unknown"}. Please try again.`);
        }
      })
      .catch((err) => {
        setStatus("error");
        setErrorMessage(err.message || "We couldn't confirm your payment. If you were charged, please contact support.");
      });
  }, [searchParams, refreshUser]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="max-w-md text-center">
        {status === "loading" && (
          <>
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-line border-t-blue" />
            <p className="text-muted">Confirming your payment...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green/20">
              <span className="text-3xl text-green">✓</span>
            </div>
            <h1 className="mb-2 font-mono text-2xl font-bold">
              Payment Successful!
            </h1>
            <p className="mb-8 text-muted">
              Thank you for subscribing to Cursorline{" "}
              {details.plan === "plus" ? "Plus" : "Pro"}. A confirmation email
              has been sent to{" "}
              <span className="text-ink">{details.email}</span>.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                to="/"
                className="rounded-lg border border-line px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface2"
              >
                Back to Home
              </Link>
              <Link
                to="/build"
                className="rounded-lg bg-blue px-6 py-3 text-sm font-semibold text-bg transition-colors hover:bg-blue/90"
              >
                Start Building →
              </Link>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red/20">
              <span className="text-3xl text-red">✕</span>
            </div>
            <h1 className="mb-2 font-mono text-2xl font-bold">
              Payment Issue
            </h1>
            <p className="mb-8 text-muted">
              {errorMessage || "We couldn't confirm your payment. If you were charged, please contact support."}
            </p>
            <Link
              to="/"
              className="inline-block rounded-lg bg-blue px-6 py-3 text-sm font-semibold text-bg transition-colors hover:bg-blue/90"
            >
              Back to Home
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
