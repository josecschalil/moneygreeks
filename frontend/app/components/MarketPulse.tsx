import styles from "./MarketPulse.module.css";

export default async function MarketPulse() {
  let stats = {
    advances: 1462,
    declines: 845,
    unchanged: 112,
    sentiment: "BULLISH SENTIMENT",
    percent: "68%",
    label: "Broadly Bullish Setup",
    arrow: "↗",
  };

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/market-breadth/`,
      {
        next: { revalidate: 60 },
      },
    );

    if (res.ok) {
      const data = await res.json();
      const items = Array.isArray(data) ? data : data.results || [];

      if (items.length > 0) {
        // Get latest record by id
        const latest = [...items].sort((a, b) => b.id - a.id)[0];

        const advancing = latest.advancing || 0;
        const declining = latest.declining || 0;
        const unchanged = latest.unchanged || 0;

        const total = advancing + declining + unchanged;
        const bullishPercent =
          total > 0 ? Math.round((advancing / total) * 100) : 50;

        stats = {
          advances: advancing,
          declines: declining,
          unchanged,
          sentiment: bullishPercent >= 60 ? "BULLISH SENTIMENT" : "NEUTRAL",
          percent: `${bullishPercent}%`,
          label:
            bullishPercent >= 60 ? "Broadly Bullish Setup" : "Neutral Setup",
          arrow: advancing > declining ? "↗" : "↘",
        };
      }
    }
  } catch (err) {
    console.warn("Could not fetch market-breadth, using fallback data.");
  }
  const description =
    stats.advances > stats.declines
      ? `Market breadth remains positive with ${stats.advances} advancing stocks compared to ${stats.declines} declining stocks. This suggests broader participation in the market rally and reflects constructive investor sentiment across multiple sectors.`
      : `Market breadth is currently under pressure with ${stats.declines} declining stocks exceeding ${stats.advances} advancing stocks. This indicates selling pressure across a wider portion of the market and may reflect cautious investor sentiment.`;

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Market Pulse: Pre-Market Action</h2>

      <div className={styles.body}>
        <div className={styles.left}>
          <div className={styles.sentiment}>
            <span className={styles.arrow}>{stats.arrow}</span>
            <span className={styles.label}>{stats.label}</span>
          </div>

          <p className={styles.description}>{description}</p>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Advances</div>
              <div className={styles.statValue}>{stats.advances}</div>
            </div>

            <div className={styles.stat}>
              <div className={styles.statLabel}>Declines</div>
              <div className={`${styles.statValue} ${styles.red}`}>
                {stats.declines}
              </div>
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
  );
}
