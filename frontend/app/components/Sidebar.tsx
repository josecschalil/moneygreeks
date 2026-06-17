import HomeSidebarSentiment from "./HomeSidebarSentiment";
import styles from "./Sidebar.module.css";

export default async function Sidebar() {
  let fiiItem: any = null;
  let diiItem: any = null;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/institutional-flows/`,
      {
        cache: "no-store",
      },
    );

    if (res.ok) {
      const data = await res.json();
      const items = Array.isArray(data) ? data : data.results || [];

      if (items.length > 0) {
        // Find the latest date in the dataset
        const latestDate = items
          .map((item: any) => item.date)
          .sort()
          .pop();

        // Get all records for that latest date
        const latestDateItems = items.filter(
          (item: any) => item.date === latestDate,
        );

        // Find FII and DII entries
        fiiItem = latestDateItems.find(
          (item: any) => item.institution_type === "FII",
        );

        diiItem = latestDateItems.find(
          (item: any) => item.institution_type === "DII",
        );
      }
    }
  } catch (err) {
    console.warn("Could not fetch institutional flows:");
  }

  const fiiNet = fiiItem ? Number(fiiItem.net_value) : 0;
  const diiNet = diiItem ? Number(diiItem.net_value) : 0;

  const formatCr = (value: number) =>
    `₹${Math.abs(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} Cr`;

  return (
    <aside className={styles.sidebar}>
      {/* Institutional Activity */}
      <div className={styles.card}>
        <div className={styles.cardTitle}>
          INSTITUTIONAL ACTIVITY (PROVISIONAL)
        </div>

        {/* FII */}
        <div className={styles.activityRow}>
          <div>
            <div className={styles.activityName}>FII / FPI</div>
            <div className={styles.activitySub}>Foreign Inst. Investors</div>
          </div>

          <div className={styles.activityRight}>
            <div
              className={`${styles.activityAmount} ${
                fiiNet >= 0 ? styles.green : styles.red
              }`}
            >
              {fiiNet >= 0 ? "+" : "-"} {formatCr(fiiNet)}
            </div>

            <div
              className={`${styles.badge} ${
                fiiNet >= 0 ? styles.badgeGreen : styles.badgeRed
              }`}
            >
              {fiiNet >= 0 ? "Net Buy" : "Net Sell"}
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        {/* DII */}
        <div className={styles.activityRow}>
          <div>
            <div className={styles.activityName}>DII</div>
            <div className={styles.activitySub}>Domestic Inst. Investors</div>
          </div>

          <div className={styles.activityRight}>
            <div
              className={`${styles.activityAmount} ${
                diiNet >= 0 ? styles.green : styles.red
              }`}
            >
              {diiNet >= 0 ? "+" : "-"} {formatCr(diiNet)}
            </div>

            <div
              className={`${styles.badge} ${
                diiNet >= 0 ? styles.badgeGreen : styles.badgeRed
              }`}
            >
              {diiNet >= 0 ? "Net Buy" : "Net Sell"}
            </div>
          </div>
        </div>

        <a href="#" className={styles.viewLink}>
          View Historical Trends →
        </a>
      </div>

      {/* Economic Calendar */}
      <div className={styles.card}>
        <div className={styles.cardTitle}>ECONOMIC CALENDAR</div>

        <div className={styles.calendarRow}>
          <div className={styles.dateBlock}>
            <div className={styles.month}>APR</div>
            <div className={styles.day}>12</div>
          </div>

          <div className={styles.calendarInfo}>
            <div className={styles.calendarEvent}>
              India CPI Inflation (Mar)
            </div>

            <div className={styles.calendarMeta}>
              <span>Exp: 5.0%</span>
              <span>Prev: 5.09%</span>
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.calendarRow}>
          <div className={styles.dateBlock}>
            <div className={styles.month}>APR</div>
            <div className={styles.day}>15</div>
          </div>

          <div className={styles.calendarInfo}>
            <div className={styles.calendarEvent}>WPI Inflation (Mar)</div>

            <div className={styles.calendarMeta}>
              <span>Exp: 0.3%</span>
              <span>Prev: 0.2%</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <HomeSidebarSentiment />
      </div>

      {/* Trending Tags */}
      <div className={styles.card}>
        <div className={styles.cardTitle}>TRENDING TAGS</div>

        <div className={styles.tags}>
          {[
            "#Nifty50",
            "#Q4Earnings",
            "#BankingSector",
            "#RBI",
            "#EVStocks",
          ].map((tag) => (
            <a key={tag} href="#" className={styles.tag}>
              {tag}
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
