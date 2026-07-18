import { useToastStore } from "../../stores/toastStore";

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 sm:right-6">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => dismiss(t.id)}
          className={`cursor-pointer rounded-lg border px-4 py-3 text-sm font-medium shadow-lg backdrop-blur-sm transition-all ${
            t.exiting ? "animate-slide-out" : "animate-slide-in"
          } ${
            t.type === "success"
              ? "border-green/30 bg-green/10 text-green"
              : t.type === "error"
                ? "border-red/30 bg-red/10 text-red"
                : t.type === "warning"
                  ? "border-yellow/30 bg-yellow/10 text-yellow"
                  : "border-blue/30 bg-blue/10 text-blue"
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
