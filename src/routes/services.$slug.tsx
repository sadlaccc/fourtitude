import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { ServiceIcon } from "@/components/site/ServiceIcon";
import { Button } from "@/components/ui/button";
import { servicesQuery } from "@/lib/content";

export const Route = createFileRoute("/services/$slug")({
  head: ({ params }) => {
    const name = params.slug
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
    return {
      meta: [
        { title: `${name} | Fourtitude Technology Consultants` },
        {
          name: "description",
          content: `${name} services delivered by Fourtitude Technology Consultants in Kenya — practical delivery, clear costs and ongoing support.`,
        },
        { property: "og:title", content: `${name} | Fourtitude Technology Consultants` },
        {
          property: "og:description",
          content: `How Fourtitude delivers ${name.toLowerCase()} for growing businesses and institutions.`,
        },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ServiceDetailPage,
});

function ServiceDetailPage() {
  const { slug } = Route.useParams();
  const { data: services = [], isLoading } = useQuery(servicesQuery);
  const service = services.find((item) => item.slug === slug);
  const others = services.filter((item) => item.slug !== slug).slice(0, 3);

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="section-shell py-24 text-muted-foreground">Loading service…</div>
      </SiteLayout>
    );
  }

  if (!service) {
    return (
      <SiteLayout>
        <div className="section-shell py-24 text-center">
          <h1 className="text-3xl font-bold">Service not found</h1>
          <p className="mt-2 text-muted-foreground">
            The service you are looking for is not available.
          </p>
          <Button asChild className="mt-6">
            <Link to="/services">Back to services</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <PageHero eyebrow="Service" title={service.title} lead={service.summary} />

      <section className="section-shell py-16">
        <Link
          to="/services"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> All services
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[2fr_1fr]">
          <article className="rounded-xl border border-border bg-card p-8">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <ServiceIcon name={service.icon} className="h-5 w-5" />
            </span>
            <h2 className="mt-5 text-xl font-semibold">What this looks like</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">
              {service.details}
            </p>
          </article>

          <aside className="space-y-6">
            <div className="rounded-xl border border-border bg-secondary/50 p-6">
              <h3 className="text-base font-semibold">Start a conversation</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Tell us about your goals and we will come back with a practical plan.
              </p>
              <Button asChild className="mt-5 w-full">
                <Link to="/contact">
                  Talk to us <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {others.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-base font-semibold">Other services</h3>
                <ul className="mt-4 space-y-3">
                  {others.map((item) => (
                    <li key={item.id}>
                      <Link
                        to="/services/$slug"
                        params={{ slug: item.slug }}
                        className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground"
                      >
                        <ServiceIcon name={item.icon} className="h-4 w-4 text-primary" />
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}
