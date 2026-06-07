import styles from "../news-today/MarketInsight.module.css";

export default function ArticleCard({ article }) {
  return (
    <article className={`${styles.card} ${styles.articleCard}`}>
      <div className={styles.articleImageWrap}>
        <img src={article.image} alt={article.alt} className={styles.image} />
      </div>
      <div className={styles.articleBody}>
        <div className={styles.meta}>
          <span className={styles.badge}>{article.category}</span>
          <span className={styles.mutedSmall}>{article.readTime}</span>
        </div>
        <h3 className={styles.articleTitle}>{article.title}</h3>
        <p className={styles.articleText}>{article.description}</p>
      </div>
    </article>
  );
}
