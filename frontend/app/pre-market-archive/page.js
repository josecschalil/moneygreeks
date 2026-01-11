import Image from "next/image";
import Link from "next/link";
async function fetchPreMarketData() {
  const res = await fetch("http://127.0.0.1:8000/report-list/", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch pre-market data");
  }
  return res.json();
}
export default async function BlogPage() {
  const premarketData = await fetchPreMarketData();

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-24">
        <section>
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-3">
                All Available Pre-Market Reports
              </h2>
              <p className="text-lg text-gray-600">
                Catch up on recent market analysis
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {premarketData.map((post) => (
              <Link key={post.id} href={`/market-data/${post.slug}`}>
                <article className="group h-full">
                  <div className="relative h-64 rounded-2xl overflow-hidden mb-6 bg-gray-100">
                    <Image
                      src={post.image_url}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-sm font-medium text-gray-500 pb-2">
                      {post.report_date}
                    </span>

                    <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-gray-600 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed line-clamp-2">
                      {post.overall_conclusion}
                    </p>

                    <div className="pt-2">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 group-hover:gap-3 transition-all">
                        Read More
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
