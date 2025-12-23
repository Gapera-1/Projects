from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import MedicineViewSet, SignupView, AdminSignupView, CurrentUserView

router = DefaultRouter()
router.register(r'medicines', MedicineViewSet, basename='medicine')

urlpatterns = [
	path('auth/signup/', SignupView.as_view(), name='signup'),
	path('auth/admin-signup/', AdminSignupView.as_view(), name='admin-signup'),
	path('auth/me/', CurrentUserView.as_view(), name='current-user'),
]

urlpatterns += router.urls
