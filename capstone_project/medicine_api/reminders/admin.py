from django.contrib import admin
from .models import Medicine


@admin.register(Medicine)
class MedicineAdmin(admin.ModelAdmin):
	list_display = ('name', 'dosage', 'user', 'time', 'active', 'created_at')
	list_filter = ('active',)
	search_fields = ('name', 'dosage', 'notes')
