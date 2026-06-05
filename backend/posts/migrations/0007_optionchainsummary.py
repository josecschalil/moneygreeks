from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("posts", "0006_marketreport_quality"),
    ]

    operations = [
        migrations.CreateModel(
            name="OptionChainSummary",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("symbol", models.CharField(max_length=20)),
                ("expiry", models.CharField(blank=True, max_length=20)),
                ("pcr", models.DecimalField(blank=True, decimal_places=2, max_digits=6, null=True)),
                ("max_call_oi_strike", models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ("max_call_oi", models.PositiveIntegerField(default=0)),
                ("max_put_oi_strike", models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ("max_put_oi", models.PositiveIntegerField(default=0)),
                ("underlying_value", models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ("analysis", models.TextField(blank=True)),
                (
                    "report",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="option_chain_summaries",
                        to="posts.marketreport",
                    ),
                ),
            ],
        ),
    ]
