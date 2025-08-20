from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from django.views import View
import json
import sys
import os

# Global variables for ML models - will be loaded when first needed
plant_ai = None
fertilizer_ai = None
chat_with_ai = None

def load_ml_models():
    """Load ML models when first needed"""
    global plant_ai, fertilizer_ai, chat_with_ai, get_plant_ai, get_fertilizer_ai
    
    if plant_ai is None:  # Only load once
        try:
            # Get the correct path to plant_ai_models.py
            current_dir = os.path.dirname(os.path.abspath(__file__))
            parent_dir = os.path.dirname(current_dir)
            if parent_dir not in sys.path:
                sys.path.insert(0, parent_dir)
            
            from plant_ai_models import chat_with_ai, get_plant_ai, get_fertilizer_ai
            print("✅ ML models loaded successfully!")
        except ImportError as e:
            print(f"Error importing ML models: {e}")
            # Fallback functions if ML models fail to import
            def chat_with_ai(message):
                return {"error": "ML models not available", "message": message}
            
            plant_ai = None
            fertilizer_ai = None

def test_view(request):
    """Simple test view to verify URL routing"""
    return JsonResponse({'message': 'AI endpoints are working!', 'status': 'success'})

@method_decorator(csrf_exempt, name='dispatch')
class AIChatView(View):
    """Main AI chat endpoint that routes user messages"""
    
    def post(self, request):
        try:
            # Load ML models if not already loaded
            load_ml_models()
            
            data = json.loads(request.body)
            user_message = data.get('message', '')
            user_style = data.get('style', 'friendly')  # New: user can choose response style
            user_id = data.get('user_id', None)  # New: for conversation history
            
            if not user_message:
                return JsonResponse({'error': 'Message is required'}, status=400)
            
            # Use our core Python ML function
            response = chat_with_ai(user_message)
            return JsonResponse({
                'success': True,
                'data': response
            })
            
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

@method_decorator(csrf_exempt, name='dispatch')
class PlantCareView(View):
    """Plant care recommendation endpoint"""
    
    def post(self, request):
        try:
            # Load ML models if not already loaded
            load_ml_models()
            
            data = json.loads(request.body)
            plant_name = data.get('plant_name', '')
            condition = data.get('condition', '')
            style = data.get('style', 'friendly')
            
            if not plant_name:
                return JsonResponse({'error': 'Plant name is required'}, status=400)
            
            # Get plant AI instance
            plant_ai_instance = get_plant_ai()
            
            if not plant_ai_instance:
                return JsonResponse({'error': 'Plant AI model not available'}, status=500)
            
            # Use our core Python ML function
            response = plant_ai_instance.get_plant_care(plant_name)
            return JsonResponse({
                'success': True,
                'data': response
            })
            
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

@method_decorator(csrf_exempt, name='dispatch')
class FertilizerRecommendationView(View):
    """Fertilizer recommendation endpoint"""
    
    def post(self, request):
        try:
            # Load ML models if not already loaded
            load_ml_models()
            
            data = json.loads(request.body)
            soil_type = data.get('soil_type', '')
            plant_type = data.get('plant_type', '')
            season = data.get('season', '')
            
            if not all([soil_type, plant_type, season]):
                return JsonResponse({'error': 'All fields are required'}, status=400)
            
            # Get fertilizer AI instance
            fertilizer_ai_instance = get_fertilizer_ai()
            
            if not fertilizer_ai_instance:
                return JsonResponse({'error': 'Fertilizer AI model not available'}, status=500)
            
            # Convert soil_type to soil_ph and use our core Python ML function
            soil_ph_map = {
                'well-draining': 6.5,
                'moisture-retaining': 6.0,
                'sandy': 7.0,
                'loamy': 6.5,
                'clay': 7.5
            }
            soil_ph = soil_ph_map.get(soil_type, 6.5)
            response = fertilizer_ai_instance.get_fertilizer_recommendation(plant_type, soil_ph, season)
            return JsonResponse({
                'success': True,
                'data': response
            })
            
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

@method_decorator(csrf_exempt, name='dispatch')
class AvailablePlantsView(View):
    """Get list of available plants for recommendations"""
    
    def get(self, request):
        try:
            # Load ML models if not already loaded
            load_ml_models()
            
            # Get plant AI instance
            plant_ai_instance = get_plant_ai()
            
            if not plant_ai_instance:
                return JsonResponse({'error': 'Plant AI model not available'}, status=500)
            
            # Get available plants from our core Python ML model
            plants = list(plant_ai_instance.plant_data['plant_type'].unique())
            return JsonResponse({
                'success': True,
                'data': {'plants': plants}
            })
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

@method_decorator(csrf_exempt, name='dispatch')
class HealthCheckView(View):
    """Health check endpoint for AI services"""
    
    def get(self, request):
        try:
            # Load ML models if not already loaded
            load_ml_models()
            
            # Check if models can be loaded
            try:
                plant_ai_instance = get_plant_ai()
                fertilizer_ai_instance = get_fertilizer_ai()
                
                status = {
                    'status': 'healthy',
                    'plant_ai_available': plant_ai_instance is not None,
                    'fertilizer_ai_available': fertilizer_ai_instance is not None,
                    'message': 'AI services are running'
                }
            except Exception as e:
                status = {
                    'status': 'unhealthy',
                    'plant_ai_available': False,
                    'fertilizer_ai_available': False,
                    'error': str(e),
                    'message': 'AI services failed to load'
                }
            
            return JsonResponse({
                'success': status['status'] == 'healthy',
                'data': status
            })
            
        except Exception as e:
            return JsonResponse({'status': 'unhealthy', 'error': str(e)}, status=500)
