import { MetadataRoute } from 'next'
import { getSiteUrl } from './utils/seo'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const SITE_URL = getSiteUrl();

type SitemapEntry = {
  slug?: string;
  category?: string;
  created_at?: string;
  updated_at?: string;
  date?: string;
  report_date?: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/news-today`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/education`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog-archive`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/pre-market-archive`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/financial-data`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Try fetching dynamic blog posts
  try {
    if (!API_BASE) throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
    const blogRes = await fetch(`${API_BASE}/blog-post/`, { next: { revalidate: 3600 } });
    if (blogRes.ok) {
      const posts = await blogRes.json();
      // Adjust if API is paginated, e.g. posts.results
      const items = Array.isArray(posts) ? posts : (posts.results || []);
      items.forEach((post: SitemapEntry) => {
        // Assume blog post goes to either news or education depending on category, 
        // or has its own route. The app uses /news-today/[slug], /education/[slug], /blog-post/[slug]
        let path = `/blog-post/${post.slug}`;
        if (post.category?.toLowerCase() === 'news') path = `/news-today/${post.slug}`;
        else if (post.category?.toLowerCase() === 'education') path = `/education/${post.slug}`;

        routes.push({
          url: `${SITE_URL}${path}`,
          lastModified: new Date(post.updated_at || post.created_at || post.date || new Date()),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      });
    }
  } catch (error) {
    console.warn("Could not fetch blog posts for sitemap");
  }

  // Try fetching Pre-Market Reports
  try {
    if (!API_BASE) throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
    const reportRes = await fetch(`${API_BASE}/reports/`, { next: { revalidate: 3600 } });
    if (reportRes.ok) {
      const reports = await reportRes.json();
      const items = Array.isArray(reports) ? reports : (reports.results || []);
      items.forEach((report: SitemapEntry) => {
        routes.push({
          url: `${SITE_URL}/market-data/${report.slug}`,
          lastModified: new Date(report.updated_at || report.created_at || report.report_date || new Date()),
          changeFrequency: 'daily',
          priority: 0.8,
        });
      });
    }
  } catch (error) {
    console.warn("Could not fetch market reports for sitemap");
  }

  // Try fetching Post-Market Reports
  try {
    if (!API_BASE) throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
    const postMarketRes = await fetch(`${API_BASE}/post-market-list/`, { next: { revalidate: 3600 } });
    if (postMarketRes.ok) {
      const reports = await postMarketRes.json();
      const items = Array.isArray(reports) ? reports : (reports.results || []);
      items.forEach((report: SitemapEntry) => {
        routes.push({
          url: `${SITE_URL}/post-market/${report.slug}`,
          lastModified: new Date(report.updated_at || report.created_at || report.report_date || new Date()),
          changeFrequency: 'daily',
          priority: 0.8,
        });
      });
    }
  } catch (error) {
    console.warn("Could not fetch post-market reports for sitemap");
  }

  return routes;
}
