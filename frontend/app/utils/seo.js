export const SITE_NAME = "MoneyGreeks";
export const DEFAULT_OG_IMAGE_PATH = "/images/hero.png";

export function getSiteUrl() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  return siteUrl.replace(/\/+$/, "");
}

export function absoluteUrl(value, fallbackPath = DEFAULT_OG_IMAGE_PATH) {
  const source = value || fallbackPath;

  if (/^https?:\/\//i.test(source)) {
    return source;
  }

  return `${getSiteUrl()}${source.startsWith("/") ? "" : "/"}${source}`;
}

export function defaultOpenGraphImage() {
  return absoluteUrl(DEFAULT_OG_IMAGE_PATH);
}

export function splitKeywords(keywords) {
  if (!keywords) return [];
  if (Array.isArray(keywords)) return keywords.filter(Boolean);

  return String(keywords)
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

export function firstParagraph(content) {
  if (!Array.isArray(content)) return "";

  return content.find((block) => block?.type === "paragraph" && block.text)?.text || "";
}

export function extractFirstImage(content) {
  if (!Array.isArray(content)) return "";

  return content.find((block) => block?.type === "image" && block.url)?.url || "";
}

export function getContentWordCount(content) {
  if (!Array.isArray(content)) return 0;

  return content
    .filter((block) => block?.type === "paragraph" && block.text)
    .reduce((total, block) => total + String(block.text).trim().split(/\s+/).filter(Boolean).length, 0);
}

export function publisherJsonLd() {
  return {
    "@type": "Organization",
    name: SITE_NAME,
    url: getSiteUrl(),
    logo: {
      "@type": "ImageObject",
      url: defaultOpenGraphImage(),
    },
  };
}

export function buildArticleJsonLd({
  type = "Article",
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author,
  section,
  keywords,
  wordCount,
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": type,
    headline: title,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    image: image ? [image] : [defaultOpenGraphImage()],
    datePublished,
    dateModified: dateModified || datePublished,
    author: [
      {
        "@type": "Person",
        name: author || SITE_NAME,
      },
    ],
    publisher: publisherJsonLd(),
    description,
  };

  if (section) schema.articleSection = section;
  if (keywords?.length) schema.keywords = keywords.join(", ");
  if (wordCount) schema.wordCount = wordCount;

  return schema;
}

export function buildBreadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
