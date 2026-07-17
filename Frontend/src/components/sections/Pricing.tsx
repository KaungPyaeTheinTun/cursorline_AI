import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useToast } from "../../hooks/useAuth";
import { useCheckout } from "../../hooks/useCheckout";
import { usePlans } from "../../hooks/usePlans";
import type { PricingTier } from "../../types";

export default function Pricing() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { startCheckout } = useCheckout();
  const { plans, loading } = usePlans();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const tiers: PricingTier[] = useMemo(() =>
    plans.map((p) => ({
      name: p.name,
      price: p.price === 0 ? "$0" : `$${Math.floor(p.price / 100)}`,
      period: p.price === 0 ? "forever" : `/${p.period}`,
      description: p.description ?? "",
      features: p.features ?? [],
      cta: p.cta,
      highlighted: p.highlighted,
      plan: p.slug,
    })),
    [plans],
  );

  const handleCheckout = useCallback(
    async (plan: string) => {
      if (!user) {
        toast("Please sign in to subscribe.", "info");
        navigate("/login");
        return;
      }

      setLoadingPlan(plan);
      try {
        if (plan === "free") {
          const { apiClient } = await import("../../lib/axios");
          await apiClient.post("/subscribe/free");
          toast("Free plan activated!", "success");
          window.location.reload();
        } else {
          await startCheckout(plan);
        }
      } catch (e) {
        const msg =
          e instanceof Error ? e.message : "Failed to start checkout.";
        toast(msg, "error");
        setLoadingPlan(null);
      }
    },
    [user, navigate, toast, startCheckout],
  );

  return (
    <section id="pricing" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mx-auto max-w-xl text-muted">
            Start free, upgrade when you need more. No hidden fees, no surprises.
          </p>
        </div>
        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-line bg-surface p-6 animate-shimmer">
                <div className="mb-1 h-5 w-16 rounded bg-surface2" />
                <div className="mb-2 flex items-baseline gap-1">
                  <div className="h-8 w-16 rounded bg-surface2" />
                  <div className="h-4 w-12 rounded bg-surface2" />
                </div>
                <div className="mb-6 h-4 w-full rounded bg-surface2" />
                <div className="space-y-2 mb-6">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-4 rounded bg-surface2" style={{ width: `${60 + Math.random() * 30}%` }} />
                  ))}
                </div>
                <div className="h-12 rounded-lg bg-surface2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {tiers.map((tier, i) => (
              <div
                key={tier.name}
                className={`relative flex flex-col rounded-xl border p-6 transition-all duration-200 hover:-translate-y-1 ${
                  tier.highlighted
                    ? "border-blue bg-surface shadow-lg shadow-blue/10 hover:shadow-xl hover:shadow-blue/15"
                    : "border-line bg-surface hover:border-line/80 hover:shadow-lg hover:shadow-black/10"
                }`}
                style={{ animationDelay: `${i * 120}ms` }}
              >
                {tier.highlighted && (
                  <span className="absolute -top-3 left-6 rounded-full bg-blue px-3 py-0.5 font-mono text-xs font-semibold text-bg">
                    Most Popular
                  </span>
                )}
                <h3 className="mb-1 font-mono text-lg font-bold">{tier.name}</h3>
                <div className="mb-2 flex items-baseline gap-1">
                  <span className="font-mono text-3xl font-bold">
                    {tier.price}
                  </span>
                  <span className="text-sm text-muted">{tier.period}</span>
                </div>
                <p className="mb-6 text-sm text-muted">{tier.description}</p>
                <ul className="mb-6 flex-1 space-y-2">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-muted"
                    >
                      <span className="mt-0.5 text-green" aria-hidden="true">
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              <button
                onClick={() => handleCheckout(tier.plan)}
                disabled={loadingPlan !== null}
                className={`block w-full rounded-lg py-3 text-center text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  tier.highlighted
                    ? "bg-blue text-bg hover:bg-blue/90"
                    : "border border-line text-ink hover:bg-surface2"
                }`}
              >
                {loadingPlan === tier.plan
                  ? "Redirecting..."
                  : tier.cta}
              </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
