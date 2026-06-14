import styles from "../news-today/MarketInsight.module.css";
import { marketItems } from "../news-today/data";
import Icon from "./Icon";

export default function MarketTicker({ compact = false }) {
  if (compact) {
    return (
      <div className={`${styles.card} ${styles.compactPanel}`}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitleSmall}>
            <Icon name="monitoring" className={styles.up} /> Indices
          </h2>
          <span className={styles.mutedSmall}>LIVE</span>
        </div>
        <div className={styles.compactList}>
          {marketItems
            .concat([
              {
                name: "EUR/USD",
                value: "1.0742",
                change: "-0.21%",
                trend: "down",
              },
              { name: "VIX", value: "18.45", change: "+4.20%", trend: "up" },
            ])
            .map((item) => (
              <div className={styles.compactIndexRow} key={item.name}>
                <span className={styles.rowTitle}>
                  {item.name
                    .replace("DOW JONES", "DOW")
                    .replace("US 10-YR YIELD", "US 10Y")}
                </span>
                <div className={styles.compactQuote}>
                  <span className={styles.rowValue}>{item.value}</span>
                  <span
                    className={`${styles.compactChange} ${item.trend === "up" ? styles.up : styles.down}`}
                  >
                    {item.change}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.card} ${styles.marketPanel} ${styles.heroSide}`}>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>
          <Icon name="bolt" className={styles.up} filled /> Market Live
        </h2>
        <span className={styles.mutedSmall}>Updated just now</span>
      </div>

      <div className={styles.marketList}>
        {marketItems.map((item) => (
          <div className={styles.marketRow} key={item.name}>
            <div>
              <span className={styles.rowTitle}>{item.name}</span>
              <span className={styles.rowValue}>{item.value}</span>
            </div>
            <div className={styles.rowRight}>
              <span
                className={`${styles.rowTitle} ${item.trend === "up" ? styles.up : styles.down}`}
              >
                {item.change}
              </span>
              {item.points && (
                <span className={styles.mutedSmall}>{item.points}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
