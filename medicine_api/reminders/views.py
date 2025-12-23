from rest_framework import viewsets, permissions
from .models import Medicine
from .serializers import MedicineSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated


class MedicineViewSet(viewsets.ModelViewSet):
	queryset = Medicine.objects.all().order_by('-created_at')
	serializer_class = MedicineSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		# return medicines for the authenticated user
		user = self.request.user
		return Medicine.objects.filter(user=user).order_by('-created_at')

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)


class SignupView(APIView):
	permission_classes = [AllowAny]

	def post(self, request):
		email = request.data.get('email', '').strip()
		password = request.data.get('password', '').strip()
		
		# Simple validation
		if not email or not password:
			return Response({'detail': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)
		
		if len(password) < 6:
			return Response({'detail': 'Password must be at least 6 characters'}, status=status.HTTP_400_BAD_REQUEST)
		
		if '@' not in email or '.' not in email:
			return Response({'detail': 'Please enter a valid email address'}, status=status.HTTP_400_BAD_REQUEST)
		
		if User.objects.filter(email=email).exists():
			return Response({'detail': 'This email is already registered'}, status=status.HTTP_400_BAD_REQUEST)
		
		try:
			user = User.objects.create_user(username=email, email=email, password=password)
			return Response({'detail': 'Account created successfully! You can now log in.'}, status=status.HTTP_201_CREATED)
		except Exception as e:
			return Response({'detail': f'Error creating account: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminSignupView(APIView):
	permission_classes = [AllowAny]

	def post(self, request):
		email = request.data.get('email', '').strip()
		password = request.data.get('password', '').strip()
		admin_key = request.data.get('admin_key', '').strip()
		
		# Verify admin key (secret code to create admin accounts)
		ADMIN_SECRET_KEY = 'admin123'  # Change this to your own secret key
		
		if admin_key != ADMIN_SECRET_KEY:
			return Response({'detail': 'Invalid admin key'}, status=status.HTTP_403_FORBIDDEN)
		
		# Simple validation
		if not email or not password:
			return Response({'detail': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)
		
		if len(password) < 6:
			return Response({'detail': 'Password must be at least 6 characters'}, status=status.HTTP_400_BAD_REQUEST)
		
		if '@' not in email or '.' not in email:
			return Response({'detail': 'Please enter a valid email address'}, status=status.HTTP_400_BAD_REQUEST)
		
		if User.objects.filter(email=email).exists():
			return Response({'detail': 'This email is already registered'}, status=status.HTTP_400_BAD_REQUEST)
		
		try:
			user = User.objects.create_superuser(username=email, email=email, password=password)
			return Response({'detail': 'Admin account created successfully! You can now log in to the admin panel.'}, status=status.HTTP_201_CREATED)
		except Exception as e:
			return Response({'detail': f'Error creating admin account: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CurrentUserView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		user = request.user
		return Response({
			'id': user.id,
			'username': user.username,
			'email': user.email,
			'first_name': user.first_name,
			'last_name': user.last_name,
			'is_staff': user.is_staff,
			'is_superuser': user.is_superuser,
			'date_joined': user.date_joined,
		}, status=status.HTTP_200_OK)
