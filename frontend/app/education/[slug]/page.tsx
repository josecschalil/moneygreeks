import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageTracker from "@/app/components/PageTracker";
import {
  User,
  Calendar,
  Clock,
  ArrowLeft,
  BookOpen,
  Award,
  ArrowRight,
  PlayCircle,
  Download,
  FileText,
  CheckCircle2,
} from "lucide-react";
import SocialShare from "../../components/SocialShare";
import RecommendedPosts from "@/app/components/recommended";
import {
  absoluteUrl,
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  defaultOpenGraphImage,
  extractFirstImage,
  firstParagraph,
  getContentWordCount,
  getSiteUrl,
  splitKeywords,
} from "@/app/utils/seo";

interface ContentBlock {
  type: "h1" | "paragraph" | "image" | "newsletter-cta";
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
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  featured_image?: string;
  created_at?: string;
  updated_at?: string;
}

async function getArticleData(slug: string): Promise<ArticleData | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/blog-post/${slug}`,
      {
        next: { revalidate: 60 },
      },
    );
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.warn(
      "Django backend unreachable for education, falling back to local JSON",
    );
  }

  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "data",
      "education",
      `${slug}.json`,
    );
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const fileContent = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading education JSON:", error);
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
      title: "Education | MoneyGreeks",
    };
  }
  const metaTitle = post.meta_title || `${post.title} | MoneyGreeks Academy`;
  const metaDescription =
    post.meta_description ||
    firstParagraph(post.content) ||
    "Master financial analysis and trading concepts with MoneyGreeks Academy.";
  const metaKeywords = splitKeywords(post.meta_keywords);
  const canonicalUrl = `${getSiteUrl()}/education/${slug}`;
  const imageUrl = absoluteUrl(
    post.featured_image ||
      extractFirstImage(post.content) ||
      defaultOpenGraphImage(),
  );
  const datePublished = post.date || post.created_at;
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
          alt: metaTitle,
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

export default async function EducationArticlePage({
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

  // Calculate dynamic reading time
  const wordCount = getContentWordCount(post.content);
  const readTime = Math.max(1, Math.ceil(wordCount / 180)); // slightly slower for educational material
  const canonicalUrl = `${getSiteUrl()}/education/${slug}`;
  const metaDescription =
    post.meta_description || firstParagraph(post.content) || "";
  const metaKeywords = splitKeywords(post.meta_keywords);
  const imageUrl = absoluteUrl(
    post.featured_image ||
      extractFirstImage(post.content) ||
      defaultOpenGraphImage(),
  );

  // Custom Author Profiles
  const getAuthorBio = (authorName: string) => {
    if (authorName.toLowerCase().includes("jose")) {
      return "Jose is a technical analyst, market researcher, educator, and trader with 5+ years of experience, specializing in price action, patterns, and market structure.";
    } else if (authorName.toLowerCase().includes("arnaud")) {
      return "David is the Head of Institutional Execution at MoneyGreeks, specializing in order book microstructures, dark pool liquidity metrics, and systematic trading models.";
    } else if (authorName.toLowerCase().includes("sterling")) {
      return "Victoria is a Senior REIT Analyst and Head of Equity Analysis at MoneyGreeks, focusing on cash flow sustainability, corporate governance, and corporate valuations.";
    } else if (authorName.toLowerCase().includes("rostova")) {
      return "Elena is a veteran Macroeconomic Strategist, specializing in currency trends, inflation indexes, interest rate cycles, and sovereign debt portfolios.";
    } else if (authorName.toLowerCase().includes("vance")) {
      return "Dr. Vance is the Director of Quantitative Risk at MoneyGreeks, focusing on portfolio stress testing, algorithm correlation parameters, and multi-asset hedging strategies.";
    }
    return "Expert market educator and analyst dedicated to creating comprehensive guides for the modern trader.";
  };

  const jsonLd = buildArticleJsonLd({
    type: "Article",
    title: post.title,
    description: metaDescription,
    url: canonicalUrl,
    image: imageUrl,
    datePublished: post.date || post.created_at,
    dateModified: post.updated_at || post.date || post.created_at,
    author: post.author || "MoneyGreeks",
    section: post.category,
    keywords: metaKeywords,
    wordCount,
  });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: getSiteUrl() },
    { name: "Education", url: `${getSiteUrl()}/education` },
    { name: post.title, url: canonicalUrl },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <PageTracker
        pageType="education"
        pageSlug={slug}
        pageTitle={post.title}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Main Container */}
      <div className="max-w-7xl mx-auto md:px-4 sm:px-6 lg:px-8 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <main className="lg:col-span-2 space-y-8">
            <article className="bg-white md:rounded-2xl md:border md:border-gray-200/60 md:shadow-sm overflow-hidden px-6 py-6 md:p-10">
              {/* Header Navigation & Category Row */}
              <div className="flex items-start md:items-center justify-between mb-6 flex-col md:flex-row gap-4 md:gap-0">
                {/* Back to Hub Link */}
                <Link
                  href="/education"
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium group"
                >
                  <ArrowLeft
                    size={16}
                    className="transition-transform duration-200 group-hover:-translate-x-1"
                  />
                  Back to Intelligence Hub
                </Link>

                {/* Eyebrow & Category */}
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/40">
                    <BookOpen size={12} />
                    {post.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200/40">
                    <Award size={12} />
                    Academy Guide
                  </span>
                </div>
              </div>

              {/* Title - Clean modern sans-serif */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-700 mt-2 mb-4 leading-snug md:leading-tight tracking-tight font-popins ">
                {post.title}
              </h1>

              {/* Meta information row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-gray-500 border-b border-gray-100 pb-4 mb-6 font-sans">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                    {(post.author || "MG")
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 leading-none">
                      {post.author}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                      {post.authorDesignation}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-gray-400" />
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </div>
                  <div className="flex items-center gap-1.5 hidden sm:flex">
                    <Clock size={14} className="text-gray-400" />
                    <span>{readTime} min read</span>
                  </div>
                </div>
              </div>

              {/* Study Highlights Card */}
              {post.keyHighlights && post.keyHighlights.length > 0 && (
                <div className="bg-gradient-to-br from-emerald-50/80 to-teal-50/40 border border-emerald-100/70 rounded-xl p-4 md:p-5 mb-6 shadow-sm">
                  <h3 className="text-sm md:text-base font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span>📖</span> Core Learning Takeaways
                  </h3>
                  <ul className="space-y-2.5 font-sans">
                    {post.keyHighlights.map((highlight, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-gray-700 text-sm leading-relaxed"
                      >
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Dynamic Content Rendering */}
              <div className="space-y-6 font-sans">
                {post.content.map((block, idx) => {
                  switch (block.type) {
                    case "h1":
                      return (
                        <h2
                          key={idx}
                          className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3 border-l-4 border-emerald-600 pl-3 md:pl-4 -ml-3 md:-ml-4 font-sans leading-tight"
                        >
                          {block.text}
                        </h2>
                      );
                    case "paragraph":
                      return (
                        <p
                          key={idx}
                          className="text-gray-700 leading-relaxed text-[17px] sm:text-base mb-5 whitespace-pre-line"
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

              <SocialShare
                url={`${process.env.NEXT_PUBLIC_SITE_URL}/education/${slug}`}
                title={post.title}
              />

              {/* Dynamic About Author Card */}
              <div className="mt-16 pt-8 border-t border-gray-100">
                <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 flex flex-col sm:flex-row gap-6 items-start">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-emerald-500/10 shrink-0">
                    {post.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-gray-900 font-sans">
                      {post.author}
                    </h4>
                    <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide leading-none">
                      {post.authorDesignation}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed font-sans">
                      {getAuthorBio(post.author)}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </main>

          {/* Sidebar Area */}
          <aside className="lg:col-span-1 space-y-6 px-4 sm:px-0">
            {/* Ad block 300x250 */}
            <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700">
                  Sponsored
                </h3>
                <span className="text-xs text-gray-400">Ad</span>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden flex justify-center bg-gray-50">
                <iframe
                  title="Sidebar Ad 300x250"
                  className="w-[300px] h-[250px]"
                  srcDoc={`
                    <html>
                      <body style="margin:0;display:flex;align-items:center;justify-content:center;background:#fafafa;font-family:sans-serif;color:#a0aec0;">
                        <div style="text-align:center;font-size:11px;letter-spacing:0.05em;">
                          <strong>300 × 250</strong><br/>Google Ad Placeholder
                        </div>
                      </body>
                    </html>
                  `}
                />
              </div>
            </div>

            {/* Strategic Trading Academy Box */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-200 space-y-4">
              <div>
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest bg-amber-50 border border-amber-200 px-2.5 py-1 rounded">
                  MoneyGreeks Academy
                </span>

                <h3 className="text-base font-bold mt-3 font-serif text-gray-900">
                  Option & Risk Mastery
                </h3>

                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Join our comprehensive curriculum designed to help retail
                  traders execute like institutions.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-gray-700 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-amber-600">✓</span>
                  40+ Advanced Video Lectures
                </li>

                <li className="flex items-center gap-2">
                  <span className="text-amber-600">✓</span>
                  Weekly Live Trading Rooms
                </li>

                <li className="flex items-center gap-2">
                  <span className="text-amber-600">✓</span>
                  Proprietary Options Calculators
                </li>
              </ul>

              <button className="w-full py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm transition-colors shadow-md">
                Enroll in Academy
              </button>
            </div>
            {/* Ad block 300x600 */}
            <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700">
                  Sponsored
                </h3>
                <span className="text-xs text-gray-400">Ad</span>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden flex justify-center bg-gray-50">
                <iframe
                  title="Sidebar Ad 300x600"
                  className="w-[300px] h-[600px]"
                  srcDoc={`
                    <html>
                      <body style="margin:0;display:flex;align-items:center;justify-content:center;background:#fafafa;font-family:sans-serif;color:#a0aec0;">
                        <div style="text-align:center;font-size:11px;letter-spacing:0.05em;">
                          <strong>300 × 600</strong><br/>Google Ad Placeholder
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

      {/* Recommended Posts */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <RecommendedPosts />
      </div>
    </div>
  );
}
