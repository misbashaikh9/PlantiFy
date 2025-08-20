from django.urls import path
from . import views
from . import guided_views

app_name = 'plant_ai'

urlpatterns = [
    # Test endpoint
    path('test/', views.test_view, name='test'),
    
    # Main AI chat endpoint
    path('api/ai/chat/', views.AIChatView.as_view(), name='ai_chat'),
    
    # Plant care recommendations
    path('api/ai/plant-care/', views.PlantCareView.as_view(), name='plant_care'),
    
    # Fertilizer recommendations
    path('api/ai/fertilizer/', views.FertilizerRecommendationView.as_view(), name='fertilizer'),
    
    # Get available plants
    path('api/ai/plants/', views.AvailablePlantsView.as_view(), name='available_plants'),
    
    # Health check
    path('api/ai/health/', views.HealthCheckView.as_view(), name='health_check'),
    
    # Guided AI conversation endpoints
    path('api/ai/guided/chat/', guided_views.GuidedAIChatView.as_view(), name='guided_ai_chat'),
    path('api/ai/guided/start/', guided_views.GuidedAIStartView.as_view(), name='guided_ai_start'),
    path('api/ai/guided/select/', guided_views.GuidedAISelectCategoryView.as_view(), name='guided_ai_select'),
    path('api/ai/guided/reset/', guided_views.GuidedAIResetView.as_view(), name='guided_ai_reset'),
    path('api/ai/guided/status/', guided_views.GuidedAIStatusView.as_view(), name='guided_ai_status'),
    
    # ML system test endpoint
    path('api/ai/guided/ml-test/', guided_views.GuidedAIMLTestView.as_view(), name='guided_ai_ml_test'),
]
