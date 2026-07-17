import { useState, useMemo, useCallback, type ReactNode } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface Column<T> {
  readonly key: string;
  readonly label: string;
  readonly sortable?: boolean;
  readonly className?: string;
  readonly render?: (row: T, index: number) => ReactNode;
}

interface ResponsiveDataTableProps<T> {
  readonly columns: Column<T>[];
  readonly data: T[];
  readonly rowKey: (row: T) => string | number;
  readonly title: string;
  readonly pdfFilename?: string;
  readonly renderMobileCard: (row: T, index: number) => ReactNode;
  readonly loading?: boolean;
  readonly loadingRows?: number;
  readonly emptyMessage?: string;
  readonly rowsPerPage?: number;
  readonly sortKey?: string;
  readonly sortAsc?: boolean;
  readonly onSort?: (key: string) => void;
}

export default function ResponsiveDataTable<T>({
  columns,
  data,
  rowKey,
  title,
  pdfFilename,
  renderMobileCard,
  loading = false,
  loadingRows = 5,
  emptyMessage = "No data found.",
  rowsPerPage = 10,
  sortKey,
  sortAsc = true,
  onSort,
}: ResponsiveDataTableProps<T>) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(data.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);

  const pagedData = useMemo(() => {
    const start = (safePage - 1) * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [data, safePage, rowsPerPage]);

  const handlePageChange = useCallback((p: number) => {
    setPage(Math.max(1, Math.min(p, totalPages)));
  }, [totalPages]);

  const exportPdf = useCallback(() => {
    const doc = new jsPDF({ orientation: columns.length > 4 ? "landscape" : "portrait" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(title, 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Exported on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, 14, 28);
    doc.text(`Total records: ${data.length}`, 14, 34);

    const head = [columns.map((c) => c.label)];
    const body = data.map((row, i) =>
      columns.map((col) => {
        if (col.render) {
          const rendered = col.render(row, i);
          if (typeof rendered === "string") return rendered;
          return String((row as Record<string, unknown>)[col.key] ?? "");
        }
        return String((row as Record<string, unknown>)[col.key] ?? "");
      }),
    );

    autoTable(doc, {
      head,
      body,
      startY: 38,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [95, 168, 255], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save(`${pdfFilename || title.toLowerCase().replace(/\s+/g, "-")}.pdf`);
  }, [columns, data, title, pdfFilename]);

  if (loading) {
    return (
      <div className="animate-shimmer">
        {/* Desktop table skeleton */}
        <div className="hidden overflow-hidden rounded-xl border border-line bg-surface/50 md:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-surface2/50">
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-3">
                    <div className="h-3 w-16 rounded bg-surface2" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: loadingRows }, (_, i) => (
                <tr key={i} className="border-b border-line/50 last:border-0">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <div className="h-4 rounded bg-surface2" style={{ width: `${50 + Math.random() * 40}%` }} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile cards skeleton */}
        <div className="space-y-3 md:hidden">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="rounded-xl border border-line bg-surface/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-6 rounded bg-surface2" />
                <div className="h-5 w-16 rounded-full bg-surface2" />
              </div>
              <div className="h-4 w-[80%] rounded bg-surface2" />
              <div className="mt-2 h-3 w-full rounded bg-surface2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted">{data.length} record{data.length !== 1 ? "s" : ""}</p>
        <button
          onClick={exportPdf}
          disabled={data.length === 0}
          className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-xs font-medium text-muted transition-colors hover:text-ink hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export PDF
        </button>
      </div>

      {data.length === 0 ? (
        <div className="rounded-xl border border-line bg-surface/50 py-12 text-center">
          <p className="text-sm text-muted">{emptyMessage}</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl border border-line bg-surface/50 md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line bg-surface2/50">
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        className={`whitespace-nowrap px-4 py-3 font-mono text-xs font-medium text-muted ${col.sortable ? "cursor-pointer select-none" : ""} ${col.className ?? ""}`}
                        onClick={col.sortable && onSort ? () => onSort(col.key) : undefined}
                      >
                        {col.label}
                        {col.sortable && onSort && (
                          <svg
                            className={`inline-block ml-1 h-3 w-3 transition-transform ${sortKey === col.key ? "text-blue" : "text-muted/40"} ${sortKey === col.key && !sortAsc ? "rotate-180" : ""}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                          </svg>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pagedData.map((row, i) => (
                    <tr key={rowKey(row)} className="border-b border-line/50 last:border-0 transition-colors hover:bg-white/[0.02]">
                      {columns.map((col) => (
                        <td key={col.key} className={`whitespace-nowrap px-4 py-3 ${col.className ?? ""}`}>
                          {col.render
                            ? col.render(row, (safePage - 1) * rowsPerPage + i)
                            : String((row as Record<string, unknown>)[col.key] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {pagedData.map((row, i) => (
              <div key={rowKey(row)}>
                {renderMobileCard(row, (safePage - 1) * rowsPerPage + i)}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-muted">
                Page {safePage} of {totalPages}
              </p>
              <div className="flex items-center gap-1">
                <PaginationBtn
                  disabled={safePage <= 1}
                  onClick={() => handlePageChange(safePage - 1)}
                  label="Prev"
                />
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                  .reduce<(number | "ellipsis")[]>((acc, p, i, arr) => {
                    if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("ellipsis");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "ellipsis" ? (
                      <span key={`e${i}`} className="px-1 text-xs text-muted">...</span>
                    ) : (
                      <PaginationBtn
                        key={p}
                        active={p === safePage}
                        onClick={() => handlePageChange(p)}
                        label={String(p)}
                      />
                    ),
                  )}
                <PaginationBtn
                  disabled={safePage >= totalPages}
                  onClick={() => handlePageChange(safePage + 1)}
                  label="Next"
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PaginationBtn({
  label,
  active,
  disabled,
  onClick,
}: {
  readonly label: string;
  readonly active?: boolean;
  readonly disabled?: boolean;
  readonly onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`min-w-[32px] rounded-lg px-2 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "bg-blue text-bg"
          : disabled
            ? "text-muted/40 cursor-not-allowed"
            : "text-muted hover:text-ink hover:bg-white/5"
      }`}
    >
      {label}
    </button>
  );
}
