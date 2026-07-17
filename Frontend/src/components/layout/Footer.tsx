import { Link, useNavigate } from "react-router-dom";

interface FooterLink {
  readonly label: string;
  readonly href: string;
  readonly isScroll?: boolean;
}

interface FooterLinkColumnProps {
  readonly title: string;
  readonly links: readonly FooterLink[];
}

function FooterLinkColumn({ title, links }: FooterLinkColumnProps) {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, link: FooterLink) => {
    if (link.isScroll) {
      e.preventDefault();
      if (window.location.pathname === "/") {
        const id = link.href.slice(2);
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate(link.href, { replace: false });
        setTimeout(() => {
          const id = link.href.slice(2);
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  };

  return (
    <div>
      <h3 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-muted">{title}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.href}
              onClick={(e) => handleClick(e, link)}
              className="text-sm text-muted transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const PRODUCT_LINKS: readonly FooterLink[] = [
  { label: "Features", href: "/#features", isScroll: true },
  { label: "Pricing", href: "/#pricing", isScroll: true },
  { label: "How It Works", href: "/#how-it-works", isScroll: true },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Changelog", href: "/changelog" },
];

const RESOURCES_LINKS: readonly FooterLink[] = [
  { label: "Docs", href: "/docs" },
  { label: "Blog", href: "/blog" },
  { label: "Community", href: "/community" },
  { label: "FAQ", href: "/#faq", isScroll: true },
];

const COMPANY_LINKS: readonly FooterLink[] = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/about" },
  { label: "Terms of Service", href: "/about" },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link to="/" className="font-mono text-lg font-bold text-ink">cursor<span className="text-blue">line</span></Link>
            <p className="mt-3 text-sm leading-relaxed text-muted">AI coding assistant that understands your entire codebase.</p>
          </div>
          <FooterLinkColumn title="Product" links={PRODUCT_LINKS} />
          <FooterLinkColumn title="Resources" links={RESOURCES_LINKS} />
          <FooterLinkColumn title="Company" links={COMPANY_LINKS} />
        </div>
        <div className="mt-10 border-t border-line pt-6 text-center text-xs text-muted">
          &copy; {new Date().getFullYear()} Cursorline. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
