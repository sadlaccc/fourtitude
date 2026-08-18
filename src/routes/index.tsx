import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, Mail, Phone } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ServiceIcon } from "@/components/site/ServiceIcon";
import { HeroSlider } from "@/components/site/HeroSlider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { postsQuery, servicesQuery, settingsQuery, teamQuery, formatDate } from "@/lib/content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fourtitude Technology Consultants | IT & Software Experts in Kenya" },
      {
        name: "description",
        content:
          "Fourtitude Technology Consultants LTD delivers web design, software development, cybersecurity, data analytics and IT consulting for businesses in Nairobi and beyond.",
      },
      { property: "og:title", content: "Fourtitude Technology Consultants LTD" },
      {
        property: "og:description",
        content: "Empowering innovation through cutting-edge technology solutions in Kenya.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: settings } = useQuery(settingsQuery);
  const { data: services = [] } = useQuery(servicesQuery);
  const { data: team = [] } = useQuery(teamQuery);
  const { data: posts = [] } = useQuery(postsQuery);

  return (
    <SiteLayout>
      <section className="hero-mesh text-navy-foreground">
        <div className="grid-lines">
          <div className="section-shell grid items-center gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Nairobi, Kenya · Since 2023
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
                {settings?.hero_title ?? "Technology that moves your business forward"}
              </h1>
              <p className="mt-5 max-w-xl text-lg text-navy-foreground/75">
                {settings?.hero_subtitle ??
                  "We are an innovative technology consulting firm driving digital transformation."}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/contact">
                    Schedule a consultation <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-navy-foreground/25 bg-transparent text-navy-foreground hover:bg-navy-foreground/10 hover:text-navy-foreground">
                  <Link to="/services">Explore our services</Link>
                </Button>
              </div>
              <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-navy-foreground/15 pt-6">
                {[
                  ["Active clients", settings?.stat_clients ?? 40],
                  ["Projects completed", settings?.stat_projects ?? 65],
                  ["Partners", settings?.stat_partners ?? 12],
                ].map(([label, value]) => (
                  <div key={label as string}>
                    <dt className="text-2xl font-bold text-primary sm:text-3xl">{value}+</dt>
                    <dd className="mt-1 text-xs uppercase tracking-wide text-navy-foreground/60">{label}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <HeroSlider />
          </div>
        </div>
      </section>

      <section className="section-shell py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">What we do</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">We provide the best services for you</h2>
          <p className="mt-4 text-muted-foreground">
            From first idea to long-term support, we deliver good products and services quickly and with
            expertise. Our skilled team cares about making you successful.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((service) => (
            <Card key={service.id} className="group border-border/70 transition-shadow hover:shadow-lg">
              <CardContent className="p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <ServiceIcon name={service.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{service.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{service.summary}</p>
                <Link
                  to="/services"
                  hash={service.slug}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary"
                >
                  Read more <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <Button asChild variant="outline">
            <Link to="/services">View all services</Link>
          </Button>
        </div>
      </section>

      <section className="bg-secondary/60 py-20">
        <div className="section-shell grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">We are a leading consulting business</h2>
            <p className="mt-4 text-muted-foreground">
              We are a trusted technology consulting firm providing innovative solutions to our clients. Our
              highly skilled consultants prioritise clients, resulting in strong relationships with satisfied
              customers.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Customized software tailored to your workflow",
                "Complete satisfaction, on time and on budget",
                "Support that keeps everything running well",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 text-primary" /> Give us a call
                </p>
                <p className="mt-1 font-semibold">{settings?.phone ?? "+254726900262"}</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 text-primary" /> Send us a message
                </p>
                <p className="mt-1 font-semibold">{settings?.email ?? "info@fourtitude.co.ke"}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">Meet the team</h2>
            <p className="mt-4 text-muted-foreground">
              More than a collection of professionals, we are a close-knit group with a shared vision for the
              future.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {team.map((member) => (
                <div key={member.id} className="rounded-lg border border-border bg-card p-4">
                  <img
                    src={member.photo_url}
                    alt={member.name}
                    loading="lazy"
                    className="h-20 w-20 rounded-full object-cover object-top"
                  />
                  <p className="mt-3 font-semibold">{member.name}</p>
                  <p className="text-xs uppercase tracking-wide text-primary">{member.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Insights</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">From our blog</h2>
          </div>
          <Button asChild variant="ghost">
            <Link to="/blog">All articles</Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <Card key={post.id} className="border-border/70">
              <CardContent className="p-6">
                <p className="text-xs uppercase tracking-wide text-primary">{post.category}</p>
                <h3 className="mt-2 text-lg font-semibold leading-snug">{post.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
                <p className="mt-4 text-xs text-muted-foreground">{formatDate(post.published_at)}</p>
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary"
                >
                  Read article <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="section-shell pb-8">
        <div className="hero-mesh rounded-2xl px-8 py-14 text-center text-navy-foreground">
          <h2 className="text-3xl font-bold sm:text-4xl">Need any help? Schedule a consultation.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-navy-foreground/75">
            Let us know your availability so that we can schedule an appointment that suits your convenience.
          </p>
          <Button asChild size="lg" className="mt-7">
            <Link to="/contact">Contact us now</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
