import Image from "next/image";
import { notFound } from "next/navigation";
import { User, Calendar, Clock } from "lucide-react";
import RecommendedPosts from "../../components/recommended";

/* -------------------- DATA FETCH -------------------- */
async function getBlogPost(slug) {
  if (!slug) notFound();

  const res = await fetch(`http://127.0.0.1:8000/blog-post/${slug}/`, {
    cache: "no-store",
  });

  if (!res.ok) notFound();
  return res.json();
}

/* -------------------- METADATA -------------------- */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (!slug) return { title: "Blog Post | MoneyGreeks" };

  const post = await getBlogPost(slug);

  return {
    title: `${post.title} | MoneyGreeks`,
    description: post.subtitle,
    openGraph: {
      title: post.title,
      description: post.subtitle,
      type: "article",
      publishedTime: post.created_at,
      images: [
        {
          url: post.featured_image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.subtitle,
      images: [post.featured_image],
    },
  };
}

/* -------------------- PAGE -------------------- */
export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  if (!slug) notFound();

  const post = await getBlogPost(slug);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(post.created_at));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* PAGE GRID */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* ================= MAIN CONTENT ================= */}
        <main className="lg:col-span-3">
          <article className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* HEADER */}
            <header className="px-6 pt-8 pb-6 border-b">
              <span className="inline-block px-4 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                {post.category}
              </span>

              <h1 className="text-4xl font-bold text-gray-900 mt-4 leading-tight">
                {post.title}
              </h1>

              <p className="text-xl text-gray-600 mt-4 leading-relaxed">
                {post.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-5 mt-6 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <User size={16} />
                  <span>Jose C S</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Calendar size={16} />
                  <time dateTime={post.created_at}>{formattedDate}</time>
                </div>

                <div className="flex items-center gap-1.5">
                  <Clock size={16} />
                  <span>5 min read</span>
                </div>
              </div>
            </header>

            {/* FEATURED IMAGE */}
            <div className="relative h-[450px] w-full">
              <Image
                src={post.featured_image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* CONTENT */}
            <div className="px-6 md:px-10 py-10">
              <div className="whitespace-pre-line space-y-6 text-lg leading-relaxed text-gray-900">
                {post.content}
              </div>

              {/* AUTHOR - IMPROVED DESIGN */}
              <div className="mt-16 pt-10 border-t border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  About the Author
                </h2>

                <div className="group border border-gray-200 rounded-3xl p-8 flex flex-col sm:flex-row gap-8 bg-white  transition-colors shadow-sm">
                  <div className="flex-shrink-0 w-24 h-24 rounded-2xl  flex items-center justify-center text-2xl font-bold bg-gradient-to-br from-blue-100 to-purple-100 text-gray-700 shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
                    JCS
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Jose C S
                    </h3>
                    <p className="text-gray-600  text-md mb-3">
                      Founder & CEO, MoneyGreeks
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      Jose is a technical analyst, market researcher, educator
                      and trader with 5+ years of experience, specializing in
                      price action, patterns, and market structure.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </main>

        {/* ================= SIDEBAR ================= */}
        <aside className="lg:col-span-1 space-y-6 sticky top-24 h-fit">
          {/* AD 300x250 */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex justify-between mb-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Sponsored
              </h3>
              <span className="text-[10px] text-gray-300 border px-1 rounded">
                Ad
              </span>
            </div>

            <div className="rounded-lg overflow-hidden flex justify-center bg-gray-50">
              <iframe
                title="Ad 300x250"
                className="w-[300px] h-[250px]"
                srcDoc={`
                  <html>
                    <body style="margin:0;display:flex;align-items:center;justify-content:center;background:#f9fafb;font-family:sans-serif;">
                      <div style="color:#9ca3af;text-align:center;font-size:12px;">
                        <strong>300 × 250</strong><br/>Space for Advertisement
                      </div>
                    </body>
                  </html>
                `}
              />
            </div>
          </div>

          {/* AD 300x600 */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex justify-between mb-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Sponsored
              </h3>
            </div>

            <div className="rounded-lg overflow-hidden flex justify-center bg-gray-50">
              <iframe
                title="Ad 300x600"
                className="w-[300px] h-[600px]"
                srcDoc={`
                  <html>
                    <body style="margin:0;display:flex;align-items:center;justify-content:center;background:#f9fafb;font-family:sans-serif;">
                      <div style="color:#9ca3af;text-align:center;font-size:12px;">
                        <strong>300 × 600</strong><br/>Space for Advertisement
                      </div>
                    </body>
                  </html>
                `}
              />
            </div>
          </div>
        </aside>
      </div>
      <RecommendedPosts />
    </div>
  );
}
