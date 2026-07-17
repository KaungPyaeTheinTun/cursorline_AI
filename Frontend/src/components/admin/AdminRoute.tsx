import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function AdminRoute({ children }: { readonly children: React.ReactNode }) {
  const { user, token, isAuthLoaded } = useAuth();

  if (!isAuthLoaded) {
    return (
      <div className="flex min-h-screen bg-bg">
        {/* Sidebar skeleton */}
        <div className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-surface/95 animate-shimmer">
          <div className="border-b border-line px-4 py-5">
            <div className="h-5 w-24 rounded bg-surface2" />
          </div>
          <div className="flex-1 space-y-1 px-3 py-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2.5">
                <div className="h-[18px] w-[18px] shrink-0 rounded bg-surface2" />
                <div className="h-3.5 w-16 rounded bg-surface2" />
              </div>
            ))}
          </div>
          <div className="border-t border-line px-3 py-4">
            <div className="flex items-center gap-3 rounded-lg px-3 py-2">
              <div className="h-8 w-8 shrink-0 rounded-full bg-surface2" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-20 rounded bg-surface2" />
                <div className="h-2.5 w-28 rounded bg-surface2" />
              </div>
            </div>
          </div>
        </div>
        {/* Content skeleton */}
        <div className="ml-64 flex-1 px-4 py-6 sm:px-6 lg:px-8 animate-shimmer">
          <div className="space-y-4">
            <div className="h-7 w-32 rounded bg-surface2" />
            <div className="h-4 w-48 rounded bg-surface2" />
            <div className="mt-6 h-10 w-full max-w-sm rounded-lg bg-surface2" />
            <div className="mt-5 rounded-xl border border-line bg-surface/50 p-4">
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-3 w-6 rounded bg-surface2" />
                    <div className="h-4 w-48 rounded bg-surface2" />
                    <div className="h-4 w-64 rounded bg-surface2" />
                    <div className="ml-auto h-5 w-16 rounded-full bg-surface2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.roles.includes("admin")) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
