import os
from django.apps import AppConfig

class PostsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'posts'

    def ready(self):
        # Avoid starting the thread twice during development (runserver autoreloader)
        # or when running management commands like migrate/makemigrations
        if os.environ.get('RUN_MAIN', None) == 'true' or os.environ.get('SERVER_SOFTWARE', '').startswith('gunicorn'):
            from .ticker_thread import start_ticker_thread
            start_ticker_thread()

