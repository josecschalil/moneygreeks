from rest_framework import serializers
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
class GlobalMarketIndexSerializer(serializers.ModelSerializer):
    class Meta:
        model = GlobalMarketIndex
        fields = "__all__"


class GlobalMarketAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = GlobalMarketAnalysis
        fields = "__all__"


class IndianMarketIndexSerializer(serializers.ModelSerializer):
    class Meta:
        model = IndianMarketIndex
        fields = "__all__"


class IndianMarketAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = IndianMarketAnalysis
        fields = "__all__"


class InstitutionalFlowSerializer(serializers.ModelSerializer):
    class Meta:
        model = InstitutionalFlow
        fields = "__all__"


class InstitutionalFlowAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = InstitutionalFlowAnalysis
        fields = "__all__"


class StockMoverSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockMover
        fields = "__all__"


class StockMoverAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockMoverAnalysis
        fields = "__all__"


class MarketBreadthSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketBreadth
        fields = "__all__"


class SectorPerformanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = SectorPerformance
        fields = "__all__"


class SectorAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = SectorAnalysis
        fields = "__all__"
class MarketReportDetailSerializer(serializers.ModelSerializer):
    global_indices = GlobalMarketIndexSerializer(many=True, read_only=True)
    global_analysis = GlobalMarketAnalysisSerializer(read_only=True)

    indian_indices = IndianMarketIndexSerializer(many=True, read_only=True)
    indian_analysis = IndianMarketAnalysisSerializer(read_only=True)

    institutional_flows = InstitutionalFlowSerializer(many=True, read_only=True)
    institutional_analysis = InstitutionalFlowAnalysisSerializer(read_only=True)

    stock_movers = StockMoverSerializer(many=True, read_only=True)
    stock_mover_analysis = StockMoverAnalysisSerializer(read_only=True)

    market_breadth = MarketBreadthSerializer(read_only=True)

    sector_performance = SectorPerformanceSerializer(many=True, read_only=True)
    sector_analysis = SectorAnalysisSerializer(read_only=True)

    class Meta:
        model = MarketReport
        fields = [
            "id",
            "title",
            "slug",
            "image_url",
            "report_date",
            "created_at",

            "global_indices",
            "global_analysis",

            "indian_indices",
            "indian_analysis",

            "institutional_flows",
            "institutional_analysis",

            "stock_movers",
            "stock_mover_analysis",

            "market_breadth",

            "sector_performance",
            "sector_analysis",

            "overall_conclusion",
        ]


class ReportListSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketReport
        fields = [
            "id",
            "title",
            "slug",
            "report_date",
            "overall_conclusion",
            "image_url",
        ]


class BlogPostSerializer(serializers.ModelSerializer):

    class Meta:
        model = BlogPost
        fields = [
            "title",
            "subtitle",
            "slug",
            "category",
            "featured_image",
            "content",
            "created_at",
         
        ]

class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ("id", "email", "subscribed_at")
        extra_kwargs = {
            "email": {
                "validators": [],  # 🔥 disable unique validator
            }
        }
    def create(self, validated_data):
        email = validated_data.get("email")
        email = email.strip().lower()

        subscriber, created = NewsletterSubscriber.objects.get_or_create(
            email=email,
        )

        if not created :
            subscriber.save()

        return subscriber