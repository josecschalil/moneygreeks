import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User

if not User.objects.filter(username='jose').exists():
    User.objects.create_superuser('jose', 'jose@example.com', '1234')
    print("User jose created")
else:
    print("User jose already exists")
