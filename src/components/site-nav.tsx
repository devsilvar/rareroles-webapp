import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useGetStarted } from "./get-started-modal";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Services" },
  { to: "/why-choose-us", label: "Why Choose Us" },
  { to: "/contact", label: "Contact Us" },
] as const;

function Mark() {
  return (
    <div className="flex items-center">
      <img
        src="/logo.jpg"
        alt="RareRoles"
        className="h-11 w-auto object-contain md:h-12"
      />
    </div>
  );
}

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const { open: openGetStarted } = useGetStarted();

  useEffect(() => {
    // no-op: nav is a floating pill and doesn't change on scroll
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full pt-4 md:py-6">
      <div className="container-page">
        <div className="flex items-center justify-between gap-4 rounded-full border border-border bg-card/90 px-3 py-2 shadow-soft backdrop-blur-xl md:px-4 md:py-2.5">
          {/* Left: brand */}
          <Link to="/" className="pl-1 text-foreground md:pl-2">
            <Mark />
          </Link>

          {/* Center: nav */}
          <nav className="hidden items-center gap-2 md:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `group relative px-5 py-2.5 font-display text-base font-semibold tracking-tight transition-colors hover:text-foreground ${
                    isActive ? "text-foreground" : "text-foreground/70"
                  }`
                }
              >
                {({ isActive }) => (
                  <span className="relative">
                    {l.label}
                    {/* Active and hover bottom border */}
                    <span
                      className={`absolute -bottom-0.5 left-0 h-[2px] bg-gradient-to-r from-accent/80 via-accent to-accent/80 transition-all duration-300 ${
                        isActive
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      }`}
                    />
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right: auth */}
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => openGetStarted()}
              className="inline-flex items-center rounded-full bg-foreground px-6 py-3 font-display text-base font-bold text-background shadow-soft transition-all hover:-translate-y-px hover:shadow-elevated hover:bg-accent"
            >
              Get Started
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((o) => !o)}
            className="rounded-full border border-border p-2 text-foreground md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="mt-2 rounded-2xl border border-border bg-card p-2 shadow-soft md:hidden">
            <div className="flex flex-col gap-1">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 font-display text-base font-semibold transition-colors ${
                      isActive
                        ? "bg-muted text-foreground"
                        : "text-foreground hover:bg-muted/50"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <div className="mt-1 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    openGetStarted();
                  }}
                  className="inline-flex w-full items-center justify-center rounded-full bg-foreground px-5 py-3 font-display text-base font-bold text-background hover:bg-accent"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
