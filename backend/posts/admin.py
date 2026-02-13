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
)

@admin.register(MarketReport)
class MarketReportAdmin(admin.ModelAdmin):
    list_display = ("title", "report_date", "created_at")
    list_filter = ("report_date",)
    search_fields = ("title", "slug")
    prepopulated_fields = {"slug": ("title",)}
    ordering = ("-report_date",)

    readonly_fields = ("created_at", "updated_at")

    fieldsets = (
        ("Basic Info", {
            "fields": ("title", "slug", "report_date")
        }),
        ("Conclusion", {
            "fields": ("overall_conclusion",)
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at")
        }),
    )
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
@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ("title", "created_at")

    
@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ("email", "subscribed_at")
    search_fields = ("email",)
    list_filter = ("subscribed_at",)