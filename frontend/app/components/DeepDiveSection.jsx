import Link from "next/link";
import { deepDiveArticles } from "../news-today/data";
import Icon from "./Icon";
import SectionHeader from "./SectionHeader";
import SidebarWidgets from "./SidebarWidgets";

function DeepArticle({ article }) {
  const href = article.slug ? `/news-today/${article.slug}` : "#";

  return (
    <Link href={href} className="group block">
      <article className="grid overflow-hidden rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] shadow-[var(--mg-shadow)] transition hover:-translate-y-0.5 hover:border-[var(--mg-border-strong)] md:grid-cols-[260px_1fr]">
        <div className="aspect-[16/10] overflow-hidden bg-[var(--mg-surface-muted)] md:aspect-auto">
          <img
            src={article.featured_image || article.image}
            alt={article.title || article.alt || ""}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </div>
        <div className="p-5 md:p-6">
          <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--mg-text-soft)]">
            <span className="rounded-full bg-[var(--mg-surface-muted)] px-2.5 py-1 font-medium">
              {article.category || "Analysis"}
            </span>
            <span>{article.readTime || "8 min read"}</span>
          </div>
          <h3 className="mt-4 font-heading text-xl font-semibold leading-snug text-[var(--mg-text)] group-hover:text-[var(--mg-text-muted)]">
            {article.title}
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--mg-text-muted)]">
            {article.subtitle || article.description}
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--mg-text)]">
            Read analysis
            <Icon name="arrow_forward" />
          </span>
        </div>
      </article>
    </Link>
  );
}

export default function DeepDiveSection({ posts, mostRead }) {
  const displayPosts = posts?.length ? posts : deepDiveArticles;

  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div>
        <SectionHeader title="Deep Dive Analysis" />
        <div className="space-y-5">
          {displayPosts.map((article, index) => (
            <DeepArticle key={article.slug || index} article={article} />
          ))}
        </div>
      </div>
      <SidebarWidgets mostRead={mostRead} />
    </section>
  );
}
