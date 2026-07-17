import { useRef, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, useToast } from "../../hooks/useAuth";

export default function ProtectedRoute({ children }: { readonly children: React.ReactNode }) {
  const { token, isAuthLoaded } = useAuth();
  const { toast } = useToast();
  const { pathname } = useLocation();
  const shown = useRef(false);

  useEffect(() => {
    if (isAuthLoaded && !token && !shown.current) {
      shown.current = true;
      toast("Please sign in to access this page.", "error");
    }
  }, [isAuthLoaded, token, toast]);

  if (!isAuthLoaded) {
    return (
      <div className="flex h-screen bg-bg pt-16 md:pt-[72px]">
        <div className="hidden md:block shrink-0 w-64">
          <div className="flex h-full flex-col bg-surface animate-shimmer">
            <div className="border-b border-line px-3 py-3">
              <div className="h-8 w-full rounded-lg bg-surface2" />
            </div>
            <div className="flex-1 space-y-1 p-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2.5">
                  <div className="h-4 w-4 shrink-0 rounded bg-surface2" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-[70%] rounded bg-surface2" />
                    <div className="h-2.5 w-[45%] rounded bg-surface2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center border-b border-line px-3 py-2 md:px-4">
            <div className="h-9 w-9 rounded-lg bg-surface2 animate-shimmer" />
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-6 animate-shimmer">
            <div className="mx-auto max-w-3xl space-y-5">
              <div className="flex justify-end">
                <div className="h-10 w-64 rounded-2xl rounded-br-md bg-surface2" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-surface2" />
                <div className="h-4 w-[85%] rounded bg-surface2" />
                <div className="h-4 w-[70%] rounded bg-surface2" />
              </div>
              <div className="flex justify-end">
                <div className="h-10 w-48 rounded-2xl rounded-br-md bg-surface2" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-[90%] rounded bg-surface2" />
                <div className="h-4 w-[60%] rounded bg-surface2" />
              </div>
            </div>
          </div>
          <div className="border-t border-line bg-surface px-4 py-3 md:px-6 md:py-4 pb-20 md:pb-4 animate-shimmer">
            <div className="mx-auto flex max-w-3xl gap-2 md:gap-3">
              <div className="flex-1 h-12 rounded-xl bg-surface2" />
              <div className="h-12 w-20 rounded-xl bg-surface2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: pathname }} replace />;
  }

  return <>{children}</>;
}
