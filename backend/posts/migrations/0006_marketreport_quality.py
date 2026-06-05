from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("posts", "0005_marketreport_status_raw_data"),
    ]

    operations = [
        migrations.AddField(
            model_name="marketreport",
            name="quality_score",
            field=models.PositiveSmallIntegerField(default=0),
        ),
        migrations.AddField(
            model_name="marketreport",
            name="report_type",
            field=models.CharField(
                choices=[
                    ("full", "Full"),
                    ("standard", "Standard"),
                    ("limited", "Limited"),
                    ("failed", "Failed"),
                ],
                default="limited",
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="marketreport",
            name="quality_notes",
            field=models.JSONField(blank=True, null=True),
        ),
    ]
