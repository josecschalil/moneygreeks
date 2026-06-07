import styles from "./MarketInsight.module.css";
import HeroSection from "../components/HeroSection";
import LatestIntelligence from "../components/LatestIntelligence";
import DeepDiveSection from "../components/DeepDiveSection";
import TrendingTopics from "../components/TrendingTopics";
import AdvancedMarketFeed from "../components/AdvancedMarketFeed";
export default function MarketInsightPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <HeroSection />
        <LatestIntelligence />
        <DeepDiveSection />
        <TrendingTopics />
        <AdvancedMarketFeed />
      </main>
    </div>
  );
}
