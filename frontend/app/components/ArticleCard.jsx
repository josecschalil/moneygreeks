import Link from "next/link";

export default function ArticleCard({ article }) {
  const href = article.slug ? `/news-today/${article.slug}` : "#";

  return (
    <Link href={href} className="group block h-full">
      <article className="h-full overflow-hidden rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] shadow-[var(--mg-shadow)] transition hover:-translate-y-0.5 hover:border-[var(--mg-border-strong)]">
        <div className="aspect-[16/10] overflow-hidden bg-[var(--mg-surface-muted)]">
          <img
            src={article.featured_image || article.image}
            alt={article.title || article.alt || ""}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between gap-3 text-xs text-[var(--mg-text-soft)]">
            <span className="rounded-full bg-[var(--mg-surface-muted)] px-2.5 py-1 font-medium">
              {article.category || "Markets"}
            </span>
            <span>{article.readTime || "5 min read"}</span>
          </div>
          <h3 className="mt-4 line-clamp-2 font-heading text-lg font-semibold leading-snug text-[var(--mg-text)] group-hover:text-[var(--mg-text-muted)]">
            {article.title}
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--mg-text-muted)]">
            {article.subtitle || article.description}
          </p>
        </div>
      </article>
    </Link>
  );
}
