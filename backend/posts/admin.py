from django.contrib import admin
from .models import BlogPost, MarketReport
from .models import (
    GlobalMarketAnalysis,
    IndianMarketAnalysis,
    InstitutionalFlowAnalysis,
    StockMoverAnalysis,
    SectorAnalysis,
    GlobalMarketIndex,
    IndianMarketIndex,
    InstitutionalFlow,
    StockMover,
    SectorPerformance,
    MarketBreadth,
    NewsletterSubscriber,
    OptionChainSummary,
)

@admin.register(MarketReport)
class MarketReportAdmin(admin.ModelAdmin):
    list_display = ("title", "report_date", "status", "report_type", "quality_score", "created_at")
    list_filter = ("status", "report_type", "report_date")
    search_fields = ("title", "slug")
    prepopulated_fields = {"slug": ("title",)}
    ordering = ("-report_date",)
    actions = ("mark_as_published", "mark_as_draft")

    readonly_fields = ("created_at", "updated_at")

    fieldsets = (
        ("Basic Info", {
            "fields": ("title", "slug", "report_date", "status", "image_url")
        }),
        ("Quality", {
            "fields": ("quality_score", "report_type", "quality_notes")
        }),
        ("SEO Settings", {
            "fields": ("meta_title", "meta_description", "meta_keywords"),
            "classes": ("collapse",)
        }),
        ("Conclusion", {
            "fields": ("overall_conclusion",)
        }),
        ("Source Data", {
            "classes": ("collapse",),
            "fields": ("raw_data",)
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at")
        }),
    )

    @admin.action(description="Mark selected reports as published")
    def mark_as_published(self, request, queryset):
        queryset.update(status=MarketReport.STATUS_PUBLISHED)

    @admin.action(description="Mark selected reports as draft")
    def mark_as_draft(self, request, queryset):
        queryset.update(status=MarketReport.STATUS_DRAFT)
@admin.register(GlobalMarketAnalysis)
class GlobalMarketAnalysisAdmin(admin.ModelAdmin):
    list_display = ("report",)
    search_fields = ("report__title",)


@admin.register(IndianMarketAnalysis)
class IndianMarketAnalysisAdmin(admin.ModelAdmin):
    list_display = ("report",)


@admin.register(InstitutionalFlowAnalysis)
class InstitutionalFlowAnalysisAdmin(admin.ModelAdmin):
    list_display = ("report",)


@admin.register(StockMoverAnalysis)
class StockMoverAnalysisAdmin(admin.ModelAdmin):
    list_display = ("report",)


@admin.register(SectorAnalysis)
class SectorAnalysisAdmin(admin.ModelAdmin):
    list_display = ("report",)

@admin.register(GlobalMarketIndex)
class GlobalMarketIndexAdmin(admin.ModelAdmin):
    list_display = ("index_name", "report", "change_percent", "trend")
    list_filter = ("report", "trend")
    search_fields = ("index_name",)

    readonly_fields = [f.name for f in GlobalMarketIndex._meta.fields]
@admin.register(IndianMarketIndex)
class IndianMarketIndexAdmin(admin.ModelAdmin):
    readonly_fields = [f.name for f in IndianMarketIndex._meta.fields]


@admin.register(InstitutionalFlow)
class InstitutionalFlowAdmin(admin.ModelAdmin):
    readonly_fields = [f.name for f in InstitutionalFlow._meta.fields]


@admin.register(StockMover)
class StockMoverAdmin(admin.ModelAdmin):
    readonly_fields = [f.name for f in StockMover._meta.fields]


@admin.register(SectorPerformance)
class SectorPerformanceAdmin(admin.ModelAdmin):
    readonly_fields = [f.name for f in SectorPerformance._meta.fields]


@admin.register(MarketBreadth)
class MarketBreadthAdmin(admin.ModelAdmin):
    readonly_fields = [f.name for f in MarketBreadth._meta.fields]


@admin.register(OptionChainSummary)
class OptionChainSummaryAdmin(admin.ModelAdmin):
    list_display = ("symbol", "report", "expiry", "pcr", "max_call_oi_strike", "max_put_oi_strike")
    list_filter = ("symbol", "expiry")
    search_fields = ("symbol", "report__title")
    readonly_fields = [f.name for f in OptionChainSummary._meta.fields]


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "created_at")
    search_fields = ("title", "slug")
    prepopulated_fields = {"slug": ("title",)}
    fieldsets = (
        ("Post Details", {
            "fields": ("title", "subtitle", "slug", "category", "news_placement", "education_category", "featured_image", "author", "author_designation")
        }),
        ("SEO Settings", {
            "fields": ("meta_title", "meta_description", "meta_keywords"),
            "classes": ("collapse",)
        }),
        ("Content", {
            "fields": ("key_highlights", "content")
        }),
        ("Stats", {
            "fields": ("view_count",)
        })
    )

    
@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ("email", "subscribed_at")
    search_fields = ("email",)
    list_filter = ("subscribed_at",)

from .models import PostMarketReport
@admin.register(PostMarketReport)
class PostMarketReportAdmin(admin.ModelAdmin):
    list_display = ("title", "report_date", "is_published")
    prepopulated_fields = {"slug": ("title",)}
    fieldsets = (
        ("Report Info", {
            "fields": ("title", "slug", "report_date", "analyst", "analyst_designation", "is_published")
        }),
        ("SEO Settings", {
            "fields": ("meta_title", "meta_description", "meta_keywords"),
            "classes": ("collapse",)
        }),
        ("Content", {
            "fields": ("overall_conclusion", "report_data")
        }),
    )
