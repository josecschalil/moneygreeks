import styles from "../news-today/MarketInsight.module.css";
import { marketItems as fallbackMarketItems } from "../news-today/data";
import Icon from "./Icon";

export default async function MarketTicker({ compact = false }) {
  let marketItems = fallbackMarketItems;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/global-indices/`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      const items = Array.isArray(data) ? data : (data.results || []);
      if (items.length > 0) {
        marketItems = items.slice(0, 5).map((item) => {
          const changeVal = parseFloat(item.change || "0");
          return {
            name: item.name || item.index_name,
            value: item.last_price || item.value,
            change: `${changeVal >= 0 ? '+' : ''}${item.percent_change}%`,
            points: `${changeVal >= 0 ? '+' : ''}${item.change}`,
            trend: changeVal >= 0 ? "up" : "down"
          };
        });
      }
    }
  } catch (err) {
    console.warn("Could not fetch global-indices, using fallback data.");
  }

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
