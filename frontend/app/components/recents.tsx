export default function BlogPostsGrid() {
  const blogPosts = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80",
      title: "Migrating to Linear 101",
      description:
        "Linear helps streamline software projects, sprints, tasks, and bug tracking. Here's how to get started.",
      author: {
        name: "Jonathan Wills",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
      },
      date: "19 Jan 2022",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80",
      title: "Building your API Stack",
      description:
        "The rise of RESTful APIs has been met by a rise in tools for creating, testing, and managing them.",
      author: {
        name: "Lana Steiner",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
      },
      date: "18 Jan 2022",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=600&q=80",
      title: "Bill Walsh leadership lessons",
      description:
        "Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?",
      author: {
        name: "Eve Wilkins",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
      },
      date: "18 Jan 2022",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
      title: "PM mental models",
      description:
        "Mental models are simple expressions of complex processes or relationships.",
      author: {
        name: "Eve Wilkins",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
      },
      date: "18 Jan 2022",
    },
    {
      id: 5,
      image:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80",
      title: "What is Wireframing?",
      description:
        "Introduction to Wireframing and its Principles. Learn from the best in the industry.",
      author: {
        name: "Lana Steiner",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
      },
      date: "18 Jan 2022",
    },
    {
      id: 6,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
      title: "How collaboration makes us better designers",
      description:
        "Collaboration can make our teams stronger, and our individual designs better.",
      author: {
        name: "Jonathan Wills",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
      },
      date: "19 Jan 2022",
    },
    {
      id: 7,
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80",
      title: "How collaboration makes us better designers",
      description:
        "Collaboration can make our teams stronger, and our individual designs better.",
      author: {
        name: "Eve Wilkins",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
      },
      date: "18 Jan 2022",
    },
    {
      id: 8,
      image:
        "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=600&q=80",
      title: "Our top 10 Javascript frameworks to use",
      description:
        "JavaScript frameworks make development easy with an abstraction layer and functional features.",
      author: {
        name: "Lana Steiner",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
      },
      date: "18 Jan 2022",
    },
    {
      id: 9,
      image:
        "https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=600&q=80",
      title: "Podcast: Creating a better CX Community",
      description:
        "Starting a community doesn't need to be complicated, but how do you get started?",
      author: {
        name: "Jonathan Wills",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
      },
      date: "19 Jan 2022",
    },
  ];

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
            <article
              key={post.id}
              className="group cursor-pointer rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="pt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  {post.description}
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {post.author.name}
                    </p>
                    <p className="text-sm text-gray-500">{post.date}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center">
          <button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
            Loading more...
          </button>
        </div>
      </div>
    </section>
  );
}
