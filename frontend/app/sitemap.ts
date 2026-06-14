import { MetadataRoute } from 'next'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://moneygreeks.com";

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
    const blogRes = await fetch(`${API_BASE}/blog-post/`, { next: { revalidate: 3600 } });
    if (blogRes.ok) {
      const posts = await blogRes.json();
      // Adjust if API is paginated, e.g. posts.results
      const items = Array.isArray(posts) ? posts : (posts.results || []);
      items.forEach((post: any) => {
        // Assume blog post goes to either news or education depending on category, 
        // or has its own route. The app uses /news-today/[slug], /education/[slug], /blog-post/[slug]
        let path = `/blog-post/${post.slug}`;
        if (post.category?.toLowerCase() === 'news') path = `/news-today/${post.slug}`;
        else if (post.category?.toLowerCase() === 'education') path = `/education/${post.slug}`;

        routes.push({
          url: `${SITE_URL}${path}`,
          lastModified: new Date(post.created_at || post.date || new Date()),
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
    const reportRes = await fetch(`${API_BASE}/reports/`, { next: { revalidate: 3600 } });
    if (reportRes.ok) {
      const reports = await reportRes.json();
      const items = Array.isArray(reports) ? reports : (reports.results || []);
      items.forEach((report: any) => {
        routes.push({
          url: `${SITE_URL}/market-data/${report.slug}`,
          lastModified: new Date(report.created_at || report.report_date || new Date()),
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
    const postMarketRes = await fetch(`${API_BASE}/post-market-list/`, { next: { revalidate: 3600 } });
    if (postMarketRes.ok) {
      const reports = await postMarketRes.json();
      const items = Array.isArray(reports) ? reports : (reports.results || []);
      items.forEach((report: any) => {
        routes.push({
          url: `${SITE_URL}/post-market/${report.slug}`,
          lastModified: new Date(report.created_at || report.report_date || new Date()),
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
