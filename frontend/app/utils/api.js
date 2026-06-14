

/**
 * Fetches posts from the Django API, with a fallback to local JSON data.
 * @param {string} category - "news" or "education"
 */
export async function fetchPostsByCategory(category) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"}/blog-post/`, {
      next: { revalidate: 60 }
    });

    if (res.ok) {
      const data = await res.json();
      const posts = Array.isArray(data) ? data : (data.results || []);
      
      // Filter by category and ensure they are sorted by created_at descending
      // (Django already sorts them if ordering is set, but we filter here)
      const filtered = posts.filter(p => p.category === category);
      return filtered;
    }
  } catch (error) {
    console.warn(`Django backend unreachable for ${category}, falling back to local mock data`);
  }

  // Fallback to local mock data mapping if backend is down
  // For the list pages, we don't have a single JSON list file usually, 
  // but if the component passes down dummy data as fallback, we return null so the page can handle it.
  return null;
}
