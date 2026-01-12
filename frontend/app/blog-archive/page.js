import Image from "next/image";
import Link from "next/link";
async function fetchBlogPostData() {
  const res = await fetch("http://127.0.0.1:8000/blog-post/", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch blog post data");
  }
  return res.json();
}

export default async function BlogPage() {
  const blogPostData = await fetchBlogPostData();
  const blogPosts = blogPostData.slice(0, 3);

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-24">
        {/* ================= FEATURED INSIGHTS ================= */}
        <section>
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-3">
                Market Insights
              </h2>
              <p className="text-lg text-gray-600">
                In-depth analysis and expert perspectives
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Link key={post.slug} href={`/blog-post/${post.slug}`}>
                <article className="group h-full">
                  <div className="relative h-72 rounded-2xl overflow-hidden mb-6 bg-gray-100">
                    <Image
                      src={post.featured_image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="h-px flex-1 bg-gray-200"></span>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 leading-tight group-hover:text-gray-600 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed">
                      {post.subtitle}
                    </p>

                    <div className="pt-2">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 group-hover:gap-3 transition-all">
                        Continue Reading
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
