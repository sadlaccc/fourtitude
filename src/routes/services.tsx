import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { ServiceIcon } from "@/components/site/ServiceIcon";
import { Button } from "@/components/ui/button";
import { servicesQuery } from "@/lib/content";

export const Route = createFileRoute("/services")({
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
        <div className="space-y-6">
          {services.map((service, index) => (
            <article
              key={service.id}
              id={service.slug}
              className="scroll-mt-28 rounded-xl border border-border bg-card p-7 md:flex md:gap-8"
            >
              <div className="md:w-64 md:shrink-0">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <ServiceIcon name={service.icon} className="h-5 w-5" />
                </span>
                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-1 text-xl font-semibold">{service.title}</h2>
              </div>
              <div className="mt-5 md:mt-0">
                <p className="font-medium">{service.summary}</p>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {service.details}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-border bg-secondary/60 p-8 text-center">
          <h2 className="text-2xl font-bold">Not sure where to start?</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            Tell us about your goals and we will map out a practical plan with clear costs and timelines.
          </p>
          <Button asChild className="mt-6">
            <Link to="/contact">
              Talk to a consultant <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
