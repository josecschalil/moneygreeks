import random
from posts.models import BlogPost, EducationCategory

# Define the four categories to create
categories_to_create = [
    {"name": "Introductory", "slug": "introductory", "description": "Beginner guides and core market concepts."},
    {"name": "Technical Analysis", "slug": "technical-analysis", "description": "In-depth chart patterns and quantitative analysis."},
    {"name": "Fundamental Analysis", "slug": "fundamental-analysis", "description": "Evaluating intrinsic value and corporate health."},
    {"name": "Macro Trends", "slug": "macro-trends", "description": "Global economic policies and structural market signals."}
]

# Create the categories
category_objects = []
for cat_data in categories_to_create:
    cat, created = EducationCategory.objects.get_or_create(
        slug=cat_data["slug"],
        defaults={"name": cat_data["name"], "description": cat_data["description"]}
    )
    category_objects.append(cat)
    if created:
        print(f"Created category: {cat.name}")

# Get all education posts that are not yet categorized
education_posts = BlogPost.objects.filter(category="education", education_category__isnull=True)

# If there's an introductory post we want to specifically feature, let's just make the first one introductory
if education_posts.exists():
    intro_cat = category_objects[0] # Introductory
    other_cats = category_objects[1:] # Technical, Fundamental, Macro
    
    # Take the first post and make it Introductory
    first_post = education_posts.first()
    first_post.education_category = intro_cat
    first_post.save()
    print(f"Assigned '{first_post.title}' to Introductory category.")
    
    # Assign the rest randomly to the other 3 categories
    rest_posts = education_posts.exclude(id=first_post.id)
    count = 0
    for post in rest_posts:
        chosen_cat = random.choice(other_cats)
        post.education_category = chosen_cat
        post.save()
        count += 1
    print(f"Randomly assigned {count} remaining posts to Technical, Fundamental, and Macro categories.")
else:
    print("No uncategorized education posts found to migrate.")
