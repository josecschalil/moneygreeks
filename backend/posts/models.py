from django.db import models

class MarketReport(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    report_date = models.DateField(unique=True)
    image_url = models.URLField(max_length=1000,blank=True,null=True)
    overall_conclusion = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.report_date}"

class GlobalMarketIndex(models.Model):
    report = models.ForeignKey(
        MarketReport,
        on_delete=models.CASCADE,
        related_name="global_indices"
    )

    index_name = models.CharField(max_length=100)
    prev_close = models.DecimalField(max_digits=10, decimal_places=2)
    open_price = models.DecimalField(max_digits=10, decimal_places=2)
    change = models.DecimalField(max_digits=10, decimal_places=2)
    change_percent = models.DecimalField(max_digits=6, decimal_places=2)
    trend = models.CharField(
        max_length=10,
        choices=[("up", "Up"), ("down", "Down")]
    )
class GlobalMarketAnalysis(models.Model):
    report = models.OneToOneField(
        MarketReport,
        on_delete=models.CASCADE,
        related_name="global_analysis"
    )
    analysis = models.TextField()

class IndianMarketIndex(models.Model):
    report = models.ForeignKey(
        MarketReport,
        on_delete=models.CASCADE,
        related_name="indian_indices"
    )

    index_name = models.CharField(max_length=100)
    prev_close = models.DecimalField(max_digits=10, decimal_places=2)
    open_price = models.DecimalField(max_digits=10, decimal_places=2)
    change = models.DecimalField(max_digits=10, decimal_places=2)
    change_percent = models.DecimalField(max_digits=6, decimal_places=2)
    trend = models.CharField(
        max_length=10,
        choices=[("up", "Up"), ("down", "Down")]
    )
class IndianMarketAnalysis(models.Model):
    report = models.OneToOneField(
        MarketReport,
        on_delete=models.CASCADE,
        related_name="indian_analysis"
    )
    analysis = models.TextField()
class InstitutionalFlow(models.Model):
    report = models.ForeignKey(
        MarketReport,
        on_delete=models.CASCADE,
        related_name="institutional_flows"
    )

    institution_type = models.CharField(
        max_length=10,
        choices=[("FII", "FII"), ("DII", "DII")]
    )

    date = models.DateField()
    buy_value = models.DecimalField(max_digits=12, decimal_places=2)
    sell_value = models.DecimalField(max_digits=12, decimal_places=2)
    net_value = models.DecimalField(max_digits=12, decimal_places=2)
    trend = models.CharField(
        max_length=10,
        choices=[("up", "Up"), ("down", "Down")]
    )

class InstitutionalFlowAnalysis(models.Model):
    report = models.OneToOneField(
        MarketReport,
        on_delete=models.CASCADE,
        related_name="institutional_analysis"
    )
    analysis = models.TextField()

class StockMover(models.Model):
    report = models.ForeignKey(
        MarketReport,
        on_delete=models.CASCADE,
        related_name="stock_movers"
    )

    category = models.CharField(
        max_length=10,
        choices=[("gainer", "Gainer"), ("loser", "Loser")]
    )

    symbol = models.CharField(max_length=20)
    prev_close = models.DecimalField(max_digits=10, decimal_places=2)
    open_price = models.DecimalField(max_digits=10, decimal_places=2)
    change_percent = models.DecimalField(max_digits=6, decimal_places=2)
    volume = models.CharField(max_length=50)
class StockMoverAnalysis(models.Model):
    report = models.OneToOneField(
        MarketReport,
        on_delete=models.CASCADE,
        related_name="stock_mover_analysis"
    )
    analysis = models.TextField()
class MarketBreadth(models.Model):
    report = models.OneToOneField(
        MarketReport,
        on_delete=models.CASCADE,
        related_name="market_breadth"
    )

    advancing = models.PositiveIntegerField()
    declining = models.PositiveIntegerField()
    advance_decline_ratio = models.DecimalField(max_digits=5, decimal_places=2)


class SectorAnalysis(models.Model):
    report = models.OneToOneField(
        MarketReport,
        on_delete=models.CASCADE,
        related_name="sector_analysis"
    )
    analysis = models.TextField()

class SectorPerformance(models.Model):
    report = models.ForeignKey(
        MarketReport,
        on_delete=models.CASCADE,
        related_name="sector_performance"
    )

    category = models.CharField(
        max_length=10,
        choices=[("gainer", "Gainer"), ("loser", "Loser")]
    )

    sector_name = models.CharField(max_length=100)
    prev_close = models.DecimalField(max_digits=10, decimal_places=2)
    change = models.DecimalField(max_digits=10, decimal_places=2)
    change_percent = models.DecimalField(max_digits=6, decimal_places=2)
    pe = models.DecimalField(max_digits=6, decimal_places=2)
    pb = models.DecimalField(max_digits=6, decimal_places=2)
    div_yield = models.DecimalField(max_digits=10, decimal_places=2)
