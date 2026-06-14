import Link from "next/link";
import { images } from "../news-today/data";
import MarketTicker from "./MarketTick";

export default function HeroSection({ post }) {
  const href = `/news-today/${post ? post.slug : "global-markets-rate-hikes"}`;

  return (
    <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <Link href={href} className="group block">
        <article className="relative min-h-[420px] overflow-hidden rounded-[var(--mg-radius)] border border-[var(--mg-border)] bg-[var(--mg-surface)] shadow-[var(--mg-shadow)]">
          <img
            src={post ? post.featured_image : images.hero}
            alt={post ? post.title : "Financial charts on multiple monitors."}
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/28 to-black/8" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
            <span className="inline-flex rounded-full bg-white/92 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-[var(--mg-text)]">
              Breaking
            </span>
            <h1 className="mt-5 max-w-3xl font-heading text-3xl font-semibold leading-tight text-white md:text-5xl">
              {post ? post.title : "Global markets brace as central banks signal aggressive rate hikes"}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/78 md:text-base">
              {post
                ? post.subtitle
                : "Investors navigate heightened volatility as major central banks pivot toward tighter policy."}
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-xs text-white/72">
              <span>By {post ? post.author : "MoneyGreeks Desk"}</span>
              <span>4 min read</span>
            </div>
          </div>
        </article>
      </Link>
      <MarketTicker />
    </section>
  );
}
