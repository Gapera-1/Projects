from rest_framework import serializers
from .models import Medicine


class MedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicine
        fields = ['id', 'user', 'name', 'dosage', 'time', 'notes', 'active', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']
