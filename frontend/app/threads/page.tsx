import Link from "next/link";

export const metadata = {
  title: "Threads | MoneyGreeks",
  description: "Community-driven financial discussions are coming soon to MoneyGreeks.",
};

export default function ThreadsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top accent */}
      <div className="w-full h-1 bg-gray-900"></div>

      <div className="flex-grow flex flex-col items-center justify-center px-6 py-24 text-center">

        {/* Icon */}
        <div className="mb-8 w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
            />
          </svg>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 text-gray-500 text-xs font-bold uppercase tracking-widest mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
          Coming Soon
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 font-serif tracking-tight mb-4">
          Threads is on its way.
        </h1>

        {/* Subtext */}
        <p className="text-gray-500 max-w-md mx-auto text-base leading-relaxed mb-10">
          We&apos;re building a focused space for traders and analysts to discuss 
          ideas, dissect reports, and challenge each other&apos;s theses — no noise, 
          just signal.
        </p>

        {/* Divider */}
        <div className="w-12 h-px bg-gray-200 mb-10"></div>

        {/* Feature list */}
        <ul className="text-sm text-gray-500 space-y-3 mb-12 text-left inline-block">
          {[
            "Threaded discussions on market reports",
            "Community-verified stock ideas",
            "Analyst Q&A and debate forums",
            "Upvote signal, downvote noise",
          ].map((f) => (
            <li key={f} className="flex items-center gap-3">
              <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              {f}
            </li>
          ))}
        </ul>

        {/* Back link */}
        <Link
          href="/"
          className="text-sm font-semibold text-gray-900 underline underline-offset-4 hover:text-gray-600 transition-colors"
        >
          ← Back to Markets
        </Link>
      </div>

      {/* Bottom border */}
      <div className="w-full h-px bg-gray-100"></div>
    </div>
  );
}
