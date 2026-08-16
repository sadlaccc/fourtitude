import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/profile.png.asset.json";

const nav = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { session, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="section-shell flex h-18 items-center justify-between gap-6 py-3">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo.url} alt="Fourtitude Technology Consultants logo" className="h-11 w-11 object-contain" />
          <span className="leading-tight">
            <span className="block font-display text-sm font-bold tracking-tight">FOURTITUDE</span>
            <span className="block text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Technology Consultants
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {session ? (
            <Button asChild variant="outline" size="sm">
              <Link to={isAdmin ? "/admin" : "/account"}>{isAdmin ? "Admin" : "My account"}</Link>
            </Button>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link to="/auth">Sign in</Link>
            </Button>
          )}
          <Button asChild size="sm">
            <Link to="/contact">Book a consultation</Link>
          </Button>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md border border-border p-2 lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="section-shell flex flex-col py-3">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2.5 text-sm font-medium text-muted-foreground data-[status=active]:text-primary"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to={session ? (isAdmin ? "/admin" : "/account") : "/auth"}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2.5 text-sm font-medium text-muted-foreground"
            >
              {session ? (isAdmin ? "Admin" : "My account") : "Sign in"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
