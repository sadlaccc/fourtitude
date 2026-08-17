import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { formatDate, postsQuery } from "@/lib/content";

export const Route = createFileRoute("/blog/$slug")({
  head: () => ({
    meta: [
      { title: "Article | Fourtitude Technology Consultants" },
      {
        name: "description",
        content: "Read the latest insights from the Fourtitude Technology Consultants team.",
      },
      { property: "og:title", content: "Article | Fourtitude Technology Consultants" },
      {
        property: "og:description",
        content: "Read the latest insights from the Fourtitude Technology Consultants team.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BlogPost,
});

function BlogPost() {
  const { slug } = Route.useParams();
  const { data: posts = [], isLoading } = useQuery(postsQuery);
  const post = posts.find((p) => p.slug === slug);

  return (
    <SiteLayout>
      <article className="section-shell max-w-3xl py-16">
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-primary">
          <ArrowLeft className="h-3.5 w-3.5" /> All articles
        </Link>
        {isLoading && <p className="mt-8 text-muted-foreground">Loading…</p>}
        {!isLoading && !post && <p className="mt-8 text-muted-foreground">Article not found.</p>}
        {post && (
          <>
            <p className="mt-8 text-xs uppercase tracking-wide text-primary">{post.category}</p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{post.title}</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              {post.author} · {formatDate(post.published_at)}
            </p>
            <p className="mt-6 text-lg text-muted-foreground">{post.excerpt}</p>
            <div className="mt-6 whitespace-pre-line leading-relaxed">{post.content}</div>
          </>
        )}
      </article>
    </SiteLayout>
  );
}
