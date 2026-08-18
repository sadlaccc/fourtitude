import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Compass, Eye, Target } from "lucide-react";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { settingsQuery, teamQuery } from "@/lib/content";
import aboutImage from "@/assets/about-work.jpg.asset.json";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us | Fourtitude Technology Consultants" },
      {
        name: "description",
        content:
          "Learn about Fourtitude Technology Consultants LTD — our mission, vision and the team of engineers and consultants behind our work in Kenya.",
      },
      { property: "og:title", content: "About Fourtitude Technology Consultants" },
      {
        property: "og:description",
        content: "A close-knit consulting team with a shared vision for the future of technology in Kenya.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { data: settings } = useQuery(settingsQuery);
  const { data: team = [] } = useQuery(teamQuery);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="About us"
        title={settings?.tagline ?? "Empowering innovation through technology"}
        lead={settings?.about ?? "An innovative technology consulting firm based in Nairobi, Kenya."}
      />

      <section className="section-shell grid items-center gap-10 py-16 lg:grid-cols-2">
        <img
          src={aboutImage}
          alt="Consultant reviewing security dashboards"
          loading="lazy"
          width={1408}
          height={1008}
          className="rounded-xl border border-border object-cover"
        />
        <div>
          <h2 className="text-3xl font-bold">Who we are</h2>
          <p className="mt-4 text-muted-foreground">
            {settings?.about ??
              "Fourtitude Technology Consultants LTD is an innovative firm delivering technology solutions that help organisations work smarter."}
          </p>
          <div className="mt-6 grid gap-4">
            <Card className="border-border/70">
              <CardContent className="flex gap-4 p-5">
                <Target className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h3 className="font-semibold">Our mission</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{settings?.mission}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/70">
              <CardContent className="flex gap-4 p-5">
                <Eye className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h3 className="font-semibold">Our vision</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{settings?.vision}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/70">
              <CardContent className="flex gap-4 p-5">
                <Compass className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h3 className="font-semibold">How we work</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Clear communication, honest scoping and long-term support — we stay accountable after
                    delivery.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-secondary/60 py-16">
        <div className="section-shell">
          <h2 className="text-3xl font-bold">Our team</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            More than a collection of professionals, we are a close-knit group of engineers and consultants
            with a shared vision.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div key={member.id} className="rounded-xl border border-border bg-card p-5">
                <img
                  src={member.photo_url}
                  alt={member.name}
                  loading="lazy"
                  className="h-28 w-28 rounded-full object-cover object-top"
                />
                <h3 className="mt-4 font-semibold">{member.name}</h3>
                <p className="text-xs uppercase tracking-wide text-primary">{member.title}</p>
                <p className="mt-3 text-sm text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
