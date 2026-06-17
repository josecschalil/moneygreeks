from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register("reports", MarketReportViewSet, basename="reports")

router.register("global-indices", GlobalMarketIndexViewSet)
router.register("global-analysis", GlobalMarketAnalysisViewSet)

router.register("indian-indices", IndianMarketIndexViewSet)
router.register("indian-analysis", IndianMarketAnalysisViewSet)

router.register("institutional-flows", InstitutionalFlowViewSet)
router.register("institutional-analysis", InstitutionalFlowAnalysisViewSet)

router.register("stock-movers", StockMoverViewSet)
router.register("stock-mover-analysis", StockMoverAnalysisViewSet)

router.register("market-breadth", MarketBreadthViewSet)

router.register("sector-performance", SectorPerformanceViewSet)
router.register("sector-analysis", SectorAnalysisViewSet)
router.register("option-chain-summaries", OptionChainSummaryViewSet)
router.register("blog-post", BlogPostDetailView, basename="blog-post")
router.register("education-categories", EducationCategoryViewSet, basename="education-categories")
router.register("report-list", MarketReportListViewSet, basename="report-list")
router.register(r"newsletter-subscribe", NewsletterSubscriberViewSet, basename="newsletter-subscribe")
router.register("enquiries", EnquiryViewSet, basename="enquiries")
router.register("post-market-list", PostMarketReportViewSet, basename="post-market-list")

urlpatterns = [
    path("generate-report/", GenerateReportView.as_view(), name="generate-report"),
    path("sentiment/today/", DailySentimentTodayView.as_view(), name="sentiment-today"),
    path("sentiment/vote/", DailySentimentVoteView.as_view(), name="sentiment-vote"),
    path("live-indian-indices/", LiveIndianIndicesView.as_view(), name="live-indian-indices"),
    path("admin-login/", AdminLoginView.as_view(), name="admin-login"),
] + router.urls
