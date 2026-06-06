import styles from './MarketPulse.module.css'

export default function MarketPulse() {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Market Pulse: Pre-Market Action</h2>
      <div className={styles.body}>
        <div className={styles.left}>
          <div className={styles.sentiment}>
            <span className={styles.arrow}>↗</span>
            <span className={styles.label}>Broadly Bullish Setup</span>
          </div>
          <p className={styles.description}>
            Asian markets indicate a positive start following a tech-led rally on Wall Street. GIFT-Nifty
            suggests a gap-up opening of ~80 points. Keep an eye on IT and Auto sectors today.
          </p>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Advances</div>
              <div className={styles.statValue}>1,462</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Declines</div>
              <div className={`${styles.statValue} ${styles.red}`}>845</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Unchanged</div>
              <div className={styles.statValue}>112</div>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.sentimentBox}>
            <div className={styles.percentage}>68%</div>
            <div className={styles.sentimentLabel}>BULLISH SENTIMENT</div>
          </div>
        </div>
      </div>
    </div>
  )
}
