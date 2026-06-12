import styles from "../news-today/MarketInsight.module.css";
import Link from "next/link";

export default function ArticleCard({ article }) {
  const href = article.slug ? `/news-today/${article.slug}` : "#";
  return (
    <Link href={href} className="block group h-full">
      <article className={`${styles.card} ${styles.articleCard} h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-gray-300`}>
        <div className={`${styles.articleImageWrap} overflow-hidden`}>
          <img 
            src={article.image} 
            alt={article.alt} 
            className={`${styles.image} transition-transform duration-500 group-hover:scale-105`} 
          />
        </div>
        <div className={styles.articleBody}>
          <div className={styles.meta}>
            <span className={styles.badge}>{article.category}</span>
            <span className={styles.mutedSmall}>{article.readTime}</span>
          </div>
          <h3 className={`${styles.articleTitle} transition-colors duration-200 group-hover:text-blue-600`}>
            {article.title}
          </h3>
          <p className={styles.articleText}>{article.description}</p>
        </div>
      </article>
    </Link>
  );
}
