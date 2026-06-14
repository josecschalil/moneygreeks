import Link from "next/link";

export default function ArticleCard({ article }) {
  const href = article.slug ? `/news-today/${article.slug}` : "#";
  return (
    <Link href={href} className="block group h-full">
      <article className="flex flex-col h-full bg-surface">
        <div className="overflow-hidden rounded-xl mb-4">
          <img 
            src={article.featured_image || article.image} 
            alt={article.title || article.alt} 
            className="w-full aspect-[3/2] object-cover transition-transform duration-700 ease-in-out group-hover:scale-105" 
          />
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">
              {article.category}
            </span>
            <span className="w-1 h-1 rounded-full bg-border"></span>
            <span className="text-xs font-medium text-foreground-secondary uppercase tracking-wide">
              {article.readTime}
            </span>
          </div>
          <h3 className="text-2xl font-serif leading-tight text-foreground mb-3 group-hover:text-accent transition-colors duration-200">
            {article.title}
          </h3>
          <p className="text-foreground-secondary text-base leading-relaxed line-clamp-3">
            {article.subtitle || article.description}
          </p>
        </div>
      </article>
    </Link>
  );
}
