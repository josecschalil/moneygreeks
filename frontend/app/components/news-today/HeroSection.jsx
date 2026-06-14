import { images } from "./data";
import MarketTicker from "./MarketTick";
import Link from "next/link";

export default function HeroSection({ post }) {
  return (
    <section className="mb-16">
      <MarketTicker />
      
      <div className="mt-8 mb-12">
        <Link href={`/news-today/${post ? post.slug : "global-markets-rate-hikes"}`} className="block group">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Image Column */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="overflow-hidden rounded-xl">
                <img
                  src={post ? post.featured_image : images.hero}
                  alt={post ? post.title : "Hero Image"}
                  className="w-full h-auto aspect-video object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                />
              </div>
            </div>

            {/* Text Column */}
            <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col justify-center">
              <span className="text-accent uppercase tracking-widest text-xs font-semibold mb-4 block">
                Breaking Analysis
              </span>
              <h1 className="text-5xl lg:text-6xl font-serif text-foreground leading-[1.05] tracking-tight mb-6 group-hover:text-accent transition-colors duration-300">
                {post ? post.title : "Global Markets Brace as Central Banks Signal Aggressive Rate Hikes"}
              </h1>
              <p className="text-lg text-foreground-secondary mb-8 leading-relaxed max-w-lg">
                {post ? post.subtitle : "Investors navigate heightened volatility as major central banks pivot towards tighter monetary policy to combat persistent inflation pressures across key economic zones."}
              </p>
              <div className="flex items-center text-sm text-foreground-secondary font-medium">
                <span className="uppercase tracking-wide">By {post ? post.author : "Sarah Jenkins"}</span>
                <span className="mx-3 border-l border-border h-4 inline-block"></span>
                <span>4 min read</span>
              </div>
            </div>

          </div>
        </Link>
      </div>
    </section>
  );
}
