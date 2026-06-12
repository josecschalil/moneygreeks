import styles from "../news-today/MarketInsight.module.css";
import { mostRead as defaultMostRead } from "../news-today/data";
import SentimentWidget from "./SentimentWidget";
import Link from "next/link";

export default function SidebarWidgets({ mostRead }) {
  const displayMostRead = mostRead?.length ? mostRead : defaultMostRead;

  return (
    <aside className={styles.sidebar}>
      <SentimentWidget />

      <div className={`${styles.card} ${styles.widget}`}>
        <h3 className={styles.widgetTitle}>Most Read</h3>
        <ol className={styles.mostReadList}>
          {displayMostRead.map((item, index) => (
            <li className={styles.mostReadItem} key={item.slug || index}>
              <span className={styles.rank}>{index + 1}</span>
              <div>
                <Link href={`/news-today/${item.slug}`} className="hover:underline">
                  <h4 className={styles.mostReadTitle}>{item.title}</h4>
                </Link>
                <span className={styles.mutedSmall}>
                  {item.view_count !== undefined ? `${item.view_count} views` : item.meta}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
}
