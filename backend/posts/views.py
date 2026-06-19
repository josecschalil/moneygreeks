from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from .permissions import AllowAnyPostOrIsAuthenticatedOrReadOnly
from .models import (
    MarketReport,
    GlobalMarketIndex,
    GlobalMarketAnalysis,
    IndianMarketIndex,
    IndianMarketAnalysis,
    InstitutionalFlow,
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
    PostMarketReport,
    PageView,
)
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
    permission_classes = [AllowAnyPostOrIsAuthenticatedOrReadOnly]
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
            raw_data = collector.collect(report_date=report_date)
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
    permission_classes = [AllowAny]

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
    permission_classes = [AllowAnyPostOrIsAuthenticatedOrReadOnly]
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

from django.contrib.auth import authenticate

class AdminLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return Response({"success": True, "token": token.key}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

from .models import ApiSystemLog
from .serializers import ApiSystemLogSerializer

class ApiSystemLogViewSet(viewsets.ModelViewSet):
    queryset = ApiSystemLog.objects.all().order_by('-last_checked')
    serializer_class = ApiSystemLogSerializer
    http_method_names = ["get", "delete"]  # allow admin to delete logs if they want


class NewsPostsView(APIView):
    """
    Targeted news posts endpoint.
    Query params:
      placement  - news_placement value (hero, latest, deep_dive, live_feed, quick_hit, breaking)
      limit      - max number of posts to return (default 10)
    Always returns posts ordered by -created_at (newest first).
    """
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        placement = request.query_params.get("placement")
        try:
            limit = int(request.query_params.get("limit", 10))
        except (ValueError, TypeError):
            limit = 10

        qs = BlogPost.objects.filter(category="news").order_by("-created_at")
        if placement:
            qs = qs.filter(news_placement=placement)

        qs = qs[:limit]
        serializer = BlogPostSerializer(qs, many=True)
        return Response(serializer.data)


# ─────────────────────────────────────────────────────────────────────────────
# Analytics: Bot Detection + Tracking
# ─────────────────────────────────────────────────────────────────────────────
import re
import hashlib
from datetime import date, timedelta
from django.db.models import Count, Q
from django.db.models.functions import TruncDate
from rest_framework.permissions import IsAuthenticated

# ~90 known bot / crawler User-Agent signatures
BOT_UA_PATTERNS = re.compile(
    r"("
    # Search engines
    r"Googlebot|Googlelabs|Google-InspectionTool|Google-Read-Aloud"
    r"|AdsBot-Google|Mediapartners-Google"
    r"|Bingbot|BingPreview|msnbot|adidxbot"
    r"|DuckDuckBot|DuckDuckGo"
    r"|Baiduspider|Sogou"
    r"|YandexBot|YandexImages|YandexMetrika|YandexAccessibilityBot"
    r"|Applebot"
    r"|Slurp"
    r"|ia_archiver|archive.org_bot"
    # SEO/analytics tools
    r"|AhrefsBot|SemrushBot|MJ12bot|DotBot|BLEXBot|SEOkicks"
    r"|Screaming Frog|Sistrix|Majestic"
    r"|DataForSeoBot|SEOdiver|serpstatbot"
    r"|RogerBot|linkdexbot|Exabot"
    # Social scrapers
    r"|facebookexternalhit|Facebot|Twitterbot|LinkedInBot"
    r"|WhatsApp|TelegramBot|Discordbot|Slackbot"
    r"|Pinterest|Snapchat"
    # AI / LLM crawlers
    r"|GPTBot|OAI-SearchBot|ChatGPT-User"
    r"|Claude-Web|anthropic-ai|ClaudeBot"
    r"|PerplexityBot|Perplexity"
    r"|cohere-ai|YouBot"
    r"|Meta-ExternalAgent|meta-externalagent"
    r"|Bytespider|TikTokBot"
    # Monitoring / uptime
    r"|UptimeRobot|Pingdom|StatusCake|Site24x7|GTmetrix|PageSpeed"
    r"|Lighthouse|Chrome-Lighthouse"
    # HTTP libraries / CLI
    r"|python-requests|python-urllib|PycURL"
    r"|wget|curl|libwww-perl|Go-http-client"
    r"|Java/|Jakarta|okhttp"
    r"|axios|node-fetch|got/|superagent"
    # Scrapers / headless
    r"|Scrapy|HeadlessChrome|PhantomJS|Puppeteer|Playwright"
    r"|selenium|webdriver|chromedriver"
    # Generic signals
    r"|[Bb]ot[/ ]|[Cc]rawler|[Ss]pider|[Ss]craper"
    r"|[Ff]etcher|[Cc]hecker|[Mm]onitor"
    r")",
    re.IGNORECASE,
)

KNOWN_BOT_NAMES = [
    ("Googlebot", "Googlebot"),
    ("Bingbot", "Bingbot"),
    ("DuckDuckBot", "DuckDuckBot"),
    ("Baiduspider", "Baiduspider"),
    ("YandexBot", "YandexBot"),
    ("Applebot", "Applebot"),
    ("AhrefsBot", "AhrefsBot"),
    ("SemrushBot", "SemrushBot"),
    ("MJ12bot", "MJ12bot"),
    ("DotBot", "DotBot"),
    ("facebookexternalhit", "Facebookbot"),
    ("Twitterbot", "Twitterbot"),
    ("LinkedInBot", "LinkedInBot"),
    ("GPTBot", "GPTBot"),
    ("ClaudeBot", "ClaudeBot"),
    ("Claude-Web", "Claude-Web"),
    ("anthropic-ai", "Anthropic AI"),
    ("PerplexityBot", "PerplexityBot"),
    ("UptimeRobot", "UptimeRobot"),
    ("Scrapy", "Scrapy"),
    ("python-requests", "python-requests"),
    ("wget", "wget"),
    ("curl", "curl"),
]


def detect_bot(ua: str) -> tuple[bool, str]:
    """Returns (is_bot, bot_name). bot_name is empty string for humans."""
    if not ua:
        return False, ""
    if BOT_UA_PATTERNS.search(ua):
        for pattern, name in KNOWN_BOT_NAMES:
            if re.search(pattern, ua, re.IGNORECASE):
                return True, name
        return True, "Unknown Bot"
    return False, ""


def detect_device(ua: str, is_bot: bool) -> str:
    if is_bot:
        return PageView.DEVICE_BOT
    if not ua:
        return PageView.DEVICE_UNKNOWN
    ua_lower = ua.lower()
    if any(kw in ua_lower for kw in ["tablet", "ipad", "kindle", "playbook"]):
        return PageView.DEVICE_TABLET
    if any(kw in ua_lower for kw in ["mobile", "android", "iphone", "ipod", "windows phone", "blackberry", "opera mini"]):
        return PageView.DEVICE_MOBILE
    return PageView.DEVICE_DESKTOP


def get_ip_hash(request) -> str:
    """Hash the real client IP with today's date as rotating salt for privacy."""
    forwarded = request.META.get("HTTP_X_FORWARDED_FOR", "")
    ip = forwarded.split(",")[0].strip() if forwarded else request.META.get("REMOTE_ADDR", "")
    daily_salt = date.today().isoformat()
    return hashlib.sha256(f"{ip}:{daily_salt}".encode()).hexdigest()


class TrackPageViewView(APIView):
    """
    POST /api/posts/track/
    Public endpoint called by the client-side PageTracker beacon.
    Body: { page_type, page_slug, page_title, session_id, referrer }
    The server reads User-Agent from headers.
    """
    permission_classes = [AllowAny]
    throttle_classes = []  # no throttling needed — fire-and-forget analytics beacon

    def post(self, request, *args, **kwargs):
        data = request.data
        ua = request.META.get("HTTP_USER_AGENT", "")
        is_bot, bot_name = detect_bot(ua)
        device_type = detect_device(ua, is_bot)
        ip_hash = get_ip_hash(request)

        # Validate page_type
        valid_types = [c[0] for c in PageView.PAGE_TYPE_CHOICES]
        page_type = data.get("page_type", PageView.PAGE_TYPE_OTHER)
        if page_type not in valid_types:
            page_type = PageView.PAGE_TYPE_OTHER

        referrer = (data.get("referrer") or "")[:1000]

        PageView.objects.create(
            page_type=page_type,
            page_slug=(data.get("page_slug") or "")[:255],
            page_title=(data.get("page_title") or "")[:500],
            ip_hash=ip_hash,
            session_id=(data.get("session_id") or "")[:64],
            user_agent=ua[:2000] if ua else "",
            referrer=referrer,
            is_bot=is_bot,
            bot_name=bot_name,
            device_type=device_type,
            country_code=(request.META.get("HTTP_CF_IPCOUNTRY") or "")[:5],
        )
        return Response({"ok": True}, status=status.HTTP_201_CREATED)


class AnalyticsView(APIView):
    """
    GET /api/posts/analytics/
    Admin-only analytics aggregation.
    Query params:
      period  - 7d | 30d | 90d | all (default: 30d)
      page_type - filter by type
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        period = request.query_params.get("period", "30d")
        page_type_filter = request.query_params.get("page_type", "")

        # Base queryset with optional date filter
        qs = PageView.objects.all()
        if period != "all":
            days = {"7d": 7, "30d": 30, "90d": 90}.get(period, 30)
            cutoff = date.today() - timedelta(days=days)
            qs = qs.filter(created_at__date__gte=cutoff)

        if page_type_filter:
            qs = qs.filter(page_type=page_type_filter)

        human_qs = qs.filter(is_bot=False)
        bot_qs = qs.filter(is_bot=True)

        # ── Summary ──────────────────────────────────────────────────────────
        total_views = qs.count()
        human_views = human_qs.count()
        bot_views = bot_qs.count()
        unique_visitors = human_qs.values("ip_hash").distinct().count()
        unique_sessions = human_qs.values("session_id").exclude(session_id="").distinct().count()
        bot_pct = round((bot_views / total_views * 100) if total_views else 0, 1)

        # ── Views by content type ────────────────────────────────────────────
        by_type = (
            qs.values("page_type")
            .annotate(
                total=Count("id"),
                humans=Count("id", filter=Q(is_bot=False)),
                bots=Count("id", filter=Q(is_bot=True)),
                unique=Count("ip_hash", filter=Q(is_bot=False), distinct=True),
            )
            .order_by("-total")
        )

        # ── Top posts (slug-level) ───────────────────────────────────────────
        top_posts = (
            qs.exclude(page_slug="")
            .values("page_type", "page_slug", "page_title")
            .annotate(
                total=Count("id"),
                humans=Count("id", filter=Q(is_bot=False)),
                bots=Count("id", filter=Q(is_bot=True)),
                unique=Count("ip_hash", filter=Q(is_bot=False), distinct=True),
            )
            .order_by("-humans")[:50]
        )

        # ── Daily trend ──────────────────────────────────────────────────────
        daily_trend = (
            qs.annotate(day=TruncDate("created_at"))
            .values("day")
            .annotate(
                total=Count("id"),
                humans=Count("id", filter=Q(is_bot=False)),
                bots=Count("id", filter=Q(is_bot=True)),
                unique=Count("ip_hash", filter=Q(is_bot=False), distinct=True),
            )
            .order_by("day")
        )

        # ── Bot breakdown ────────────────────────────────────────────────────
        bot_breakdown = (
            bot_qs.exclude(bot_name="")
            .values("bot_name")
            .annotate(count=Count("id"))
            .order_by("-count")[:15]
        )

        # ── Device breakdown ─────────────────────────────────────────────────
        device_breakdown = (
            human_qs.values("device_type")
            .annotate(count=Count("id"))
            .order_by("-count")
        )

        # ── Top referrers ────────────────────────────────────────────────────
        top_referrers = (
            human_qs.exclude(referrer="")
            .values("referrer")
            .annotate(count=Count("id"))
            .order_by("-count")[:20]
        )

        # ── Recent hits (live feed) ──────────────────────────────────────────
        recent_hits = list(
            qs.values(
                "id", "page_type", "page_slug", "page_title",
                "is_bot", "bot_name", "device_type", "referrer",
                "created_at", "country_code",
            ).order_by("-created_at")[:30]
        )
        # Convert datetimes for JSON serialisation
        for hit in recent_hits:
            hit["created_at"] = hit["created_at"].isoformat()

        # ── Page type label map ──────────────────────────────────────────────
        type_labels = dict(PageView.PAGE_TYPE_CHOICES)

        return Response({
            "summary": {
                "total_views": total_views,
                "human_views": human_views,
                "bot_views": bot_views,
                "unique_visitors": unique_visitors,
                "unique_sessions": unique_sessions,
                "bot_pct": bot_pct,
                "period": period,
            },
            "by_type": [
                {
                    **row,
                    "label": type_labels.get(row["page_type"], row["page_type"]),
                    "bot_pct": round((row["bots"] / row["total"] * 100) if row["total"] else 0, 1),
                }
                for row in by_type
            ],
            "top_posts": list(top_posts),
            "daily_trend": [
                {
                    **row,
                    "day": row["day"].isoformat(),
                }
                for row in daily_trend
            ],
            "bot_breakdown": list(bot_breakdown),
            "device_breakdown": list(device_breakdown),
            "top_referrers": list(top_referrers),
            "recent_hits": recent_hits,
            "type_labels": type_labels,
        })
