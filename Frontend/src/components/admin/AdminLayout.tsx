import { useState, useCallback, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
const AVATAR_BASE = API_URL.replace(/\/api\/v1\/?$/, "/storage/");

const ADMIN_LINKS = [
  { label: "Dashboard", href: "/admin", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" },
  { label: "FAQs", href: "/admin/faqs", icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { label: "Plans", href: "/admin/plans", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
];

const SIDEBAR_WIDTH = 256;
const SIDEBAR_COLLAPSED = 72;

export default function AdminLayout() {
  const { pathname } = useLocation();
  const { user, logout, isLoggingOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const toggleCollapse = useCallback(() => setCollapsed((c) => !c), []);
  const toggleMobile = useCallback(() => setMobileOpen((o) => !o), []);

  const sidebarWidth = isDesktop ? (collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH) : 0;

  const avatarUrl = user?.avatar ? `${AVATAR_BASE}${user.avatar}` : null;

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className="fixed inset-y-0 left-0 z-50 flex flex-col border-r border-line bg-surface/95 backdrop-blur-md transition-all duration-300 ease-in-out overflow-hidden"
        style={{ width: isDesktop ? sidebarWidth : mobileOpen ? SIDEBAR_WIDTH : 0 }}
      >
        {/* Logo + toggle */}
        <div className="flex items-center justify-between border-b border-line px-4 py-5">
          {!collapsed ? (
            <Link to="/" className="font-mono text-lg font-bold text-ink tracking-tight">
              cursor<span className="text-blue">line</span>
            </Link>
          ) : (
            <Link to="/" className="mx-auto font-mono text-lg font-bold text-ink">
              c<span className="text-blue">l</span>
            </Link>
          )}
          {isDesktop && (
            <button
              onClick={toggleCollapse}
              className="flex items-center justify-center h-7 w-7 shrink-0 rounded-lg text-muted hover:text-ink hover:bg-white/5 transition-colors"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
              >
                <path d="M10 4l-4 4 4 4" />
              </svg>
            </button>
          )}
          {!isDesktop && (
            <button
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center h-7 w-7 rounded-lg text-muted hover:text-ink hover:bg-white/5"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {ADMIN_LINKS.map((link) => {
            const isActive = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? link.label : undefined}
                className={`flex items-center gap-3 rounded-lg transition-colors ${
                  collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"
                } ${
                  isActive
                    ? "bg-blue/10 text-blue"
                    : "text-muted hover:text-ink hover:bg-white/5"
                }`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d={link.icon} />
                </svg>
                {!collapsed && <span className="text-sm">{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-line px-3 py-4">
          <Link
            to="/admin/profile"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-white/5 ${collapsed ? "justify-center px-2" : ""}`}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={user?.name}
                className="h-8 w-8 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue/20 text-blue text-xs font-bold">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm text-ink truncate">{user?.name}</p>
                <p className="text-xs text-muted truncate">{user?.email}</p>
              </div>
            )}
          </Link>
          <button
            onClick={logout}
            disabled={isLoggingOut}
            title={collapsed ? "Sign out" : undefined}
            className={`mt-2 w-full rounded-lg text-left text-sm text-muted hover:text-ink hover:bg-white/5 transition-colors disabled:opacity-50 ${
              collapsed ? "flex items-center justify-center px-2 py-2.5" : "px-3 py-2.5"
            }`}
          >
            {isLoggingOut ? (
              <span className="loading-dots text-lg"><span>.</span><span>.</span><span>.</span></span>
            ) : collapsed ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
            ) : (
              "Sign out"
            )}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div
        className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out"
        style={{ marginLeft: sidebarWidth }}
      >
        {/* Top bar (mobile) */}
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-bg/90 backdrop-blur-md px-4 py-3 lg:hidden">
          <button
            onClick={toggleMobile}
            className="flex items-center justify-center h-9 w-9 rounded-lg text-muted hover:text-ink hover:bg-white/5"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link to="/" className="font-mono text-lg font-bold text-ink tracking-tight">
            cursor<span className="text-blue">line</span>
          </Link>
          <span className="text-xs text-muted">Admin</span>
        </div>

        <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
