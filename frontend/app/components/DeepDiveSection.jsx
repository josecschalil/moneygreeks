import styles from "../news-today/MarketInsight.module.css";
import { deepDiveArticles } from "../news-today/data";
import Icon from "./Icon";
import SectionHeader from "./SectionHeader";
import SidebarWidgets from "./SidebarWidgets";

function DeepArticle({ article }) {
  return (
    <article className={`${styles.card} ${styles.deepArticle}`}>
      <div className={styles.deepImageWrap}>
        <img src={article.image} alt={article.alt} className={styles.image} />
      </div>
      <div className={styles.deepBody}>
        <div className={styles.meta}>
          <span className={styles.badge}>{article.category}</span>
          <span className={styles.mutedSmall}>{article.readTime}</span>
        </div>
        <h3 className={styles.articleTitle}>{article.title}</h3>
        <p className={styles.articleText}>{article.description}</p>
        <a className={styles.readLink} href="#">
          Read Analysis <Icon name="arrow_forward" />
        </a>
      </div>
    </article>
  );
}

export default function DeepDiveSection() {
  return (
    <section className={styles.deepGrid}>
      <div className={styles.deepMain}>
        <SectionHeader title="Deep Dive Analysis" />
        <div className={styles.deepColumn}>
          {deepDiveArticles.map((article) => (
            <DeepArticle key={article.title} article={article} />
          ))}
        </div>
      </div>
      <SidebarWidgets />
    </section>
  );
}
