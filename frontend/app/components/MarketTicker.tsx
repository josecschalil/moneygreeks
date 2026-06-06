import styles from './MarketTicker.module.css'

const indices = [
  { name: 'Nifty 50', value: '22,514.65', change: '+146.25 (0.66%)', up: true },
  { name: 'Bank-Nifty', value: '48,986.30', change: '-46.20 (0.09%)', up: false },
  { name: 'Sensex', value: '74,248.22', change: '+350.81 (0.47%)', up: true },
  { name: 'Midcap-100', value: '50,123.45', change: '+420.15 (0.85%)', up: true },
  { name: 'India-VIX', value: '11.34', change: '-0.45 (3.82%)', up: false },
  { name: 'USD/INR', value: '83.31', change: '+0.05 (0.06%)', up: true },
]

export default function MarketTicker() {
  return (
    <div className={styles.ticker}>
      <div className={styles.inner}>
        {indices.map((idx) => (
          <div key={idx.name} className={styles.item}>
            <div className={styles.name}>{idx.name}</div>
            <div className={styles.value}>{idx.value}</div>
            <div className={`${styles.change} ${idx.up ? styles.up : styles.down}`}>
              <span>{idx.up ? '↑' : '↓'}</span>
              {idx.change}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
