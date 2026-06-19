import Image from "next/image";
import { notFound } from "next/navigation";
import { User, Calendar, Clock } from "lucide-react";
import RecommendedPosts from "@/app/components/recommended";
import PageTracker from "@/app/components/PageTracker";
import {
  absoluteUrl,
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  defaultOpenGraphImage,
  extractFirstImage,
  getContentWordCount,
  getSiteUrl,
  splitKeywords,
} from "@/app/utils/seo";

/* -------------------- DATA FETCH -------------------- */
async function getBlogPost(slug) {
  if (!slug) notFound();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blog-post/${slug}/`, {
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

  const metaTitle = post.meta_title || `${post.title} | MoneyGreeks`;
  const metaDescription = post.meta_description || post.subtitle || "";
  const metaKeywords = splitKeywords(post.meta_keywords);
  const canonicalUrl = `${getSiteUrl()}/blog-post/${slug}`;
  const imageUrl = absoluteUrl(post.featured_image || extractFirstImage(post.content) || defaultOpenGraphImage());
  const datePublished = post.created_at || post.date;
  const dateModified = post.updated_at || datePublished;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      type: "article",
      publishedTime: datePublished,
      modifiedTime: dateModified,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [imageUrl],
    },
  };
}

/* -------------------- PAGE -------------------- */
export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  if (!slug) notFound();

  const post = await getBlogPost(slug);

  // Format date deterministically from YYYY-MM-DD to avoid timezone differences
  function formatDate(dateStr) {
    if (!dateStr) return dateStr;
    const parts = String(dateStr).split("-");
    if (parts.length < 3) return dateStr;
    const [year, month, day] = parts.map((p) => parseInt(p, 10));
    if (!year || !month || !day) return dateStr;
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${monthNames[month - 1]} ${day}, ${year}`;
  }

  const formattedDate = formatDate(post.created_at);

  const renderContent = (content) => {
    if (typeof content === "string") return <div className="whitespace-pre-line">{content}</div>;
    if (!Array.isArray(content)) return null;
    return content.map((block, i) => {
      switch (block.type) {
        case "h1": return <h2 key={i} className="text-2xl font-bold text-gray-900 mt-8 mb-4">{block.text}</h2>;
        case "paragraph": return <p key={i} className="mb-6 leading-relaxed">{block.text}</p>;
        case "image": return (
          <figure key={i} className="my-8">
            <img src={block.url} alt={block.caption || ""} className="w-full rounded-xl shadow-sm" />
            {block.caption && <figcaption className="text-center text-sm text-gray-500 mt-3">{block.caption}</figcaption>}
          </figure>
        );
        default: return null;
      }
    });
  };

  const canonicalUrl = `${getSiteUrl()}/blog-post/${slug}`;
  const wordCount = getContentWordCount(post.content);
  const imageUrl = absoluteUrl(post.featured_image || extractFirstImage(post.content) || defaultOpenGraphImage());
  const jsonLd = buildArticleJsonLd({
    type: "BlogPosting",
    title: post.title,
    description: post.meta_description || post.subtitle || "",
    url: canonicalUrl,
    image: imageUrl,
    datePublished: post.created_at || post.date,
    dateModified: post.updated_at || post.created_at || post.date,
    author: post.author || "Jose C S",
    section: post.category,
    keywords: splitKeywords(post.meta_keywords),
    wordCount,
  });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: getSiteUrl() },
    { name: "Blog", url: `${getSiteUrl()}/blog` },
    { name: post.title, url: canonicalUrl },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <PageTracker pageType="blog_post" pageSlug={slug} pageTitle={post.title} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="max-w-7xl mx-auto px-4 py-2 md:py-10 grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <main className="lg:col-span-3">
          <article className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <header className="px-6 pt-2 pb-6 border-b md:pt-8">
              <span className="inline-block px-4 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                {post.category}
              </span>

              <h1 className="text-3xl font-bold text-gray-900 mt-4 leading-tight">
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
              <div className="text-lg leading-relaxed text-gray-800 font-sans">
                {renderContent(post.content)}
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
