import { Link } from "react-router-dom";

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface2">
          <span className="text-3xl text-muted">⊘</span>
        </div>
        <h1 className="mb-2 font-mono text-2xl font-bold">
          Payment Cancelled
        </h1>
        <p className="mb-6 text-muted">
          No worries — you haven't been charged. You can try again anytime.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to="/#pricing"
            className="inline-block rounded-lg border border-line px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface2"
          >
            View Plans
          </Link>
          <Link
            to="/"
            className="inline-block rounded-lg bg-blue px-6 py-3 text-sm font-semibold text-bg transition-colors hover:bg-blue/90"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
