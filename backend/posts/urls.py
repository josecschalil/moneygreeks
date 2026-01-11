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
router.register("report-list", MarketReportListViewSet, basename="report-list")

urlpatterns = router.urls
