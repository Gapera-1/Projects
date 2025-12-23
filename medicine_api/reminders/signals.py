from django.contrib.auth.signals import user_logged_in, user_login_failed, user_logged_out
from django.dispatch import receiver
from .models import LoginEvent


def _get_client_ip(request):
    xff = None
    if request is not None:
        xff = request.META.get('HTTP_X_FORWARDED_FOR')
    if xff:
        return xff.split(',')[0].strip()
    if request is not None:
        return request.META.get('REMOTE_ADDR')
    return None


@receiver(user_logged_in)
def log_user_logged_in(sender, request, user, **kwargs):
    LoginEvent.objects.create(
        user=user,
        username=str(user),
        ip_address=_get_client_ip(request),
        user_agent=(request.META.get('HTTP_USER_AGENT', '') if request is not None else ''),
        successful=True,
        path=(request.path if request is not None else ''),
    )


@receiver(user_logged_out)
def log_user_logged_out(sender, request, user, **kwargs):
    LoginEvent.objects.create(
        user=(user if user is not None else None),
        username=(str(user) if user is not None else ''),
        ip_address=(_get_client_ip(request) if request is not None else None),
        user_agent=(request.META.get('HTTP_USER_AGENT', '') if request is not None else ''),
        successful=True,
        path=(request.path if request is not None else ''),
    )


@receiver(user_login_failed)
def log_user_login_failed(sender, credentials, request, **kwargs):
    username = ''
    try:
        username = credentials.get('username') if isinstance(credentials, dict) else ''
    except Exception:
        username = ''
    LoginEvent.objects.create(
        user=None,
        username=username or '',
        ip_address=(_get_client_ip(request) if request is not None else None),
        user_agent=(request.META.get('HTTP_USER_AGENT', '') if request is not None else ''),
        successful=False,
        path=(request.path if request is not None else ''),
    )
