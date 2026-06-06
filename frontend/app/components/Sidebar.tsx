import styles from './Sidebar.module.css'

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      {/* Institutional Activity */}
      <div className={styles.card}>
        <div className={styles.cardTitle}>INSTITUTIONAL ACTIVITY (PROVISIONAL)</div>
        <div className={styles.activityRow}>
          <div>
            <div className={styles.activityName}>FII / FPI</div>
            <div className={styles.activitySub}>Foreign Inst. Investors</div>
          </div>
          <div className={styles.activityRight}>
            <div className={styles.activityAmount + ' ' + styles.red}>- ₹2,345 Cr</div>
            <div className={styles.badge + ' ' + styles.badgeRed}>Net-Sell</div>
          </div>
        </div>
        <div className={styles.divider} />
        <div className={styles.activityRow}>
          <div>
            <div className={styles.activityName}>DII</div>
            <div className={styles.activitySub}>Domestic Inst. Investors</div>
          </div>
          <div className={styles.activityRight}>
            <div className={styles.activityAmount + ' ' + styles.green}>+ ₹1,850 Cr</div>
            <div className={styles.badge + ' ' + styles.badgeGreen}>Net Buy</div>
          </div>
        </div>
        <a href="#" className={styles.viewLink}>View Historical Trends →</a>
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
            <div className={styles.calendarEvent}>India CPI Inflation (Mar)</div>
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

      {/* IPO Center */}
      <div className={styles.card}>
        <div className={styles.cardTitle}>IPO CENTER</div>
        <div className={styles.ipoBox}>
          <div className={styles.ipoTop}>
            <div className={styles.ipoName}>TechNova Solutions</div>
            <div className={styles.ipoGmp}>GMP: +45%</div>
          </div>
          <div className={styles.ipoStatus}>
            <span className={styles.openBadge}>Open</span>
          </div>
          <div className={styles.ipoMeta}>
            <span>Sub: 12.5x</span>
            <span>Closes: Today</span>
          </div>
        </div>
        <button className={styles.viewAllBtn}>View All IPOs</button>
      </div>

      {/* Trending Tags */}
      <div className={styles.card}>
        <div className={styles.cardTitle}>TRENDING TAGS</div>
        <div className={styles.tags}>
          {['#Nifty50', '#Q4Earnings', '#BankingSector', '#RBI', '#EVStocks'].map((tag) => (
            <a key={tag} href="#" className={styles.tag}>{tag}</a>
          ))}
        </div>
      </div>
    </aside>
  )
}
