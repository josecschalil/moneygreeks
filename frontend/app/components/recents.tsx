import Image from "next/image";
import Link from "next/link";

/* =========================
   Types
========================= */
type Author = {
  name: string;
  avatar: string;
};

type BlogPost = {
  slug: string;
  title: string;
  content: string;
  featured_image: string;
  created_at: string;
  author: Author;
};
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* =========================
   Data Fetcher
========================= */
async function fetchBlogPostData(): Promise<BlogPost[]> {
  const res = await fetch("http://127.0.0.1:8000/blog-post/", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch blog post data");
  }

  return res.json();
}

/* =========================
   Component
========================= */
export default async function BlogPostsGrid() {
  const blogPostData = await fetchBlogPostData();
  if (!blogPostData || blogPostData.length === 0) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500">No blog posts available.</p>
        </div>
      </section>
    );
  }

  const blogPosts = blogPostData.slice(0, 3);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <h2 className="text-3xl font-bold text-gray-900 mb-12">
          Recent blog posts
        </h2>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <article className="group cursor-pointer rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="pt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    {post.content.length > 120
                      ? post.content.slice(0, 120) + "..."
                      : post.content}
                  </p>

                  {/* Author Info */}
                  <div className="flex items-center gap-3 mb-5">
                    <Image
                      src={
                        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=600&fit=crop"
                      }
                      alt={"JOSE C S"}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {"JOSE C S"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(post.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center">
          <Link href="/blog">
            <button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
              Loading more...
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
