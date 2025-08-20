#!/usr/bin/env python3
"""
Guided AI Views for Django
Provides structured conversation flow for plant care
"""

import json
import sys
import os
from django.http import JsonResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

# Add parent directory to path for imports
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from guided_ai_chat import guided_chat_with_ai, get_guided_ai

@method_decorator(csrf_exempt, name='dispatch')
class GuidedAIChatView(View):
    """Guided AI chat endpoint with structured conversation flow"""
    
    def post(self, request):
        try:
            data = json.loads(request.body)
            user_message = data.get('message', '')
            user_id = data.get('user_id', 'default_user')
            action = data.get('action', None)
            category = data.get('category', None)
            
            if not user_message and not action:
                return JsonResponse({
                    'success': False,
                    'error': 'Message or action is required'
                }, status=400)
            
            # Use guided AI chat function with proper parameters
            if action == "select_category":
                response = guided_chat_with_ai("", user_id, "select_category", category)
            else:
                response = guided_chat_with_ai(user_message, user_id, action, category)
            
            return JsonResponse({
                'success': True,
                'data': response
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'error': 'Invalid JSON'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)

@method_decorator(csrf_exempt, name='dispatch')
class GuidedAIStartView(View):
    """Start a new guided conversation"""
    
    def post(self, request):
        try:
            data = json.loads(request.body)
            user_id = data.get('user_id', 'default_user')
            
            # Start new conversation
            response = guided_chat_with_ai("", user_id, "start")
            
            return JsonResponse({
                'success': True,
                'data': response
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)

@method_decorator(csrf_exempt, name='dispatch')
class GuidedAIResetView(View):
    """Reset guided conversation"""
    
    def post(self, request):
        try:
            data = json.loads(request.body)
            user_id = data.get('user_id', 'default_user')
            
            # Reset conversation
            response = guided_chat_with_ai("", user_id, "reset")
            
            return JsonResponse({
                'success': True,
                'data': response
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)

@method_decorator(csrf_exempt, name='dispatch')
class GuidedAIStatusView(View):
    """Get conversation status"""
    
    def post(self, request):
        try:
            data = json.loads(request.body)
            user_id = data.get('user_id', 'default_user')
            
            # Get conversation status
            response = guided_chat_with_ai("", user_id, "status")
            
            return JsonResponse({
                'success': True,
                'data': response
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)

@method_decorator(csrf_exempt, name='dispatch')
class GuidedAISelectCategoryView(View):
    """Select a category in guided conversation"""
    
    def post(self, request):
        try:
            data = json.loads(request.body)
            user_id = data.get('user_id', 'default_user')
            category_id = data.get('category_id', '')
            
            if not category_id:
                return JsonResponse({
                    'success': False,
                    'error': 'Category ID is required'
                }, status=400)
            
            # Select category using guided AI
            response = guided_chat_with_ai("", user_id, "select_category", category_id)
            
            return JsonResponse({
                'success': True,
                'data': response
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)

@method_decorator(csrf_exempt, name='dispatch')
class GuidedAIMLTestView(View):
    """Test ML system through Django views"""
    
    def post(self, request):
        try:
            from guided_ai_chat import get_guided_ai
            
            # Get guided AI instance
            ai = get_guided_ai()
            
            # Test ML system
            test_input = {
                "plant_type": "Monstera",
                "environment": "indoor",
                "light_level": "bright_indirect",
                "humidity": "high",
                "temperature": "warm",
                "soil_type": "well_draining",
                "watering_frequency": "weekly",
                "fertilizer_frequency": "monthly"
            }
            
            ml_result = ai.ml_system.predict_care_success(test_input)
            
            return JsonResponse({
                'success': True,
                'ml_result': ml_result,
                'models_loaded': {
                    'care_recommender': ai.ml_system.care_recommender is not None,
                    'disease_diagnoser': ai.ml_system.disease_diagnoser is not None,
                    'fertilizer_predictor': ai.ml_system.fertilizer_predictor is not None
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)
