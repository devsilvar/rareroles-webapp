import { Link } from "react-router-dom";
import { useGetStarted } from "./get-started-modal";

export function SiteFooter() {
  const { open: openGetStarted } = useGetStarted();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-page py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link to="/" className="flex items-center gap-3 text-foreground">
              <img
                src="/logo.jpg"
                alt="RareRoles"
                className="h-12 w-auto object-contain md:h-14"
              />
            </Link>
            <p className="text-display mt-8 max-w-md text-3xl text-foreground md:text-4xl">
              Connecting companies to rare tech talent.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => openGetStarted("hiring")}
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-display text-sm font-bold text-accent-foreground shadow-lg transition-all duration-200 hover:scale-105 hover:bg-accent/90 hover:shadow-xl"
              >
                Hire talent
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>
              <button
                type="button"
                onClick={() => openGetStarted("talent")}
                className="group inline-flex items-center gap-2 rounded-full border-2 border-border-strong px-5 py-2.5 font-display text-sm font-bold text-foreground transition-all duration-200 hover:scale-105 hover:border-foreground/40 hover:bg-surface-elevated"
              >
                Join network
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-7 md:grid-cols-1">
            <FooterCol
              title="Company"
              links={[
                { to: "/", label: "Home" },
                { to: "/companies", label: "For Companies" },
                { to: "/talent", label: "For Talent" },
                { to: "/about", label: "About" },
                { to: "/contact", label: "Contact" },
              ]}
            />
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 text-xs text-ink-muted md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} RareRoles. All rights reserved.</p>
          <p className="font-mono uppercase tracking-widest">Rare talent. Faster hires.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <h4 className="text-eyebrow">{title}</h4>
      <ul className="mt-5 space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              to={l.to}
              className="text-sm text-ink-muted transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
