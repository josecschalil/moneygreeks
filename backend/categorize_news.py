import random
from posts.models import BlogPost

news_posts = BlogPost.objects.filter(category="news", news_placement__isnull=True)

if news_posts.exists():
    placements = ["hero", "latest", "deep_dive", "breaking", "live_feed", "quick_hit"]
    
    # Ensure at least one hero
    first_post = news_posts.first()
    first_post.news_placement = "hero"
    first_post.save()
    print(f"Assigned '{first_post.title}' to hero.")
    
    rest_posts = news_posts.exclude(id=first_post.id)
    count = 0
    for post in rest_posts:
        post.news_placement = random.choice(placements)
        post.save()
        count += 1
    print(f"Randomly assigned {count} remaining posts to various news placements.")
else:
    print("No uncategorized news posts found to migrate.")
