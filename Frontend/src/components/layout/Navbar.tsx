import { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useToast } from "../../hooks/useAuth";

function scrollToSection(
  href: string,
  navigate: ReturnType<typeof useNavigate>,
) {
  if (window.location.pathname === "/") {
    const id = href.slice(2);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  } else {
    navigate(href, { replace: false });
    setTimeout(() => {
      const id = href.slice(2);
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }
}

interface MegaMenuItem {
  readonly label: string;
  readonly href: string;
  readonly description: string;
  readonly icon: string;
}

interface MegaMenuGroup {
  readonly label: string;
  readonly items: readonly MegaMenuItem[];
  readonly image: React.ReactNode;
}

const ResourcesImage = (
  <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-green/20 via-blue/10 to-transparent">
    <svg className="h-48 w-48 text-green/40" viewBox="0 0 200 200" fill="none">
      <rect
        x="20"
        y="30"
        width="160"
        height="140"
        rx="8"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="20"
        y="30"
        width="160"
        height="24"
        rx="8"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <circle cx="36" cy="42" r="4" fill="#FF605C" />
      <circle cx="50" cy="42" r="4" fill="#FFBD44" />
      <circle cx="64" cy="42" r="4" fill="#00CA4E" />
      <line
        x1="20"
        y1="54"
        x2="180"
        y2="54"
        stroke="currentColor"
        strokeWidth="0.5"
      />
      <rect
        x="32"
        y="64"
        width="60"
        height="8"
        rx="2"
        fill="currentColor"
        fillOpacity="0.3"
      />
      <rect
        x="32"
        y="78"
        width="45"
        height="8"
        rx="2"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <rect
        x="32"
        y="92"
        width="70"
        height="8"
        rx="2"
        fill="currentColor"
        fillOpacity="0.3"
      />
      <rect
        x="32"
        y="106"
        width="50"
        height="8"
        rx="2"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <rect
        x="32"
        y="120"
        width="65"
        height="8"
        rx="2"
        fill="currentColor"
        fillOpacity="0.3"
      />
      <rect
        x="32"
        y="134"
        width="40"
        height="8"
        rx="2"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <rect
        x="32"
        y="148"
        width="55"
        height="8"
        rx="2"
        fill="currentColor"
        fillOpacity="0.3"
      />
      <path
        d="M140 70 L160 90 L140 110"
        stroke="#00CA4E"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
      <line
        x1="120"
        y1="90"
        x2="160"
        y2="90"
        stroke="#00CA4E"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
    <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent" />
  </div>
);

const ProductImage = (
  <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue/20 via-purple/10 to-transparent">
    <svg className="h-48 w-48 text-blue/40" viewBox="0 0 200 200" fill="none">
      <rect
        x="20"
        y="30"
        width="160"
        height="140"
        rx="8"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="20"
        y="30"
        width="160"
        height="24"
        rx="8"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <circle cx="36" cy="42" r="4" fill="#FF605C" />
      <circle cx="50" cy="42" r="4" fill="#FFBD44" />
      <circle cx="64" cy="42" r="4" fill="#00CA4E" />
      <line
        x1="20"
        y1="54"
        x2="180"
        y2="54"
        stroke="currentColor"
        strokeWidth="0.5"
      />
      <text
        x="36"
        y="78"
        fill="currentColor"
        fillOpacity="0.6"
        fontSize="10"
        fontFamily="monospace"
      >
        const assistant =
      </text>
      <text
        x="36"
        y="94"
        fill="currentColor"
        fillOpacity="0.8"
        fontSize="10"
        fontFamily="monospace"
      >
        {" "}
        new Cursorline({`{`}
      </text>
      <text
        x="36"
        y="110"
        fill="#5FA8FF"
        fillOpacity="0.9"
        fontSize="10"
        fontFamily="monospace"
      >
        {" "}
        model: "cursor-ai",
      </text>
      <text
        x="36"
        y="126"
        fill="#5FA8FF"
        fillOpacity="0.9"
        fontSize="10"
        fontFamily="monospace"
      >
        {" "}
        context: repo,
      </text>
      <text
        x="36"
        y="142"
        fill="currentColor"
        fillOpacity="0.8"
        fontSize="10"
        fontFamily="monospace"
      >{`});`}</text>
      <circle
        cx="160"
        cy="80"
        r="24"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="4 4"
        opacity="0.3"
      />
      <path
        d="M152 80 L168 80 M160 72 L160 88"
        stroke="#5FA8FF"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
    <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent" />
  </div>
);

const MEGA_MENUS: readonly MegaMenuGroup[] = [
  {
    label: "Product",
    image: ProductImage,
    items: [
      {
        label: "Features",
        href: "/#features",
        description: "AI autocomplete, debugging, and refactors.",
        icon: "M13 10V3L4 14h7v7l9-11h-7z",
      },
      {
        label: "How It Works",
        href: "/#how-it-works",
        description: "Three steps to AI-assisted coding.",
        icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
      },
      {
        label: "Pricing",
        href: "/#pricing",
        description: "Start free, upgrade when you need more.",
        icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      },
    ],
  },
  {
    label: "Resources",
    image: ResourcesImage,
    items: [
      {
        label: "Docs",
        href: "/docs",
        description: "Installation, guides, and API reference.",
        icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
      },
      {
        label: "Blog",
        href: "/blog",
        description: "Engineering deep dives and product updates.",
        icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
      },
      {
        label: "Changelog",
        href: "/changelog",
        description: "Every feature and fix we've shipped.",
        icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      },
      {
        label: "Community",
        href: "/community",
        description: "Discord, GitHub, and events.",
        icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      },
      {
        label: "FAQ",
        href: "/#faq",
        description: "Answers to common questions.",
        icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      },
      {
        label: "Roadmap",
        href: "/roadmap",
        description: "What's shipped and what's next.",
        icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
      },
      {
        label: "About",
        href: "/about",
        description: "Our mission, values, and team.",
        icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      },
      {
        label: "Contact",
        href: "/contact",
        description: "Get in touch with our team.",
        icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      },
    ],
  },
];

const STANDALONE_LINKS = [{ label: "Demo", href: "/#demo" }];

const SCROLL_THRESHOLD = 100;

function MegaMenuDropdown({
  group,
  isOpen,
  onClose,
}: {
  readonly group: MegaMenuGroup;
  readonly isOpen: boolean;
  readonly onClose: () => void;
}) {
  return (
    <div className="fixed left-0 right-0 top-[60px] z-50 pointer-events-none">
      <div
        className={`mx-auto max-w-7xl rounded-b-xl border border-t-0 border-line/60 bg-surface p-6 shadow-2xl shadow-black/40 transition-all duration-200 ease-out ${isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}
      >
        <div className="grid grid-cols-[1fr_300px] gap-8">
          <div>
            <span className="mb-4 block font-mono text-[11px] font-semibold uppercase tracking-wider text-muted/60">
              {group.label}
            </span>
            <div className="grid grid-cols-3 gap-1">
              {group.items.map((item) => (
                <MegaMenuItemRow
                  key={item.href}
                  item={item}
                  onClose={onClose}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center">{group.image}</div>
        </div>
      </div>
    </div>
  );
}

function MegaMenuItemRow({
  item,
  onClose,
}: {
  readonly item: MegaMenuItem;
  readonly onClose?: () => void;
}) {
  const navigate = useNavigate();

  if (item.href.startsWith("/#")) {
    return (
      <button
        onClick={() => {
          scrollToSection(item.href, navigate);
          onClose?.();
        }}
        className="group/item flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-white/5"
      >
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface2 text-muted transition-colors group-hover/item:bg-blue/10 group-hover/item:text-blue">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={item.icon} />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink transition-colors group-hover/item:text-blue">
            {item.label}
          </p>
          <p className="text-xs text-muted leading-relaxed">
            {item.description}
          </p>
        </div>
      </button>
    );
  }

  return (
    <Link
      to={item.href}
      onClick={() => onClose?.()}
      className="group/item flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-white/5"
    >
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface2 text-muted transition-colors group-hover/item:bg-blue/10 group-hover/item:text-blue">
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={item.icon} />
        </svg>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink transition-colors group-hover/item:text-blue">
          {item.label}
        </p>
        <p className="text-xs text-muted leading-relaxed">{item.description}</p>
      </div>
    </Link>
  );
}

function BottomMegaMenuDropdown({
  group,
  isOpen,
  onClose,
}: {
  readonly group: MegaMenuGroup;
  readonly isOpen: boolean;
  readonly onClose: () => void;
}) {
  return (
    <div className="relative">
      <button className="flex items-center gap-1 rounded-xl px-3.5 py-2.5 text-sm text-muted transition-colors hover:text-ink hover:bg-white/5">
        {group.label}
        <svg
          className={`h-3 w-3 rotate-180 transition-transform duration-200 ${isOpen ? "rotate-0" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[700px] transition-all duration-200 ease-out pointer-events-none ${isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-2 pointer-events-none"}`}
      >
        <div className="rounded-xl border border-line/60 bg-surface p-5 shadow-2xl shadow-black/40">
          <span className="mb-3 block font-mono text-[11px] font-semibold uppercase tracking-wider text-muted/60">
            {group.label}
          </span>
          <div className="grid grid-cols-3 gap-1">
            {group.items.map((item) => (
              <MegaMenuItemRow key={item.href} item={item} onClose={onClose} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileDropdown({
  group,
  onClose,
}: {
  readonly group: MegaMenuGroup;
  readonly onClose: () => void;
}) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-sm text-muted transition-colors hover:text-ink"
      >
        {group.label}
        <svg
          className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-80" : "max-h-0"}`}
      >
        <div className="space-y-1 pl-3 pt-2">
          {group.items.map((item) =>
            item.href.startsWith("/#") ? (
              <button
                key={item.href}
                onClick={() => {
                  scrollToSection(item.href, navigate);
                  onClose();
                }}
                className="block w-full text-left rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:text-ink hover:bg-white/5"
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className="block rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:text-ink hover:bg-white/5"
              >
                {item.label}
              </Link>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showTop, setShowTop] = useState(true);
  const [showBottom, setShowBottom] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const { user, logout, isLoggingOut, isAuthLoaded } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const toggle = useCallback(() => setMobileOpen((o) => !o), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY < SCROLL_THRESHOLD) {
        setShowTop(true);
        setShowBottom(false);
      } else {
        if (isMobile) {
          setShowTop(true);
        } else {
          setShowTop(false);
        }
        setShowBottom(!isMobile);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile]);

  const handleLogout = useCallback(async () => {
    await logout();
    toast("Signed out successfully.", "success");
  }, [logout, toast]);

  const signOutLabel = isLoggingOut ? (
    <span className="loading-dots">
      <span>.</span>
      <span>.</span>
      <span>.</span>
    </span>
  ) : (
    "Sign out"
  );

  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

  return (
    <>
      {/* ── Top navbar ── */}
      <nav
        aria-label="Main navigation"
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          transform: showTop ? "translateY(0)" : "translateY(-100%)",
          opacity: showTop ? 1 : 0,
          pointerEvents: showTop ? "auto" : "none",
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="font-mono text-lg font-bold text-ink tracking-tight"
          >
            cursor<span className="text-blue">line</span>
          </Link>

          {/* Desktop mega menu */}
          <div className="hidden items-center gap-6 md:flex">
            {MEGA_MENUS.map((group) => (
              <div
                key={group.label}
                className="relative pb-16 -mb-16"
                onMouseEnter={() => setHoveredMenu(group.label)}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <button className="flex items-center gap-1 text-sm text-muted transition-colors hover:text-ink">
                  {group.label}
                  <svg
                    className={`h-3 w-3 transition-transform duration-200 ${hoveredMenu === group.label ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <MegaMenuDropdown
                  group={group}
                  isOpen={hoveredMenu === group.label}
                  onClose={() => setHoveredMenu(null)}
                />
              </div>
            ))}
            {STANDALONE_LINKS.map((link) =>
              link.href.startsWith("/#") ? (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href, navigate)}
                  className="text-sm text-muted transition-colors hover:text-ink"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm text-muted transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>

          {/* Desktop auth */}
          <div className="hidden items-center gap-4 md:flex">
            {!isAuthLoaded ? (
              <span className="text-lg text-muted loading-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            ) : user ? (
              <div className="group relative">
                <button className="flex items-center gap-2 rounded-full bg-surface2 border border-line px-3 py-1 font-mono text-sm text-ink transition-colors hover:border-blue/40">
                  <span>{user.name}</span>
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted transition-transform duration-200 group-hover:rotate-180"
                  >
                    <path d="M2 4l3 3 3-3" />
                  </svg>
                </button>
                <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute right-0 top-full mt-2 w-44 rounded-xl border border-line/60 bg-surface/95 backdrop-blur-xl py-1 shadow-2xl shadow-black/40 transition-all duration-200">
                  <div className="px-3 py-2 border-b border-line/40">
                    <p className="text-xs text-muted truncate">{user.email}</p>
                  </div>
                  {user.roles.includes("admin") && (
                    <Link
                      to="/admin"
                      className="block px-3 py-2 text-sm text-muted hover:text-ink hover:bg-white/5 transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full text-left px-3 py-2 text-sm text-muted hover:text-ink hover:bg-white/5 transition-colors disabled:opacity-50"
                  >
                    {signOutLabel}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-muted transition-colors hover:text-ink"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="rounded-lg bg-blue px-4 py-2 text-sm font-semibold text-bg transition-colors hover:bg-blue/90"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={toggle}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="flex flex-col gap-1.5 md:hidden"
          >
            <span
              className={`h-0.5 w-6 bg-ink transition-transform duration-200 ${mobileOpen ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`h-0.5 w-6 bg-ink transition-opacity duration-200 ${mobileOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`h-0.5 w-6 bg-ink transition-transform duration-200 ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`overflow-hidden transition-all duration-300 md:hidden ${mobileOpen ? "max-h-[600px]" : "max-h-0"}`}
        >
          <div className="space-y-3 border-t border-line bg-surface px-6 py-4">
            {MEGA_MENUS.map((group) => (
              <MobileDropdown
                key={group.label}
                group={group}
                onClose={closeMobile}
              />
            ))}
            {STANDALONE_LINKS.map((link) =>
              link.href.startsWith("/#") ? (
                <button
                  key={link.href}
                  onClick={() => {
                    scrollToSection(link.href, navigate);
                    closeMobile();
                  }}
                  className="block text-sm text-muted transition-colors hover:text-ink"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={closeMobile}
                  className="block text-sm text-muted transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              ),
            )}
            <div className="flex flex-col gap-2 pt-2 border-t border-line mt-2">
              {!isAuthLoaded ? (
                <span className="text-lg text-muted loading-dots">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </span>
              ) : user ? (
                <>
                  <span className="rounded-full bg-surface2 border border-line px-3 py-1 font-mono text-sm text-ink w-fit">
                    {user.name}
                  </span>
                  {user.roles.includes("admin") && (
                    <Link
                      to="/admin"
                      onClick={closeMobile}
                      className="text-sm text-muted hover:text-ink"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMobile();
                    }}
                    disabled={isLoggingOut}
                    className="text-left text-sm text-muted hover:text-ink disabled:opacity-50"
                  >
                    {signOutLabel}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMobile}
                    className="text-sm text-muted hover:text-ink"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={closeMobile}
                    className="rounded-lg bg-blue px-4 py-2 text-center text-sm font-semibold text-bg"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Bottom floating navbar ── */}
      <div
        className="fixed bottom-5 left-0 right-0 z-50 hidden lg:flex justify-center transition-all duration-300"
        style={{
          transform: showBottom ? "translateY(0)" : "translateY(24px)",
          opacity: showBottom ? 1 : 0,
          pointerEvents: showBottom ? "auto" : "none",
        }}
      >
        <nav
          aria-label="Floating navigation"
          className="flex items-center gap-1 rounded-2xl border border-line/50 bg-surface/90 backdrop-blur-xl px-2 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.5)] ring-1 ring-white/5"
        >
          <Link
            to="/"
            className="font-mono text-sm font-bold text-ink tracking-tight px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors shrink-0"
          >
            cursor<span className="text-blue">line</span>
          </Link>

          <div className="h-5 w-px bg-line/40 shrink-0" />

          <div className="hidden items-center gap-0.5 lg:flex">
            {MEGA_MENUS.map((group) => (
              <div
                key={group.label}
                className="relative pt-16 -mt-16"
                onMouseEnter={() => setHoveredMenu(group.label)}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <BottomMegaMenuDropdown
                  group={group}
                  isOpen={hoveredMenu === group.label}
                  onClose={() => setHoveredMenu(null)}
                />
              </div>
            ))}
            {STANDALONE_LINKS.map((link) =>
              link.href.startsWith("/#") ? (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href, navigate)}
                  className="rounded-xl px-3.5 py-2.5 text-sm text-muted transition-colors hover:text-ink hover:bg-white/5 shrink-0"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className="rounded-xl px-3.5 py-2.5 text-sm text-muted transition-colors hover:text-ink hover:bg-white/5 shrink-0"
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>

          <div className="h-5 w-px bg-line/40 mx-1 hidden lg:block shrink-0" />

          <div className="hidden items-center gap-1.5 lg:flex">
            {!isAuthLoaded ? (
              <span className="text-lg text-muted loading-dots px-4">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            ) : user ? (
              <div className="group relative">
                <button className="flex items-center gap-2 rounded-xl bg-surface2/80 border border-line/50 px-3.5 py-2 font-mono text-sm text-ink transition-colors hover:border-blue/40">
                  <span>{user.name}</span>
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted transition-transform duration-200 group-hover:rotate-180"
                  >
                    <path d="M2 4l3 3 3-3" />
                  </svg>
                </button>
                <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute right-0 bottom-full mb-3 w-48 rounded-xl border border-line/60 bg-surface/95 backdrop-blur-xl py-1 shadow-2xl shadow-black/40 transition-all duration-200">
                  <div className="px-3.5 py-2.5 border-b border-line/40">
                    <p className="text-xs text-muted truncate">{user.email}</p>
                  </div>
                  {user.roles.includes("admin") && (
                    <Link
                      to="/admin"
                      className="block px-3.5 py-2.5 text-sm text-muted hover:text-ink hover:bg-white/5 transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full text-left px-3.5 py-2.5 text-sm text-muted hover:text-ink hover:bg-white/5 transition-colors disabled:opacity-50"
                  >
                    {signOutLabel}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-xl px-4 py-2.5 text-sm text-muted transition-colors hover:text-ink hover:bg-white/5"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="rounded-xl bg-blue px-5 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-blue/90"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5 lg:hidden">
            {!isAuthLoaded ? null : user ? (
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="rounded-xl px-4 py-2.5 text-sm text-muted transition-colors hover:text-ink hover:bg-white/5 disabled:opacity-50"
              >
                {signOutLabel}
              </button>
            ) : (
              <Link
                to="/signup"
                className="rounded-xl bg-blue px-5 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-blue/90"
              >
                Get Started
              </Link>
            )}
          </div>

          <div className="h-5 w-px bg-line/40 shrink-0" />
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Scroll to top"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-blue/15 text-muted hover:text-blue transition-colors shrink-0"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 12V4M4 7l4-4 4 4" />
            </svg>
          </button>
        </nav>
      </div>
    </>
  );
}
