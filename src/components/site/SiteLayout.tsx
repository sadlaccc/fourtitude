import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHero({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  return (
    <section className="hero-mesh text-navy-foreground">
      <div className="grid-lines">
        <div className="section-shell py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">{eyebrow}</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold sm:text-5xl">{title}</h1>
          {lead && <p className="mt-4 max-w-2xl text-base text-navy-foreground/75">{lead}</p>}
        </div>
      </div>
    </section>
  );
}
