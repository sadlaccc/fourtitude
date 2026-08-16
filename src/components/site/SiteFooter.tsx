import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Mail, MapPin, Phone } from "lucide-react";
import { settingsQuery } from "@/lib/content";
import logo from "@/assets/profile.png.asset.json";

export function SiteFooter() {
  const { data: settings } = useQuery(settingsQuery);

  return (
    <footer className="mt-24 bg-navy text-navy-foreground">
      <div className="section-shell grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <img src={logo.url} alt="Fourtitude logo" className="h-12 w-12 rounded bg-navy-foreground/95 p-1" />
            <span className="font-display text-lg font-bold">Fourtitude Technology Consultants</span>
          </div>
          <p className="mt-4 max-w-md text-sm text-navy-foreground/70">
            {settings?.tagline ?? "Empowering innovation through cutting-edge technology solutions."}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider">Company</h3>
          <ul className="mt-4 space-y-2 text-sm text-navy-foreground/70">
            <li><Link to="/services" className="hover:text-primary">Services</Link></li>
            <li><Link to="/about" className="hover:text-primary">About us</Link></li>
            <li><Link to="/blog" className="hover:text-primary">Blog</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider">Head office</h3>
          <ul className="mt-4 space-y-3 text-sm text-navy-foreground/70">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-primary" />
              {settings?.address ?? "Nairobi, Kenya"}
            </li>
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 text-primary" />
              <span>
                {settings?.phone ?? "+254726900262"}
                {settings?.phone_alt ? ` | ${settings.phone_alt}` : ""}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 text-primary" />
              {settings?.email ?? "info@fourtitude.co.ke"}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-navy-foreground/10">
        <div className="section-shell flex flex-col gap-2 py-5 text-xs text-navy-foreground/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Fourtitude Technology Consultants LTD. All rights reserved.</p>
          <Link to="/auth" className="hover:text-primary">Staff sign in</Link>
        </div>
      </div>
    </footer>
  );
}
