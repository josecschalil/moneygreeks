import styles from './MarketPulse.module.css'

export default async function MarketPulse() {
  let stats = { advances: 1462, declines: 845, unchanged: 112, sentiment: 'BULLISH SENTIMENT', percent: '68%', label: 'Broadly Bullish Setup', arrow: '↗' };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/market-breadth/`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      const items = Array.isArray(data) ? data : (data.results || []);
      if (items.length > 0) {
        const item = items[0];
        stats = {
          advances: item.advances,
          declines: item.declines,
          unchanged: item.unchanged,
          sentiment: item.market_sentiment || 'NEUTRAL',
          percent: item.bullish_percent ? `${item.bullish_percent}%` : '50%',
          label: item.sentiment_label || 'Neutral Setup',
          arrow: item.advances > item.declines ? '↗' : '↘'
        };
      }
    }
  } catch (err) {
    console.warn("Could not fetch market-breadth, using fallback data.");
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Market Pulse: Pre-Market Action</h2>
      <div className={styles.body}>
        <div className={styles.left}>
          <div className={styles.sentiment}>
            <span className={styles.arrow}>{stats.arrow}</span>
            <span className={styles.label}>{stats.label}</span>
          </div>
          <p className={styles.description}>
            Asian markets indicate a positive start following a tech-led rally on Wall Street. GIFT-Nifty
            suggests a gap-up opening of ~80 points. Keep an eye on IT and Auto sectors today.
          </p>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Advances</div>
              <div className={styles.statValue}>{stats.advances}</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Declines</div>
              <div className={`${styles.statValue} ${styles.red}`}>{stats.declines}</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Unchanged</div>
              <div className={styles.statValue}>{stats.unchanged}</div>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.sentimentBox}>
            <div className={styles.percentage}>{stats.percent}</div>
            <div className={styles.sentimentLabel}>{stats.sentiment}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
