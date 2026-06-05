from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("posts", "0004_newslettersubscriber"),
    ]

    operations = [
        migrations.AddField(
            model_name="marketreport",
            name="status",
            field=models.CharField(
                choices=[
                    ("draft", "Draft"),
                    ("published", "Published"),
                    ("failed", "Failed"),
                ],
                default="draft",
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="marketreport",
            name="raw_data",
            field=models.JSONField(blank=True, null=True),
        ),
    ]
