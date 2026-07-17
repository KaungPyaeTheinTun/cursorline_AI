import { useState, useEffect, useCallback, useMemo, type FormEvent } from "react";
import { apiClient } from "../../lib/axios";
import { useToast } from "../../hooks/useAuth";
import DeleteConfirmModal from "../../components/ui/DeleteConfirmModal";
import ResponsiveDataTable, { type Column } from "../../components/ui/ResponsiveDataTable";

interface Plan {
  readonly id: number;
  readonly name: string;
  readonly slug: string;
  readonly price: number;
  readonly period: string;
  readonly description: string | null;
  readonly features: string[] | null;
  readonly cta: string;
  readonly highlighted: boolean;
  readonly is_active: boolean;
  readonly sort_order: number;
  readonly usage_duration_minutes: number;
}

function formatPrice(cents: number) {
  return cents === 0 ? "Free" : `$${(cents / 100).toFixed(2)}`;
}

function formatDuration(minutes: number) {
  if (minutes === 0) return "Unlimited";
  if (minutes < 60) return `${minutes} min`;
  const hours = minutes / 60;
  if (hours < 24) return `${hours} hr`;
  const days = hours / 24;
  if (days < 30) return `${days} days`;
  const months = days / 30;
  return `${months} mo`;
}

const PLAN_COLUMNS: Column<Plan>[] = [
  {
    key: "sort_order",
    label: "#",
    sortable: true,
    render: (p) => <span className="font-mono text-xs text-muted">{p.sort_order}</span>,
  },
  {
    key: "name",
    label: "Name",
    sortable: true,
    className: "font-medium text-ink",
  },
  {
    key: "slug",
    label: "Slug",
    render: (p) => <span className="font-mono text-xs text-muted">{p.slug}</span>,
  },
  {
    key: "price",
    label: "Price",
    sortable: true,
    render: (p) => <span className="font-medium">{formatPrice(p.price)}</span>,
  },
  {
    key: "period",
    label: "Period",
    render: (p) => <span className="text-muted">/{p.period}</span>,
  },
  {
    key: "usage_duration_minutes",
    label: "Duration",
    sortable: true,
    render: (p) => <span className="font-medium">{formatDuration(p.usage_duration_minutes)}</span>,
  },
  {
    key: "is_active",
    label: "Status",
    sortable: true,
    render: (p) => (
      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${p.is_active ? "bg-green/10 text-green" : "bg-red/10 text-red"}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${p.is_active ? "bg-green" : "bg-red"}`} />
        {p.is_active ? "Active" : "Inactive"}
      </span>
    ),
  },
];

const emptyPlan = { name: "", slug: "", price: 0, period: "month", description: "", features: "", cta: "Get Started", highlighted: false, is_active: true, sort_order: 0, usage_duration_minutes: 0 };

export default function AdminPlanPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<"name" | "price" | "sort_order" | "is_active">("sort_order");
  const [sortAsc, setSortAsc] = useState(true);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyPlan);
  const [submitting, setSubmitting] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const fetchPlans = useCallback(async () => {
    try {
      const { data } = await apiClient.get<Plan[]>("/admin/plans");
      setPlans(data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load plans.";
      toast(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchPlans(); }, [fetchPlans]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return plans
      .filter((p) => !q || p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q))
      .sort((a, b) => {
        let cmp = 0;
        if (sortKey === "name") cmp = a.name.localeCompare(b.name);
        else if (sortKey === "price") cmp = a.price - b.price;
        else if (sortKey === "sort_order") cmp = a.sort_order - b.sort_order;
        else cmp = Number(a.is_active) - Number(b.is_active);
        return sortAsc ? cmp : -cmp;
      });
  }, [plans, search, sortKey, sortAsc]);

  const handleSort = useCallback((key: string) => {
    const k = key as typeof sortKey;
    if (sortKey === k) setSortAsc(!sortAsc);
    else { setSortKey(k); setSortAsc(true); }
  }, [sortKey, sortAsc]);

  const actionsColumn: Column<Plan> = {
    key: "actions",
    label: "Actions",
    className: "text-right",
    render: (p) => (
      <div className="inline-flex items-center gap-1">
        <button onClick={() => handleEdit(p)} className="rounded-lg px-3 py-1.5 text-xs text-muted hover:text-ink hover:bg-white/5 transition-colors">Edit</button>
        <button onClick={() => setPendingDeleteId(p.id)} className="rounded-lg px-3 py-1.5 text-xs text-red/70 hover:text-red hover:bg-red/10 transition-colors">Delete</button>
      </div>
    ),
  };

  const columns = useMemo(() => [...PLAN_COLUMNS, actionsColumn], []);

  const resetForm = () => { setForm(emptyPlan); setEditing(null); setShowForm(false); };

  const handleEdit = (p: Plan) => {
    setEditing(p);
    setForm({
      name: p.name,
      slug: p.slug,
      price: p.price,
      period: p.period,
      description: p.description ?? "",
      features: (p.features ?? []).join("\n"),
      cta: p.cta,
      highlighted: p.highlighted,
      is_active: p.is_active,
      sort_order: p.sort_order,
      usage_duration_minutes: p.usage_duration_minutes,
    });
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (pendingDeleteId === null) return;
    setDeleting(true);
    try {
      await apiClient.delete(`/admin/plans/${pendingDeleteId}`);
      setPlans((prev) => prev.filter((p) => p.id !== pendingDeleteId));
      toast("Plan deleted.", "success");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to delete.";
      toast(msg, "error");
    } finally {
      setDeleting(false);
      setPendingDeleteId(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const body = {
      name: form.name,
      slug: form.slug,
      price: form.price,
      period: form.period,
      description: form.description || null,
      features: form.features ? form.features.split("\n").filter((f) => f.trim()) : [],
      cta: form.cta,
      highlighted: form.highlighted,
      is_active: form.is_active,
      sort_order: form.sort_order,
      usage_duration_minutes: form.usage_duration_minutes,
    };

    try {
      if (editing) {
        const { data: updated } = await apiClient.put<Plan>(`/admin/plans/${editing.id}`, body);
        setPlans((prev) => prev.map((p) => (p.id === editing.id ? updated : p)));
        toast("Plan updated.", "success");
      } else {
        const { data: created } = await apiClient.post<Plan>("/admin/plans", body);
        setPlans((prev) => [...prev, created]);
        toast("Plan created.", "success");
      }
      resetForm();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to save.";
      toast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-mono text-2xl font-bold text-ink">Plans</h1>
          <p className="mt-1 text-sm text-muted">{plans.length} total plans</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="inline-flex items-center gap-2 rounded-lg bg-blue px-4 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-blue/90">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Plan
        </button>
      </div>

      {/* Search */}
      <div className="mt-5">
        <div className="relative max-w-sm">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search plans..." className="w-full rounded-lg border border-line bg-surface2 py-2.5 pl-10 pr-4 text-sm text-ink placeholder-muted focus:border-blue focus:outline-none" />
        </div>
      </div>

      {/* Data Table */}
      <div className="mt-5">
        <ResponsiveDataTable
          columns={columns}
          data={filtered}
          rowKey={(p) => p.id}
          title="Plans"
          pdfFilename="plans"
          loading={loading}
          sortKey={sortKey}
          sortAsc={sortAsc}
          onSort={handleSort}
          renderMobileCard={(p) => (
            <div className="rounded-xl border border-line bg-surface/50 p-4 transition-colors hover:border-line/80">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-muted">#{p.sort_order}</span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${p.is_active ? "bg-green/10 text-green" : "bg-red/10 text-red"}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${p.is_active ? "bg-green" : "bg-red"}`} />
                      {p.is_active ? "Active" : "Inactive"}
                    </span>
                    {p.highlighted && <span className="rounded-full bg-blue/10 px-2 py-0.5 text-xs font-medium text-blue">Popular</span>}
                  </div>
                  <h3 className="text-sm font-medium text-ink">{p.name}</h3>
                  <p className="mt-1 font-mono text-lg font-bold">{formatPrice(p.price)}<span className="text-xs text-muted font-normal">/{p.period}</span></p>
                  <p className="mt-0.5 text-xs text-muted">Duration: {formatDuration(p.usage_duration_minutes)}</p>
                  {p.description && <p className="mt-1 text-xs text-muted line-clamp-2">{p.description}</p>}
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 border-t border-line/50 pt-3">
                <button onClick={() => handleEdit(p)} className="flex-1 rounded-lg border border-line bg-surface2 px-3 py-2 text-xs font-medium text-muted transition-colors hover:text-ink hover:bg-white/5">Edit</button>
                <button onClick={() => setPendingDeleteId(p.id)} className="flex-1 rounded-lg border border-red/20 bg-red/5 px-3 py-2 text-xs font-medium text-red/70 transition-colors hover:text-red hover:bg-red/10">Delete</button>
              </div>
            </div>
          )}
        />
      </div>

      {/* Form modal */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-200 ease-out ${showForm ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${showForm ? "opacity-100" : "opacity-0"}`} onClick={!submitting ? resetForm : undefined} />
        <div className={`relative mx-4 w-full max-w-lg rounded-2xl border border-line bg-surface p-6 shadow-2xl transition-all duration-200 ease-out ${showForm ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-2"}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-mono text-lg font-bold text-ink">{editing ? "Edit Plan" : "New Plan"}</h2>
            <button onClick={resetForm} className="rounded-lg p-1.5 text-muted hover:text-ink hover:bg-white/5 transition-colors">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block font-mono text-xs font-medium text-muted">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full rounded-lg border border-line bg-surface2 px-4 py-3 text-sm text-ink placeholder-muted focus:border-blue focus:outline-none" placeholder="e.g. Pro" />
              </div>
              <div>
                <label className="mb-1.5 block font-mono text-xs font-medium text-muted">Slug</label>
                <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required className="w-full rounded-lg border border-line bg-surface2 px-4 py-3 text-sm text-ink placeholder-muted focus:border-blue focus:outline-none" placeholder="e.g. pro" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block font-mono text-xs font-medium text-muted">Price (cents)</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} min={0} className="w-full rounded-lg border border-line bg-surface2 px-4 py-3 text-sm text-ink focus:border-blue focus:outline-none" />
                <p className="mt-1 text-xs text-muted">{formatPrice(form.price)}</p>
              </div>
              <div>
                <label className="mb-1.5 block font-mono text-xs font-medium text-muted">Period</label>
                <select value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} className="w-full rounded-lg border border-line bg-surface2 px-4 py-3 text-sm text-ink focus:border-blue focus:outline-none">
                  <option value="month">Monthly</option>
                  <option value="year">Yearly</option>
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block font-mono text-xs font-medium text-muted">Description</label>
              <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg border border-line bg-surface2 px-4 py-3 text-sm text-ink placeholder-muted focus:border-blue focus:outline-none" placeholder="Short description..." />
            </div>
            <div>
              <label className="mb-1.5 block font-mono text-xs font-medium text-muted">Features (one per line)</label>
              <textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} rows={4} className="w-full rounded-lg border border-line bg-surface2 px-4 py-3 text-sm text-ink placeholder-muted focus:border-blue focus:outline-none resize-none" placeholder="Unlimited completions&#10;Multi-repo indexing&#10;Priority support" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="mb-1.5 block font-mono text-xs font-medium text-muted">CTA Button</label>
                <input type="text" value={form.cta} onChange={(e) => setForm({ ...form, cta: e.target.value })} className="w-full rounded-lg border border-line bg-surface2 px-4 py-3 text-sm text-ink placeholder-muted focus:border-blue focus:outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block font-mono text-xs font-medium text-muted">Sort Order</label>
                <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} min={0} className="w-full rounded-lg border border-line bg-surface2 px-4 py-3 text-sm text-ink focus:border-blue focus:outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block font-mono text-xs font-medium text-muted">Duration (min)</label>
                <input type="number" value={form.usage_duration_minutes} onChange={(e) => setForm({ ...form, usage_duration_minutes: Number(e.target.value) })} min={0} className="w-full rounded-lg border border-line bg-surface2 px-4 py-3 text-sm text-ink focus:border-blue focus:outline-none" />
                <p className="mt-1 text-xs text-muted">{formatDuration(form.usage_duration_minutes)}</p>
              </div>
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
                <input type="checkbox" checked={form.highlighted} onChange={(e) => setForm({ ...form, highlighted: e.target.checked })} className="h-4 w-4 rounded border-line bg-surface2 accent-blue" />
                Highlighted
              </label>
              <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="h-4 w-4 rounded border-line bg-surface2 accent-blue" />
                Active
              </label>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={resetForm} className="rounded-lg px-4 py-2 text-sm text-muted hover:text-ink transition-colors">Cancel</button>
              <button type="submit" disabled={submitting} className="rounded-lg bg-blue px-4 py-2 text-sm font-semibold text-bg transition-colors hover:bg-blue/90 disabled:opacity-50">
                {submitting ? "Saving..." : editing ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <DeleteConfirmModal open={pendingDeleteId !== null} onCancel={() => setPendingDeleteId(null)} onConfirm={handleDelete} loading={deleting} />
    </div>
  );
}
