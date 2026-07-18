import { useEffect, useCallback } from "react";

interface DeleteConfirmModalProps {
  readonly open: boolean;
  readonly title?: string;
  readonly description?: string;
  readonly onCancel: () => void;
  readonly onConfirm: () => void;
  readonly loading?: boolean;
}

export default function DeleteConfirmModal({
  open,
  title = "Are you sure you want to delete?",
  description = "This action cannot be undone.",
  onCancel,
  onConfirm,
  loading = false,
}: DeleteConfirmModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onCancel();
    },
    [onCancel, loading],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  return (
    <div className={`fixed inset-0 z-[60] flex items-center justify-center transition-all duration-200 ease-out ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={!loading ? onCancel : undefined}
      />

      {/* Panel */}
      <div className={`relative mx-4 w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-2xl transition-all duration-200 ease-out ${open ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-2"}`}>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red/10">
          <svg className="h-6 w-6 text-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>

        <h3 className="text-center text-base font-semibold text-ink">{title}</h3>
        <p className="mt-1.5 text-center text-sm text-muted">{description}</p>

        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-line bg-surface2 px-4 py-2 text-sm text-muted transition-colors hover:text-ink hover:bg-white/5 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-red px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red/90 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
