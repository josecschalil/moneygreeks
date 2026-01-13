from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from .models import (
    MarketReport,
    GlobalMarketIndex,
    GlobalMarketAnalysis,
    IndianMarketIndex,
    IndianMarketAnalysis,
    InstitutionalFlow,
    InstitutionalFlowAnalysis,
    NewsletterSubscriber,
    StockMover,
    StockMoverAnalysis,
    MarketBreadth,
    SectorPerformance,
    SectorAnalysis,
    BlogPost
)
from .serializers import (
    BlogPostSerializer,
    MarketReportDetailSerializer,
    GlobalMarketIndexSerializer,
    GlobalMarketAnalysisSerializer,
    IndianMarketIndexSerializer,
    IndianMarketAnalysisSerializer,
    InstitutionalFlowSerializer,
    InstitutionalFlowAnalysisSerializer,
    NewsletterSubscriberSerializer,
    ReportListSerializer,
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
class MarketReportListViewSet(viewsets.ModelViewSet):
    queryset = MarketReport.objects.all().order_by("-report_date")
    serializer_class = ReportListSerializer
    lookup_field = "slug"
class BlogPostDetailView(viewsets.ModelViewSet):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    lookup_field = "slug"
class NewsletterSubscriberViewSet(viewsets.ModelViewSet):
    queryset = NewsletterSubscriber.objects.all()
    serializer_class = NewsletterSubscriberSerializer
    http_method_names = ["get", "post"]
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]

        subscriber, created = NewsletterSubscriber.objects.get_or_create(
            email=email
        )

        if not created:
            return Response(
                {
                    "message": "You are already subscribed to our newsletter.",
                    "status": "already_subscribed",
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {
                "message": "Successfully subscribed to newsletter.",
                "status": "subscribed",
            },
            status=status.HTTP_201_CREATED,
        )
