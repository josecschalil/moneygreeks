import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { User, Calendar, Clock, ArrowLeft } from "lucide-react";
import RecommendedPosts from "@/app/components/recommended";
import NewsletterSidebarWidget from "@/app/components/NewsletterSidebarWidget";

interface ContentBlock {
  type: "h1" | "paragraph" | "image";
  text?: string;
  url?: string;
  caption?: string;
}

interface ArticleData {
  title: string;
  author: string;
  authorDesignation: string;
  date: string;
  category: string;
  keyHighlights: string[];
  content: ContentBlock[];
}

async function getArticleData(slug: string): Promise<ArticleData | null> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/blog-post/${slug}/`, {
      next: { revalidate: 60 }
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.warn("Django backend unreachable for news, falling back to local JSON");
  }

  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "data",
      "news",
      `${slug}.json`,
    );
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const fileContent = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading news JSON:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getArticleData(slug);
  if (!post) {
    return {
      title: "News | MoneyGreeks",
    };
  }
  return {
    title: `${post.title} | MoneyGreeks News`,
    description:
      post.content.find((b) => b.type === "paragraph")?.text ||
      "Read the latest financial news on MoneyGreeks.",
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getArticleData(slug);

  if (!post) {
    notFound();
  }

  function formatDate(dateStr: string) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  // Calculate dynamic reading time based on word count
  const wordCount = post.content
    .filter((b) => b.type === "paragraph")
    .reduce((acc, curr) => acc + (curr.text?.split(/\s+/).length || 0), 0);
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Grid Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Article Main Column */}
          <main className="lg:col-span-2 space-y-8">
            <article className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden p-6 md:p-10">
              {/* Back button link */}
              <Link
                href="/news-today"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6 font-medium group"
              >
                <ArrowLeft
                  size={16}
                  className="transition-transform duration-200 group-hover:-translate-x-1"
                />
                Back to News Today
              </Link>

              {/* Category Pill */}
              <div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-200/40">
                  {post.category}
                </span>
              </div>

              {/* Title - Styled with beautiful Serif font for editorial touch */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mt-4 mb-6 leading-tight tracking-tight font-serif">
                {post.title}
              </h1>

              {/* Author & Publish Date Meta row */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-b border-gray-100 pb-6 mb-8 font-sans">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                    {(post.author || "MG")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 leading-none">
                      {post.author}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {post.authorDesignation}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={16} className="text-gray-400" />
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={16} className="text-gray-400" />
                  <span>{readTime} min read</span>
                </div>
              </div>

              {/* Key Highlights Card */}
              {post.keyHighlights && post.keyHighlights.length > 0 && (
                <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/40 border border-blue-100/70 rounded-xl p-5 md:p-6 mb-8 shadow-sm">
                  <h3 className="text-base font-bold text-blue-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="text-blue-500">💡</span> Key Highlights
                  </h3>
                  <ul className="space-y-3 font-sans">
                    {post.keyHighlights.map((highlight, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-gray-700 text-sm leading-relaxed"
                      >
                        <span className="text-blue-600 font-bold mt-0.5">
                          ✓
                        </span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Dynamic Content Blocks */}
              <div className="space-y-6 font-sans">
                {post.content.map((block, idx) => {
                  switch (block.type) {
                    case "h1":
                      return (
                        <h2
                          key={idx}
                          className="text-xl font-bold text-gray-900 mt-8 mb-3 border-l-4 border-blue-600 pl-4 font-serif leading-tight"
                        >
                          {block.text}
                        </h2>
                      );
                    case "paragraph":
                      return (
                        <p
                          key={idx}
                          className="text-gray-700 leading-relaxed text-sm md:text-base mb-5 whitespace-pre-line"
                        >
                          {block.text}
                        </p>
                      );
                    case "image":
                      return (
                        <figure key={idx} className="my-8 space-y-2 group">
                          <div className="relative h-64 md:h-96 w-full rounded-xl overflow-hidden bg-gray-100 shadow-sm border border-gray-200/40">
                            <img
                              src={block.url || ""}
                              alt={block.caption || post.title}
                              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-[1.01]"
                            />
                          </div>
                          {block.caption && (
                            <figcaption className="text-center text-xs md:text-sm text-gray-500 font-medium italic mt-2.5">
                              {block.caption}
                            </figcaption>
                          )}
                        </figure>
                      );
                    default:
                      return null;
                  }
                })}
              </div>

              {/* Dynamic About Author Card */}
              <div className="mt-16 pt-8 border-t border-gray-100">
                <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 flex flex-col sm:flex-row gap-6 items-start">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-blue-500/10 shrink-0">
                    {post.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-gray-900 font-sans">
                      {post.author}
                    </h4>
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide leading-none">
                      {post.authorDesignation}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed font-sans">
                      Professional analyst offering comprehensive insights into
                      global market patterns, price actions, and macroeconomic
                      shifts for institutional and retail traders.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </main>

          {/* Sidebar Column */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Ad Block 300x250 */}
            <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Sponsored
                </h3>
                <span className="text-[10px] text-gray-300 border px-1 rounded uppercase">
                  Ad
                </span>
              </div>
              <div className="border border-gray-100 rounded-lg overflow-hidden flex justify-center bg-gray-50">
                <iframe
                  title="Sidebar Ad 300x250"
                  className="w-[300px] h-[250px]"
                  srcDoc={`
                    <html>
                      <body style="margin:0;display:flex;align-items:center;justify-content:center;background:#fafafa;font-family:sans-serif;color:#a0aec0;">
                        <div style="text-align:center;font-size:11px;letter-spacing:0.05em;">
                          <strong>300 × 250</strong><br/>Google Ad Placement
                        </div>
                      </body>
                    </html>
                  `}
                />
              </div>
            </div>

            {/* Newsletter Subscription Card */}
            <NewsletterSidebarWidget />
            {/* Ad Block 300x600 */}
            <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Sponsored
                </h3>
                <span className="text-[10px] text-gray-300 border px-1 rounded uppercase">
                  Ad
                </span>
              </div>
              <div className="border border-gray-100 rounded-lg overflow-hidden flex justify-center bg-gray-50">
                <iframe
                  title="Sidebar Ad 300x600"
                  className="w-[300px] h-[600px]"
                  srcDoc={`
                    <html>
                      <body style="margin:0;display:flex;align-items:center;justify-content:center;background:#fafafa;font-family:sans-serif;color:#a0aec0;">
                        <div style="text-align:center;font-size:11px;letter-spacing:0.05em;">
                          <strong>300 × 600</strong><br/>Google Ad Placement
                        </div>
                      </body>
                    </html>
                  `}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Recommended Posts Carousel/Grid */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <RecommendedPosts />
      </div>
    </div>
  );
}
