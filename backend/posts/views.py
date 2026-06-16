from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from .models import (
    MarketReport,
    GlobalMarketIndex,
    GlobalMarketAnalysis,
    IndianMarketIndex,
    IndianMarketAnalysis,
    InstitutionalFlow,)
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
    OptionChainSummary,
    BlogPost,
    EducationCategory,
    DailySentiment,
    Enquiry,
    PostMarketReport)
from django.utils import timezone
from .services.premarket_data_collector import PremarketDataCollector, archive_premarket_data
from .services.premarket_report_generator import PremarketReportError, build_report_from_data
from rest_framework.views import APIView
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
    SectorAnalysisSerializer,
    OptionChainSummarySerializer,
    EducationCategorySerializer,
    DailySentimentSerializer,
    EnquirySerializer,
    PostMarketReportSerializer
)
class MarketReportViewSet(viewsets.ModelViewSet):
    serializer_class = MarketReportDetailSerializer
    lookup_field = "slug"

    def get_queryset(self):
        queryset = MarketReport.objects.all().order_by("-report_date")
        if self.request and self.request.user and self.request.user.is_staff:
            return queryset
        return queryset.filter(status=MarketReport.STATUS_PUBLISHED)
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
class OptionChainSummaryViewSet(viewsets.ModelViewSet):
    queryset = OptionChainSummary.objects.all()
    serializer_class = OptionChainSummarySerializer
class MarketReportListViewSet(viewsets.ModelViewSet):
    serializer_class = ReportListSerializer
    lookup_field = "slug"

    def get_queryset(self):
        queryset = MarketReport.objects.all().order_by("-report_date")
        if self.request and self.request.user and self.request.user.is_staff:
            return queryset
        return queryset.filter(status=MarketReport.STATUS_PUBLISHED)
class BlogPostDetailView(viewsets.ModelViewSet):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    lookup_field = "slug"

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.view_count += 1
        instance.save(update_fields=['view_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class EducationCategoryViewSet(viewsets.ModelViewSet):
    queryset = EducationCategory.objects.all()
    serializer_class = EducationCategorySerializer
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

class GenerateReportView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            report_date = timezone.localdate()
            collector = PremarketDataCollector()
            raw_data = collector.collect(report_date=report_date, include_google=True)
            archive_premarket_data(raw_data, report_date=report_date)
            
            report = build_report_from_data(
                raw_data,
                report_date=report_date,
                status=MarketReport.STATUS_PUBLISHED,
                replace=True,
            )
            return Response(
                {
                    "message": "Report generated successfully",
                    "slug": report.slug,
                    "title": report.title,
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class DailySentimentTodayView(APIView):
    def get(self, request, *args, **kwargs):
        today = timezone.localdate()
        sentiment, created = DailySentiment.objects.get_or_create(date=today)
        serializer = DailySentimentSerializer(sentiment)
        return Response(serializer.data, status=status.HTTP_200_OK)

class DailySentimentVoteView(APIView):
    def post(self, request, *args, **kwargs):
        vote = request.data.get("vote")
        if vote not in ["bullish", "bearish"]:
            return Response({"error": "Invalid vote. Must be 'bullish' or 'bearish'."}, status=status.HTTP_400_BAD_REQUEST)
        
        today = timezone.localdate()
        sentiment, created = DailySentiment.objects.get_or_create(date=today)
        
        if vote == "bullish":
            sentiment.bullish_votes += 1
        elif vote == "bearish":
            sentiment.bearish_votes += 1
            
        sentiment.save(update_fields=["bullish_votes", "bearish_votes"])
        
        serializer = DailySentimentSerializer(sentiment)
        return Response(serializer.data, status=status.HTTP_200_OK)

class EnquiryViewSet(viewsets.ModelViewSet):
    queryset = Enquiry.objects.all()
    serializer_class = EnquirySerializer
    http_method_names = ["get", "post", "patch", "delete"]

class PostMarketReportViewSet(viewsets.ModelViewSet):
    queryset = PostMarketReport.objects.filter(is_published=True)
    serializer_class = PostMarketReportSerializer
    lookup_field = "slug"
    http_method_names = ["get", "post", "patch", "delete"]

    def get_queryset(self):
        # Admin can see all; public only sees published
        return PostMarketReport.objects.all()

import requests
import json
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import LiveMarketIndex
from .serializers import LiveMarketIndexSerializer

class LiveIndianIndicesView(APIView):
    def get(self, request, *args, **kwargs):
        indices = LiveMarketIndex.objects.all().order_by('id')
        serializer = LiveMarketIndexSerializer(indices, many=True)
        return Response(serializer.data)

