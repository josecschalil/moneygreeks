import { deepDiveArticles } from "./data";
import Icon from "./Icon";
import SectionHeader from "./SectionHeader";
import SidebarWidgets from "./SidebarWidgets";
import Link from "next/link";

function DeepArticle({ article }) {
  const href = article.slug ? `/news-today/${article.slug}` : "#";
  return (
    <Link href={href} className="block group mb-10 pb-10 border-b border-border last:border-0 last:pb-0 last:mb-0">
      <article className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="overflow-hidden rounded-xl">
          <img 
            src={article.featured_image || article.image} 
            alt={article.title || article.alt} 
            className="w-full aspect-[4/3] object-cover transition-transform duration-700 ease-in-out group-hover:scale-105" 
          />
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">
              {article.category}
            </span>
            <span className="w-1 h-1 rounded-full bg-border"></span>
            <span className="text-xs font-medium text-foreground-secondary uppercase tracking-wide">
              {article.readTime}
            </span>
          </div>
          <h3 className="text-3xl font-serif leading-tight text-foreground mb-4 group-hover:text-accent transition-colors duration-200">
            {article.title}
          </h3>
          <p className="text-foreground-secondary text-base leading-relaxed mb-6">
            {article.subtitle || article.description}
          </p>
          <span className="flex items-center gap-2 text-sm font-semibold text-foreground tracking-wide group-hover:gap-3 transition-all duration-300">
            Read Analysis <Icon name="arrow_forward" size={16} />
          </span>
        </div>
      </article>
    </Link>
  );
}

export default function DeepDiveSection({ posts, mostRead }) {
  const displayPosts = posts || deepDiveArticles;
  return (
    <section className="mb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        <div className="lg:col-span-8">
          <SectionHeader title="Deep Dive Analysis" />
          <div className="flex flex-col">
            {displayPosts.map((article, i) => (
              <DeepArticle key={article.slug || i} article={article} />
            ))}
          </div>
        </div>
        <div className="lg:col-span-4">
          <SidebarWidgets mostRead={mostRead} />
        </div>
      </div>
    </section>
  );
}
