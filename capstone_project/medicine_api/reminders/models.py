from django.db import models
from django.conf import settings


class Medicine(models.Model):
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='medicines')
	name = models.CharField(max_length=200)
	dosage = models.CharField(max_length=100, blank=True)
	time = models.DateTimeField(null=True, blank=True)
	notes = models.TextField(blank=True)
	active = models.BooleanField(default=True)
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"{self.name} ({self.dosage})"


class LoginEvent(models.Model):
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
	username = models.CharField(max_length=150, blank=True)
	timestamp = models.DateTimeField(auto_now_add=True)
	ip_address = models.GenericIPAddressField(null=True, blank=True)
	user_agent = models.TextField(blank=True)
	successful = models.BooleanField(default=True)
	path = models.CharField(max_length=255, blank=True)

	class Meta:
		ordering = ['-timestamp']

	def __str__(self):
		return f"LoginEvent(username={self.username}, successful={self.successful}, time={self.timestamp})"
