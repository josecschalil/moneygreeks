import styles from "../news-today/MarketInsight.module.css";
import { latestArticles } from "../news-today/data";
import ArticleCard from "./ArticleCard";
import SectionHeader from "./SectionHeader";

export default function LatestIntelligence() {
  return (
    <section>
      <SectionHeader title="Latest Intelligence" viewAll />
      <div className={styles.articleGrid}>
        {latestArticles.map((article) => (
          <ArticleCard key={article.title} article={article} />
        ))}
      </div>
    </section>
  );
}
