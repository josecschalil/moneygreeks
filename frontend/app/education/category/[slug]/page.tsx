import Link from "next/link";
import { fetchPostsByCategory } from "../../../utils/api";
import { getSiteUrl } from "../../../utils/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let categoryName =
    slug.charAt(0).toUpperCase() + slug.slice(1).replace("-", " ");

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/education-categories/${slug}`,
    );
    if (res.ok) {
      const data = await res.json();
      if (data.name) categoryName = data.name;
    }
  } catch (err) {
    // Ignore fetch errors during metadata generation
  }

  return {
    title: `${categoryName} | MoneyGreeks Education`,
    description: `Explore trading education resources for ${categoryName}.`,
    alternates: {
      canonical: `/education/category/${slug}`,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch dynamic categories
  let category: any = null;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/education-categories/${slug}`,
      { next: { revalidate: 60 } },
    );
    if (res.ok) {
      category = await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch category details", err);
  }

  const eduPosts = (await fetchPostsByCategory("education")) || [];

  // Filter posts matching this category's ID
  const categoryPosts = category
    ? eduPosts.filter((p: any) => p.education_category === category.id)
    : [];

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Category Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The category you are looking for does not exist.
          </p>
          <Link
            href="/education"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Education Hub
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 border-b border-gray-200 pb-8">
          <Link
            href="/education"
            className="text-sm text-blue-600 hover:text-blue-800 mb-4 inline-block font-medium"
          >
            &larr; Back to Intelligence Hub
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 font-serif tracking-tight mt-2">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-xl text-gray-500 mt-4 max-w-3xl leading-relaxed">
              {category.description}
            </p>
          )}
        </div>

        {categoryPosts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No Articles Yet
            </h3>
            <p className="text-gray-500">
              Check back later for new {category.name.toLowerCase()} content.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryPosts.map((item: any) => (
              <Link
                href={`/education/${item.slug}`}
                className="group flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                key={item.slug}
              >
                <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                  <img
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={
                      item.featured_image ||
                      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3"
                    }
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
                    {category.name}
                  </span>
                  <h4 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                  {item.subtitle && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
                      {item.subtitle}
                    </p>
                  )}
                  <div className="mt-auto flex items-center text-xs text-gray-500 uppercase font-medium">
                    <span
                      className="material-symbols-outlined mr-1"
                      style={{ fontSize: 16 }}
                    >
                      schedule
                    </span>
                    {item.time || "5 MIN READ"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
