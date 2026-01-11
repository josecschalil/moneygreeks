from rest_framework import viewsets
from .models import (
    MarketReport,
    GlobalMarketIndex,
    GlobalMarketAnalysis,
    IndianMarketIndex,
    IndianMarketAnalysis,
    InstitutionalFlow,
    InstitutionalFlowAnalysis,
    StockMover,
    StockMoverAnalysis,
    MarketBreadth,
    SectorPerformance,
    SectorAnalysis
)
from .serializers import (
    MarketReportDetailSerializer,
    GlobalMarketIndexSerializer,
    GlobalMarketAnalysisSerializer,
    IndianMarketIndexSerializer,
    IndianMarketAnalysisSerializer,
    InstitutionalFlowSerializer,
    InstitutionalFlowAnalysisSerializer,
    StockMoverSerializer,
    StockMoverAnalysisSerializer,
    MarketBreadthSerializer,
    SectorPerformanceSerializer,
    SectorAnalysisSerializer
)
class MarketReportViewSet(viewsets.ModelViewSet):
    queryset = MarketReport.objects.all().order_by("-report_date")
    serializer_class = MarketReportDetailSerializer
    lookup_field = "slug"
class GlobalMarketIndexViewSet(viewsets.ModelViewSet):
    queryset = GlobalMarketIndex.objects.all()
    serializer_class = GlobalMarketIndexSerializer
class GlobalMarketAnalysisViewSet(viewsets.ModelViewSet):
    queryset = GlobalMarketAnalysis.objects.all()
    serializer_class = GlobalMarketAnalysisSerializer
class IndianMarketIndexViewSet(viewsets.ModelViewSet):
    queryset = IndianMarketIndex.objects.all()
    serializer_class = IndianMarketIndexSerializer
class IndianMarketAnalysisViewSet(viewsets.ModelViewSet):
    queryset = IndianMarketAnalysis.objects.all()
    serializer_class = IndianMarketAnalysisSerializer
class InstitutionalFlowViewSet(viewsets.ModelViewSet):
    queryset = InstitutionalFlow.objects.all()
    serializer_class = InstitutionalFlowSerializer
class InstitutionalFlowAnalysisViewSet(viewsets.ModelViewSet):
    queryset = InstitutionalFlowAnalysis.objects.all()
    serializer_class = InstitutionalFlowAnalysisSerializer
class StockMoverViewSet(viewsets.ModelViewSet):
    queryset = StockMover.objects.all()
    serializer_class = StockMoverSerializer
class StockMoverAnalysisViewSet(viewsets.ModelViewSet):
    queryset = StockMoverAnalysis.objects.all()
    serializer_class = StockMoverAnalysisSerializer
class MarketBreadthViewSet(viewsets.ModelViewSet):
    queryset = MarketBreadth.objects.all()
    serializer_class = MarketBreadthSerializer
class SectorPerformanceViewSet(viewsets.ModelViewSet):
    queryset = SectorPerformance.objects.all()
    serializer_class = SectorPerformanceSerializer
class SectorAnalysisViewSet(viewsets.ModelViewSet):
    queryset = SectorAnalysis.objects.all()
    serializer_class = SectorAnalysisSerializer
