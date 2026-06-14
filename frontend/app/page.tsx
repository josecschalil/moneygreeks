import AcademyBanner from "./components/AcademyBanner";
import MarketNews from "./components/MarketNews";
import MarketPulse from "./components/MarketPulse";
import MarketTicker from "./components/MarketTicker";
import PremiumBanner from "./components/PremiumBanner";
import Sidebar from "./components/Sidebar";
import StocksInFocus from "./components/StocksInFocus";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--mg-bg)]">
      <MarketTicker />

      <div className="mx-auto max-w-[var(--mg-container)] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-8">
            <MarketPulse />
            <PremiumBanner />
            <MarketNews />
            <StocksInFocus />
          </div>
          <Sidebar />
        </div>

        <div className="mt-8">
          <AcademyBanner />
        </div>
      </div>
    </main>
  );
}
