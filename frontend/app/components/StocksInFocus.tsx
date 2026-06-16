import styles from './StocksInFocus.module.css'

const FALLBACK_STOCKS = [
  { name: 'TATA MOTORS', badge: 'Breakout Alert', price: '₹1,024.50', change: '+24.30 (2.4%)', up: true, path: 'M0,30 C10,28 20,35 30,32 C40,29 50,25 60,22 C70,19 80,24 90,20 C100,16 110,18 120,15' },
  { name: 'HDFC BANK', badge: 'Earnings Update', price: '₹1,540.20', change: '-12.50 (0.8%)', up: false, path: 'M0,20 C10,22 20,18 30,24 C40,28 50,26 60,30 C70,32 80,28 90,35 C100,38 110,34 120,36' },
  { name: 'INFY', badge: 'Volume Shocker', price: '₹1,485.75', change: '+18.20 (1.2%)', up: true, path: 'M0,32 C10,30 20,28 30,25 C40,22 50,26 60,22 C70,18 80,20 90,16 C100,14 110,16 120,12' },
]

export default async function StocksInFocus() {
  let stocks = FALLBACK_STOCKS;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/stock-movers/`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      const items = Array.isArray(data) ? data : (data.results || []);
      if (items.length > 0) {
        stocks = items.slice(0, 3).map((item: any) => {
          const changeVal = parseFloat(item.change || "0");
          return {
            name: item.symbol || item.company_name,
            badge: item.mover_type ? item.mover_type.toUpperCase() : "ACTIVE",
            price: `₹${item.last_price}`,
            change: `${changeVal >= 0 ? '+' : ''}${item.change} (${item.percent_change}%)`,
            up: changeVal >= 0,
            path: changeVal >= 0 
              ? 'M0,30 C10,28 20,35 30,32 C40,29 50,25 60,22 C70,19 80,24 90,20 C100,16 110,18 120,15'
              : 'M0,20 C10,22 20,18 30,24 C40,28 50,26 60,30 C70,32 80,28 90,35 C100,38 110,34 120,36'
          };
        });
      }
    }
  } catch (err) {
    console.warn("Could not fetch stock-movers, using fallback data.");
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Stocks in Focus</h2>
      <div className={styles.grid}>
        {stocks.map((stock) => (
          <div key={stock.name} className={styles.card}>
            <div className={styles.top}>
              <div>
                <div className={styles.name}>{stock.name}</div>
                <div className={styles.badge}>{stock.badge}</div>
              </div>
              <div className={styles.priceBlock}>
                <div className={styles.price}>{stock.price}</div>
                <div className={`${styles.change} ${stock.up ? styles.up : styles.down}`}>
                  {stock.change}
                </div>
              </div>
            </div>
            <svg className={styles.sparkline} viewBox="0 0 120 50" preserveAspectRatio="none">
              <path
                d={stock.path}
                fill="none"
                stroke={stock.up ? '#16a34a' : '#dc2626'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        ))}
      </div>
    </section>
  )
}
