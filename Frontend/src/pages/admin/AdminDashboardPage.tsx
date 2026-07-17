import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import { apiClient } from "../../lib/axios";
import ResponsiveDataTable, { type Column } from "../../components/ui/ResponsiveDataTable";

interface SubscribedUser {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly subscribed_at: string;
  readonly plan_id: number | null;
  readonly plan: { readonly name: string; readonly slug: string } | null;
  readonly created_at: string;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true });
}

const SUBSCRIBER_COLUMNS: Column<SubscribedUser>[] = [
  {
    key: "index",
    label: "#",
    render: (_u, i) => <span className="font-mono text-xs text-muted">{i + 1}</span>,
  },
  {
    key: "name",
    label: "Name",
    className: "font-medium text-ink",
  },
  {
    key: "email",
    label: "Email",
    className: "text-muted",
  },
  {
    key: "plan",
    label: "Plan",
    render: (u) => (
      <span className="inline-flex items-center rounded-full bg-blue/10 px-2.5 py-0.5 text-xs font-medium text-blue">
        {u.plan?.name ?? "N/A"}
      </span>
    ),
  },
  {
    key: "subscribed_at",
    label: "Subscribed",
    render: (u) => <span className="text-muted">{formatDate(u.subscribed_at)}</span>,
  },
  {
    key: "created_at",
    label: "Joined",
    render: (u) => <span className="text-muted">{formatDate(u.created_at)}</span>,
  },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [subscribers, setSubscribers] = useState<SubscribedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchSubscribers = useCallback(async () => {
    try {
      const { data } = await apiClient.get<SubscribedUser[]>("/admin/users/subscribed");
      setSubscribers(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const stats = useMemo(() => ({
    total: subscribers.length,
  }), [subscribers]);

  const filtered = useMemo(() => {
    if (!search) return subscribers;
    const q = search.toLowerCase();
    return subscribers.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [subscribers, search]);

  if (loading) {
    return (
      <div className="animate-shimmer">
        <div className="space-y-2">
          <div className="h-7 w-32 rounded bg-surface2" />
          <div className="h-4 w-48 rounded bg-surface2" />
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-line bg-surface/50 p-6">
              <div className="h-4 w-20 rounded bg-surface2" />
              <div className="mt-2 h-6 w-32 rounded bg-surface2" />
              <div className="mt-1 h-3 w-40 rounded bg-surface2" />
            </div>
          ))}
        </div>
        <div className="mt-8">
          <div className="h-5 w-40 rounded bg-surface2 mb-4" />
          <div className="hidden rounded-xl border border-line bg-surface/50 md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-surface2/50">
                  {["#", "Name", "Email", "Subscribed", "Joined"].map((h) => (
                    <th key={h} className="px-4 py-3"><div className="h-3 w-16 rounded bg-surface2" /></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b border-line/50 last:border-0">
                    <td className="px-4 py-3"><div className="h-3 w-6 rounded bg-surface2" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-28 rounded bg-surface2" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-44 rounded bg-surface2" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-24 rounded bg-surface2" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-24 rounded bg-surface2" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-mono text-2xl font-bold text-ink">Dashboard</h1>
      <p className="mt-2 text-sm text-muted">
        Welcome back, {user?.name}. Here&apos;s an overview of your admin panel.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-line bg-surface/50 p-6">
          <p className="text-sm text-muted">Logged in as</p>
          <p className="mt-1 font-mono text-lg font-bold text-ink">{user?.name}</p>
          <p className="text-xs text-muted mt-1">{user?.email}</p>
        </div>
        <div className="rounded-xl border border-line bg-surface/50 p-6">
          <p className="text-sm text-muted">Role</p>
          <p className="mt-1 font-mono text-lg font-bold text-blue capitalize">{user?.roles?.[0] || "Admin"}</p>
        </div>
        <div className="rounded-xl border border-line bg-surface/50 p-6">
          <p className="text-sm text-muted">Total Subscribers</p>
          <p className="mt-1 font-mono text-lg font-bold text-green">{stats.total}</p>
          <p className="text-xs text-muted mt-1">Active paid subscriptions.</p>
        </div>
      </div>

      {/* Subscribed Users Table */}
      <div className="mt-8">
        <h2 className="font-mono text-lg font-bold text-ink">Subscribed Users</h2>
        <p className="mt-1 text-sm text-muted">Users with an active Stripe subscription.</p>

        {/* Search */}
        <div className="mt-4">
          <div className="relative max-w-sm">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full rounded-lg border border-line bg-surface2 py-2.5 pl-10 pr-4 text-sm text-ink placeholder-muted focus:border-blue focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-4">
          <ResponsiveDataTable
            columns={SUBSCRIBER_COLUMNS}
            data={filtered}
            rowKey={(u) => u.id}
            title="Subscribed Users"
            pdfFilename="subscribed-users"
            emptyMessage="No subscribed users yet."
            renderMobileCard={(u, i) => (
              <div className="rounded-xl border border-line bg-surface/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs text-muted">#{i + 1}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-green/10 px-2 py-0.5 text-xs font-medium text-green">
                    <span className="h-1.5 w-1.5 rounded-full bg-green" />
                    Subscribed
                  </span>
                  <span className="inline-flex items-center rounded-full bg-blue/10 px-2 py-0.5 text-xs font-medium text-blue">
                    {u.plan?.name ?? "N/A"}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-ink">{u.name}</h3>
                <p className="mt-1 text-xs text-muted">{u.email}</p>
                <div className="mt-3 flex items-center gap-4 border-t border-line/50 pt-3 text-xs text-muted">
                  <span>Subscribed {formatDate(u.subscribed_at)}</span>
                  <span>Joined {formatDate(u.created_at)}</span>
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}
