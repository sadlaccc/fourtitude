import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { ServiceIcon } from "@/components/site/ServiceIcon";
import { Button } from "@/components/ui/button";
import { servicesQuery } from "@/lib/content";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Services | Fourtitude Technology Consultants" },
      {
        name: "description",
        content:
          "Web design, system development, IT consultation, cybersecurity, data analytics, networking and technical support delivered by Fourtitude in Kenya.",
      },
      { property: "og:title", content: "Our Services | Fourtitude Technology Consultants" },
      {
        property: "og:description",
        content: "End-to-end technology services for growing businesses and institutions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicesPage,
});

const promises = [
  "Fixed scope, clear costs and realistic timelines",
  "Senior consultants on every engagement",
  "Handover, documentation and training included",
  "Ongoing support after go-live",
];

function ServicesPage() {
  const { data: services = [], isLoading } = useQuery(servicesQuery);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Our services"
        title="Solutions built around how your business actually works"
        lead="We combine strategy, engineering and support so technology stops being a cost centre and starts creating advantage."
      />

      <section className="section-shell py-16">
        {isLoading && <p className="text-muted-foreground">Loading services…</p>}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Link
              key={service.id}
              to="/services/$slug"
              params={{ slug: service.slug }}
              className="group flex flex-col rounded-xl border border-border bg-card p-7 transition-colors hover:border-primary/60"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <ServiceIcon name={service.icon} className="h-5 w-5" />
                </span>
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h2 className="mt-5 text-lg font-semibold">{service.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {service.summary}
              </p>
              <span className="mt-5 inline-flex items-center text-sm font-medium text-primary">
                Learn more
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-14 grid gap-8 rounded-xl border border-border bg-secondary/50 p-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">How we work</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Every engagement runs on the same simple promise: understand the problem, ship
              something useful, and stay accountable for it.
            </p>
          </div>
          <ul className="space-y-3">
            {promises.map((item) => (
              <li key={item} className="flex gap-3 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 rounded-xl border border-border bg-card p-8 text-center">
          <h2 className="text-2xl font-bold">Not sure where to start?</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            Tell us about your goals and we will map out a practical plan with clear costs and timelines.
          </p>
          <Button asChild className="mt-6">
            <Link to="/contact">
              Talk to us <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
