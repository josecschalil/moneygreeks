from django.db import models

class MarketReport(models.Model):
    STATUS_DRAFT = "draft"
    STATUS_PUBLISHED = "published"
    STATUS_FAILED = "failed"
    STATUS_CHOICES = [
        (STATUS_DRAFT, "Draft"),
        (STATUS_PUBLISHED, "Published"),
        (STATUS_FAILED, "Failed"),
    ]
    REPORT_TYPE_FULL = "full"
    REPORT_TYPE_STANDARD = "standard"
    REPORT_TYPE_LIMITED = "limited"
    REPORT_TYPE_FAILED = "failed"
    REPORT_TYPE_CHOICES = [
        (REPORT_TYPE_FULL, "Full"),
        (REPORT_TYPE_STANDARD, "Standard"),
        (REPORT_TYPE_LIMITED, "Limited"),
        (REPORT_TYPE_FAILED, "Failed"),
    ]

    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    report_date = models.DateField(unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_DRAFT)
    image_url = models.URLField(max_length=1000, blank=True, null=True)
    overall_conclusion = models.TextField()
    quality_score = models.PositiveSmallIntegerField(default=0)
    report_type = models.CharField(max_length=20, choices=REPORT_TYPE_CHOICES, default=REPORT_TYPE_LIMITED)
    quality_notes = models.JSONField(blank=True, null=True)
    raw_data = models.JSONField(blank=True, null=True)
    
    # SEO Fields
    meta_title = models.CharField(max_length=150, blank=True)
    meta_description = models.TextField(blank=True)
    meta_keywords = models.CharField(max_length=255, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.report_date}"


class GlobalMarketIndex(models.Model):
    report = models.ForeignKey(MarketReport, on_delete=models.CASCADE, related_name="global_indices")
    index_name = models.CharField(max_length=100)
    prev_close = models.DecimalField(max_digits=10, decimal_places=2)
    open_price = models.DecimalField(max_digits=10, decimal_places=2)
    change = models.DecimalField(max_digits=10, decimal_places=4)
    change_percent = models.DecimalField(max_digits=6, decimal_places=4)
    trend = models.CharField(max_length=10, choices=[("up", "Up"), ("down", "Down")])


class GlobalMarketAnalysis(models.Model):
    report = models.OneToOneField(MarketReport, on_delete=models.CASCADE, related_name="global_analysis")
    analysis = models.TextField()


class IndianMarketIndex(models.Model):
    report = models.ForeignKey(MarketReport, on_delete=models.CASCADE, related_name="indian_indices")
    index_name = models.CharField(max_length=100)
    prev_close = models.DecimalField(max_digits=10, decimal_places=2)
    open_price = models.DecimalField(max_digits=10, decimal_places=2)
    change = models.DecimalField(max_digits=10, decimal_places=2)
    change_percent = models.DecimalField(max_digits=6, decimal_places=2)
    trend = models.CharField(max_length=10, choices=[("up", "Up"), ("down", "Down")])


class IndianMarketAnalysis(models.Model):
    report = models.OneToOneField(MarketReport, on_delete=models.CASCADE, related_name="indian_analysis")
    analysis = models.TextField()


class InstitutionalFlow(models.Model):
    report = models.ForeignKey(MarketReport, on_delete=models.CASCADE, related_name="institutional_flows")
    institution_type = models.CharField(max_length=10, choices=[("FII", "FII"), ("DII", "DII")])
    date = models.DateField()
    buy_value = models.DecimalField(max_digits=12, decimal_places=2)
    sell_value = models.DecimalField(max_digits=12, decimal_places=2)
    net_value = models.DecimalField(max_digits=12, decimal_places=2)
    trend = models.CharField(max_length=10, choices=[("up", "Up"), ("down", "Down")])


class InstitutionalFlowAnalysis(models.Model):
    report = models.OneToOneField(MarketReport, on_delete=models.CASCADE, related_name="institutional_analysis")
    analysis = models.TextField()


class StockMover(models.Model):
    report = models.ForeignKey(MarketReport, on_delete=models.CASCADE, related_name="stock_movers")
    category = models.CharField(max_length=10, choices=[("gainer", "Gainer"), ("loser", "Loser")])
    symbol = models.CharField(max_length=20)
    prev_close = models.DecimalField(max_digits=10, decimal_places=2)
    open_price = models.DecimalField(max_digits=10, decimal_places=2)
    change_percent = models.DecimalField(max_digits=6, decimal_places=2)
    volume = models.CharField(max_length=50)


class StockMoverAnalysis(models.Model):
    report = models.OneToOneField(MarketReport, on_delete=models.CASCADE, related_name="stock_mover_analysis")
    analysis = models.TextField()


class MarketBreadth(models.Model):
    report = models.OneToOneField(MarketReport, on_delete=models.CASCADE, related_name="market_breadth")
    advancing = models.PositiveIntegerField()
    declining = models.PositiveIntegerField()
    unchanged = models.PositiveIntegerField(null=True, blank=True)
    advance_decline_ratio = models.DecimalField(max_digits=5, decimal_places=2)


class SectorPerformance(models.Model):
    report = models.ForeignKey(MarketReport, on_delete=models.CASCADE, related_name="sector_performance")
    category = models.CharField(max_length=10, choices=[("gainer", "Gainer"), ("loser", "Loser")])
    sector_name = models.CharField(max_length=100)
    prev_close = models.DecimalField(max_digits=10, decimal_places=2)
    change = models.DecimalField(max_digits=10, decimal_places=2)
    change_percent = models.DecimalField(max_digits=6, decimal_places=2)
    pe = models.DecimalField(max_digits=6, decimal_places=2)
    pb = models.DecimalField(max_digits=6, decimal_places=2)
    div_yield = models.DecimalField(max_digits=10, decimal_places=2)


class SectorAnalysis(models.Model):
    report = models.OneToOneField(MarketReport, on_delete=models.CASCADE, related_name="sector_analysis")
    analysis = models.TextField()


class OptionChainSummary(models.Model):
    report = models.ForeignKey(MarketReport, on_delete=models.CASCADE, related_name="option_chain_summaries")
    symbol = models.CharField(max_length=20)
    expiry = models.CharField(max_length=20, blank=True)
    pcr = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    max_call_oi_strike = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    max_call_oi = models.PositiveIntegerField(default=0)
    max_put_oi_strike = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    max_put_oi = models.PositiveIntegerField(default=0)
    underlying_value = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    analysis = models.TextField(blank=True)


class EducationCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class BlogPost(models.Model):
    CATEGORY_CHOICES = [
        ("technology", "Technology"),
        ("finance", "Finance"),
        ("education", "Education"),
        ("news", "News"),
    ]
    NEWS_PLACEMENT_CHOICES = [
        ("hero", "Featured Hero"),
        ("latest", "Latest Intelligence"),
        ("deep_dive", "Deep Dive Analysis"),
        ("breaking", "Breaking News"),
        ("live_feed", "Live Feed"),
        ("quick_hit", "Quick Hit"),
    ]

    title = models.CharField(max_length=255)
    subtitle = models.TextField(blank=True)
    slug = models.SlugField(unique=True, max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    news_placement = models.CharField(max_length=50, choices=NEWS_PLACEMENT_CHOICES, null=True, blank=True)
    education_category = models.ForeignKey(
        EducationCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name="posts"
    )
    featured_image = models.URLField(blank=True, null=True)
    author = models.CharField(max_length=255, default="MoneyGreeks Team")
    author_designation = models.CharField(max_length=255, default="Market Analyst")
    key_highlights = models.JSONField(default=list, blank=True)
    content = models.JSONField(default=list, help_text="Array of content blocks (h1, paragraph, image)")
    view_count = models.PositiveIntegerField(default=0)
    
    # SEO Fields
    meta_title = models.CharField(max_length=150, blank=True)
    meta_description = models.TextField(blank=True)
    meta_keywords = models.CharField(max_length=255, blank=True)

    created_at = models.DateField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class NewsletterSubscriber(models.Model):
    email = models.EmailField(unique=True, max_length=254)
    subscribed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email

    class Meta:
        ordering = ["-subscribed_at"]
        verbose_name = "Newsletter Subscriber"
        verbose_name_plural = "Newsletter Subscribers"


class DailySentiment(models.Model):
    date = models.DateField(unique=True)
    bullish_votes = models.PositiveIntegerField(default=0)
    bearish_votes = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Sentiment for {self.date}"

    class Meta:
        ordering = ["-date"]


class Enquiry(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.subject} - {self.email}"

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Enquiry"
        verbose_name_plural = "Enquiries"


class PostMarketReport(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    report_date = models.DateField(unique=True)
    analyst = models.CharField(max_length=100, default="Jose C S")
    analyst_designation = models.CharField(max_length=200, default="Founder & Head Analyst, MoneyGreeks")
    overall_conclusion = models.TextField(blank=True)
    report_data = models.JSONField()
    is_published = models.BooleanField(default=True)
    
    # SEO Fields
    meta_title = models.CharField(max_length=150, blank=True)
    meta_description = models.TextField(blank=True)
    meta_keywords = models.CharField(max_length=255, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Post-Market: {self.title} ({self.report_date})"

    class Meta:
        ordering = ["-report_date"]
        verbose_name = "Post-Market Report"
        verbose_name_plural = "Post-Market Reports"

class LiveMarketIndex(models.Model):
    name = models.CharField(max_length=100, unique=True)
    last_price = models.DecimalField(max_digits=12, decimal_places=2)
    change = models.DecimalField(max_digits=12, decimal_places=2)
    percent_change = models.DecimalField(max_digits=6, decimal_places=2)
    up = models.BooleanField(default=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

