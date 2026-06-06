import Navbar from "./components/navbar";
import MarketTicker from "./components/MarketTicker";
import MarketPulse from "./components/MarketPulse";
import Sidebar from "./components/Sidebar";
import PremiumBanner from "./components/PremiumBanner";
import MarketNews from "./components/MarketNews";
import StocksInFocus from "./components/StocksInFocus";
import AcademyBanner from "./components/AcademyBanner";
import Footer from "./components/footer";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.mi}>
      <MarketTicker />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.layout}>
            <div className={styles.content}>
              <MarketPulse />
              <div className={styles.premiumBannerWrap}>
                <PremiumBanner />
              </div>
              <MarketNews />
              <StocksInFocus />
            </div>
            <Sidebar />
          </div>

          <AcademyBanner />
          <br></br>
        </div>
      </main>
    </div>
  );
}
