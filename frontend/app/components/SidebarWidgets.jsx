import styles from "../news-today/MarketInsight.module.css";
import { mostRead } from "../news-today/data";
import SentimentWidget from "./SentimentWidget";

export default function SidebarWidgets() {
  return (
    <aside className={styles.sidebar}>
      <SentimentWidget />

      <div className={`${styles.card} ${styles.widget}`}>
        <h3 className={styles.widgetTitle}>Most Read</h3>
        <ol className={styles.mostReadList}>
          {mostRead.map((item, index) => (
            <li className={styles.mostReadItem} key={item.title}>
              <span className={styles.rank}>{index + 1}</span>
              <div>
                <h4 className={styles.mostReadTitle}>{item.title}</h4>
                <span className={styles.mutedSmall}>{item.meta}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
}
