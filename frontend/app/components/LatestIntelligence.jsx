import styles from "../news-today/MarketInsight.module.css";
import { latestArticles } from "../news-today/data";
import ArticleCard from "./ArticleCard";
import SectionHeader from "./SectionHeader";

export default function LatestIntelligence({ posts }) {
  const displayPosts = posts || latestArticles;
  return (
    <section>
      <SectionHeader title="Latest Intelligence" viewAll />
      <div className={styles.articleGrid}>
        {displayPosts.map((article, i) => (
          <ArticleCard key={article.slug || i} article={article} />
        ))}
      </div>
    </section>
  );
}
