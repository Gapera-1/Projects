from django.apps import AppConfig


class RemindersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'reminders'
    def ready(self):
        # import signal handlers to ensure login events are recorded
        try:
            import reminders.signals  # noqa: F401
        except Exception:
            pass
