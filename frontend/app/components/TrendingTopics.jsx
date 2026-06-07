import styles from "../news-today/MarketInsight.module.css";
import { trendingTopics } from "../news-today/data";
import Icon from "./Icon";

export default function TrendingTopics() {
  return (
    <section className={`${styles.card} ${styles.trending}`}>
      <div className={styles.trendingHead}>
        <h3 className={styles.widgetTitle}>
          <Icon name="trending_up" className={styles.up} /> Market Pulse:
          Trending Topics
        </h3>
        <span className={styles.mutedSmall}>
          <span className={styles.liveDot} /> Live Updates
        </span>
      </div>
      <div className={styles.topicList}>
        {trendingTopics.map((topic) => (
          <a href="#" className={styles.topic} key={topic.tag}>
            {topic.tag}
            <span className={topic.trend === "up" ? styles.up : styles.down}>
              <Icon name={topic.direction} />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
