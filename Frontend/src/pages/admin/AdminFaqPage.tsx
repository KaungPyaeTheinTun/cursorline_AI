import { useState, useEffect, useCallback, useMemo, type FormEvent } from "react";
import { apiClient } from "../../lib/axios";
import { useToast } from "../../hooks/useAuth";
import DeleteConfirmModal from "../../components/ui/DeleteConfirmModal";
import ResponsiveDataTable, { type Column } from "../../components/ui/ResponsiveDataTable";

interface Faq {
  readonly id: number;
  readonly question: string;
  readonly answer: string;
  readonly sort_order: number;
  readonly is_active: boolean;
}

const FAQ_COLUMNS: Column<Faq>[] = [
  {
    key: "sort_order",
    label: "#",
    sortable: true,
    render: (faq) => <span className="font-mono text-xs text-muted">{faq.sort_order}</span>,
  },
  {
    key: "question",
    label: "Question",
    sortable: true,
    className: "max-w-xs truncate font-medium text-ink",
  },
  {
    key: "answer",
    label: "Answer",
    className: "max-w-sm text-muted truncate",
  },
  {
    key: "is_active",
    label: "Status",
    sortable: true,
    render: (faq) => (
      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${faq.is_active ? "bg-green/10 text-green" : "bg-red/10 text-red"}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${faq.is_active ? "bg-green" : "bg-red"}`} />
        {faq.is_active ? "Active" : "Inactive"}
      </span>
    ),
  },
];

export default function AdminFaqPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<"question" | "sort_order" | "is_active">("sort_order");
  const [sortAsc, setSortAsc] = useState(true);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const fetchFaqs = useCallback(async () => {
    try {
      const { data } = await apiClient.get<Faq[]>("/admin/faqs");
      setFaqs(data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load FAQs.";
      toast(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return faqs
      .filter((f) => !q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q))
      .sort((a, b) => {
        let cmp = 0;
        if (sortKey === "question") cmp = a.question.localeCompare(b.question);
        else if (sortKey === "sort_order") cmp = a.sort_order - b.sort_order;
        else cmp = Number(a.is_active) - Number(b.is_active);
        return sortAsc ? cmp : -cmp;
      });
  }, [faqs, search, sortKey, sortAsc]);

  const handleSort = useCallback(
    (key: string) => {
      const k = key as typeof sortKey;
      if (sortKey === k) setSortAsc(!sortAsc);
      else { setSortKey(k); setSortAsc(true); }
    },
    [sortKey, sortAsc],
  );

  const actionsColumn: Column<Faq> = {
    key: "actions",
    label: "Actions",
    className: "text-right",
    render: (faq) => (
      <div className="inline-flex items-center gap-1">
        <button
          onClick={() => handleEdit(faq)}
          className="rounded-lg px-3 py-1.5 text-xs text-muted hover:text-ink hover:bg-white/5 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => setPendingDeleteId(faq.id)}
          className="rounded-lg px-3 py-1.5 text-xs text-red/70 hover:text-red hover:bg-red/10 transition-colors"
        >
          Delete
        </button>
      </div>
    ),
  };

  const columns = useMemo(() => [...FAQ_COLUMNS, actionsColumn], []);

  const handleEdit = (faq: Faq) => {
    setEditing(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setSortOrder(faq.sort_order);
    setIsActive(faq.is_active);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (pendingDeleteId === null) return;
    setDeleting(true);
    try {
      await apiClient.delete(`/admin/faqs/${pendingDeleteId}`);
      setFaqs((prev) => prev.filter((f) => f.id !== pendingDeleteId));
      toast("FAQ deleted.", "success");
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
    const body = { question, answer, sort_order: sortOrder, is_active: isActive };

    try {
      if (editing) {
        const { data: updated } = await apiClient.put<Faq>(`/admin/faqs/${editing.id}`, body);
        setFaqs((prev) => prev.map((f) => (f.id === editing.id ? updated : f)));
        toast("FAQ updated.", "success");
      } else {
        const { data: created } = await apiClient.post<Faq>("/admin/faqs", body);
        setFaqs((prev) => [...prev, created]);
        toast("FAQ created.", "success");
      }
      resetForm();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to save.";
      toast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setQuestion("");
    setAnswer("");
    setSortOrder(0);
    setIsActive(true);
    setEditing(null);
    setShowForm(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-mono text-2xl font-bold text-ink">FAQs</h1>
          <p className="mt-1 text-sm text-muted">{faqs.length} total questions</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="inline-flex items-center gap-2 rounded-lg bg-blue px-4 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-blue/90"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add FAQ
        </button>
      </div>

      {/* Search */}
      <div className="mt-5">
        <div className="relative max-w-sm">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions or answers..."
            className="w-full rounded-lg border border-line bg-surface2 py-2.5 pl-10 pr-4 text-sm text-ink placeholder-muted focus:border-blue focus:outline-none"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="mt-5">
        <ResponsiveDataTable
          columns={columns}
          data={filtered}
          rowKey={(faq) => faq.id}
          title="FAQs"
          pdfFilename="faqs"
          loading={loading}
          sortKey={sortKey}
          sortAsc={sortAsc}
          onSort={handleSort}
          renderMobileCard={(faq) => (
            <div className="rounded-xl border border-line bg-surface/50 p-4 transition-colors hover:border-line/80">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-muted">#{faq.sort_order}</span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${faq.is_active ? "bg-green/10 text-green" : "bg-red/10 text-red"}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${faq.is_active ? "bg-green" : "bg-red"}`} />
                      {faq.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-ink">{faq.question}</h3>
                  <p className="mt-1 text-xs text-muted line-clamp-2">{faq.answer}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 border-t border-line/50 pt-3">
                <button
                  onClick={() => handleEdit(faq)}
                  className="flex-1 rounded-lg border border-line bg-surface2 px-3 py-2 text-xs font-medium text-muted transition-colors hover:text-ink hover:bg-white/5"
                >
                  Edit
                </button>
                <button
                  onClick={() => setPendingDeleteId(faq.id)}
                  className="flex-1 rounded-lg border border-red/20 bg-red/5 px-3 py-2 text-xs font-medium text-red/70 transition-colors hover:text-red hover:bg-red/10"
                >
                  Delete
                </button>
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
            <h2 className="font-mono text-lg font-bold text-ink">
              {editing ? "Edit FAQ" : "New FAQ"}
            </h2>
            <button onClick={resetForm} className="rounded-lg p-1.5 text-muted hover:text-ink hover:bg-white/5 transition-colors">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block font-mono text-xs font-medium text-muted">Question</label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
                className="w-full rounded-lg border border-line bg-surface2 px-4 py-3 text-sm text-ink placeholder-muted focus:border-blue focus:outline-none"
                placeholder="e.g. Is my code sent to external servers?"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-mono text-xs font-medium text-muted">Answer</label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                required
                rows={4}
                className="w-full rounded-lg border border-line bg-surface2 px-4 py-3 text-sm text-ink placeholder-muted focus:border-blue focus:outline-none resize-none"
                placeholder="Write the answer here..."
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="mb-1.5 block font-mono text-xs font-medium text-muted">Sort Order</label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  min={0}
                  className="w-full rounded-lg border border-line bg-surface2 px-4 py-3 text-sm text-ink focus:border-blue focus:outline-none"
                />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 rounded border-line bg-surface2 accent-blue"
                  />
                  Active
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg px-4 py-2 text-sm text-muted hover:text-ink transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-blue px-4 py-2 text-sm font-semibold text-bg transition-colors hover:bg-blue/90 disabled:opacity-50"
              >
                {submitting ? "Saving..." : editing ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <DeleteConfirmModal
        open={pendingDeleteId !== null}
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
