import styles from "../news-today/MarketInsight.module.css";
import { deepDiveArticles } from "../news-today/data";
import Icon from "./Icon";
import SectionHeader from "./SectionHeader";
import SidebarWidgets from "./SidebarWidgets";
import Link from "next/link";

function DeepArticle({ article }) {
  const href = article.slug ? `/news-today/${article.slug}` : "#";
  return (
    <Link href={href} className="block group">
      <article className={`${styles.card} ${styles.deepArticle} transition-all duration-300 hover:shadow-lg hover:border-gray-300`}>
        <div className={`${styles.deepImageWrap} overflow-hidden`}>
          <img 
            src={article.featured_image || article.image} 
            alt={article.title || article.alt} 
            className={`${styles.image} transition-transform duration-500 group-hover:scale-105`} 
          />
        </div>
        <div className={styles.deepBody}>
          <div className={styles.meta}>
            <span className={styles.badge}>{article.category}</span>
            <span className={styles.mutedSmall}>{article.readTime}</span>
          </div>
          <h3 className={`${styles.articleTitle} transition-colors duration-200 group-hover:text-blue-600`}>
            {article.title}
          </h3>
          <p className={styles.articleText}>{article.subtitle || article.description}</p>
          <span className={`${styles.readLink} transition-all duration-200 group-hover:translate-x-1 inline-flex items-center gap-1`}>
            Read Analysis <Icon name="arrow_forward" />
          </span>
        </div>
      </article>
    </Link>
  );
}

export default function DeepDiveSection({ posts, mostRead }) {
  const displayPosts = posts || deepDiveArticles;
  return (
    <section className={styles.deepGrid}>
      <div className={styles.deepMain}>
        <SectionHeader title="Deep Dive Analysis" />
        <div className={styles.deepColumn}>
          {displayPosts.map((article, i) => (
            <DeepArticle key={article.slug || i} article={article} />
          ))}
        </div>
      </div>
      <SidebarWidgets mostRead={mostRead} />
    </section>
  );
}
