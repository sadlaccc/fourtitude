import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, postsQuery } from "@/lib/content";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Insights & Blog | Fourtitude Technology Consultants" },
      {
        name: "description",
        content:
          "Articles and practical guidance on software development, cybersecurity, data analytics and digital transformation from the Fourtitude team.",
      },
      { property: "og:title", content: "Insights from Fourtitude Technology Consultants" },
      { property: "og:description", content: "Practical technology guidance for Kenyan businesses." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const { data: posts = [], isLoading } = useQuery(postsQuery);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Insights"
        title="Ideas, guides and updates from our consultants"
        lead="Practical thinking on building, securing and scaling technology."
      />
      <section className="section-shell py-16">
        {isLoading && <p className="text-muted-foreground">Loading articles…</p>}
        {!isLoading && posts.length === 0 && (
          <p className="text-muted-foreground">No articles published yet.</p>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.id} className="flex flex-col border-border/70">
              <CardContent className="flex flex-1 flex-col p-6">
                <p className="text-xs uppercase tracking-wide text-primary">{post.category}</p>
                <h2 className="mt-2 text-lg font-semibold leading-snug">{post.title}</h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
                <p className="mt-4 text-xs text-muted-foreground">
                  {post.author} · {formatDate(post.published_at)}
                </p>
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
    </SiteLayout>
  );
}
