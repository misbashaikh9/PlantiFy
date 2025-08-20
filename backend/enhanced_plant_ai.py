#!/usr/bin/env python3
"""
Enhanced Plant AI Models - Advanced AI with better chat, input validation, and prompt engineering
"""
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import re
import json
from datetime import datetime
from typing import Dict, List, Any, Optional

class EnhancedChatAI:
    """Advanced chat AI with prompt engineering and context awareness"""
    
    def __init__(self):
        self.prompt_templates = self._load_prompt_templates()
        self.conversation_history = {}
        self.user_preferences = {}
        self.response_styles = self._load_response_styles()
    
    def _load_prompt_templates(self):
        """Load advanced prompt templates for different intents"""
        return {
            'plant_care': """
            You are an expert plant care assistant with 20+ years of experience.
            
            Plant: {plant_name}
            User Question: {user_question}
            Context: {context}
            
            Provide comprehensive, helpful advice in a {tone} tone.
            Include: watering, sunlight, temperature, humidity, soil, and pro tips.
            Make it {detail_level} and {response_length}.
            Use {emoji_usage} emojis appropriately.
            
            Format your response clearly with sections and bullet points.
            """,
            
            'disease_diagnosis': """
            You are a plant pathologist and disease expert.
            
            Symptoms: {symptoms}
            Plant Type: {plant_type}
            User Experience: {user_experience}
            
            Diagnose the issue and provide treatment recommendations.
            Be specific about causes, symptoms, and solutions.
            Include prevention tips for the future.
            """,
            
            'repotting_advice': """
            You are a plant repotting specialist and horticulturist.
            
            Plant: {plant_type}
            Current Size: {current_size}
            Season: {season}
            Soil Condition: {soil_condition}
            
            Provide step-by-step repotting instructions.
            Include timing, pot size, soil mix, tools needed, and aftercare.
            Mention common mistakes to avoid.
            """,
            
            'general_help': """
            You are a friendly plant care expert.
            
            User Question: {user_question}
            User Experience Level: {user_experience}
            
            Provide helpful, encouraging advice.
            Suggest resources for learning more.
            Ask follow-up questions to better understand their needs.
            """
        }
    
    def _load_response_styles(self):
        """Define different response styles"""
        return {
            'expert': {
                'tone': 'professional',
                'detail_level': 'comprehensive',
                'emoji_usage': 'minimal',
                'response_length': 'detailed'
            },
            'friendly': {
                'tone': 'casual',
                'detail_level': 'moderate',
                'emoji_usage': 'moderate',
                'response_length': 'conversational'
            },
            'minimalist': {
                'tone': 'direct',
                'detail_level': 'essential',
                'emoji_usage': 'none',
                'response_length': 'concise'
            }
        }
    
    def process_user_message(self, user_message: str, user_id: str = None, 
                           context: Dict = None, style: str = 'friendly') -> Dict[str, Any]:
        """Process user message with enhanced features"""
        
        # Step 1: Input Processing
        processed_input = self._process_input(user_message)
        
        # Step 2: Intent Classification
        intent = self._classify_intent(processed_input)
        
        # Step 3: Context Extraction
        extracted_context = self._extract_context(processed_input, context)
        
        # Step 4: Generate Response
        ai_response = self._generate_enhanced_response(
            processed_input, intent, extracted_context, style
        )
        
        # Step 5: Format Response
        formatted_response = self._format_response(ai_response, style)
        
        # Step 6: Update Conversation History
        if user_id:
            self._update_conversation_history(user_id, processed_input, formatted_response)
        
        return {
            'success': True,
            'data': {
                'response': formatted_response,
                'intent': intent,
                'confidence': self._calculate_confidence(extracted_context),
                'suggestions': self._generate_suggestions(processed_input, intent),
                'context': extracted_context
            }
        }
    
    def _process_input(self, text: str) -> str:
        """Clean and process user input"""
        # Remove excessive caps, fix punctuation, normalize spacing
        text = text.strip()
        
        # Fix excessive caps (but preserve proper nouns)
        if text.isupper() and len(text) > 3:
            text = text.lower()
        
        # Fix multiple spaces
        text = re.sub(r'\s+', ' ', text)
        
        # Fix multiple punctuation
        text = re.sub(r'[!]{2,}', '!', text)
        text = re.sub(r'[?]{2,}', '?', text)
        
        # Auto-correct common plant care terms
        corrections = {
            'monstera deliciosa': 'Monstera',
            'snake plant': 'Snake Plant',
            'pothos': 'Pothos',
            'over watering': 'overwatering',
            'under watering': 'underwatering',
            'repot': 'repotting',
            'fertilize': 'fertilizing'
        }
        
        for mistake, correction in corrections.items():
            text = text.replace(mistake.lower(), correction)
        
        return text
    
    def _classify_intent(self, message: str) -> str:
        """Classify user intent from message"""
        message_lower = message.lower()
        
        # Plant care queries
        if any(word in message_lower for word in ['care', 'water', 'sunlight', 'temperature', 'humidity', 'soil']):
            return 'plant_care'
        
        # Disease queries
        elif any(word in message_lower for word in ['disease', 'sick', 'yellow', 'brown', 'spots', 'wilting', 'dying']):
            return 'disease_diagnosis'
        
        # Repotting queries
        elif any(word in message_lower for word in ['repot', 'pot', 'container', 'bigger', 'root bound']):
            return 'repotting_advice'
        
        # General help
        else:
            return 'general_help'
    
    def _extract_context(self, message: str, additional_context: Dict = None) -> Dict[str, Any]:
        """Extract context from user message"""
        context = additional_context or {}
        
        # Extract plant type
        plant_types = ['Monstera', 'Snake Plant', 'Pothos', 'Fiddle Leaf Fig', 'ZZ Plant',
                      'Peace Lily', 'Spider Plant', 'Aloe Vera', 'Succulent', 'Cactus',
                      'Philodendron', 'Calathea', 'Bird of Paradise', 'Orchid', 'Bamboo']
        
        found_plant = None
        for plant in plant_types:
            if plant.lower() in message.lower():
                found_plant = plant
                break
        
        # Extract urgency level
        urgency_words = ['help', 'urgent', 'emergency', 'dying', 'quick', 'asap']
        urgency_level = 'normal'
        if any(word in message.lower() for word in urgency_words):
            urgency_level = 'high'
        
        # Extract user experience level
        experience_indicators = {
            'beginner': ['first time', 'new', 'beginner', 'started'],
            'intermediate': ['tried', 'before', 'some experience'],
            'expert': ['expert', 'advanced', 'years', 'professional']
        }
        
        user_experience = 'beginner'
        for level, indicators in experience_indicators.items():
            if any(indicator in message.lower() for indicator in indicators):
                user_experience = level
                break
        
        return {
            'plant_type': found_plant,
            'urgency_level': urgency_level,
            'user_experience': user_experience,
            'message_length': len(message),
            'has_question_mark': '?' in message,
            'has_exclamation': '!' in message,
            **context
        }
    
    def _generate_enhanced_response(self, message: str, intent: str, 
                                  context: Dict, style: str) -> str:
        """Generate AI response using enhanced prompts"""
        
        # Get response style preferences
        style_config = self.response_styles.get(style, self.response_styles['friendly'])
        
        # Select appropriate prompt template
        template = self.prompt_templates.get(intent, self.prompt_templates['general_help'])
        
        # Fill template with context
        formatted_prompt = template.format(
            plant_name=context.get('plant_type', 'your plant'),
            user_question=message,
            context=json.dumps(context),
            tone=style_config['tone'],
            detail_level=style_config['detail_level'],
            response_length=style_config['response_length'],
            emoji_usage=style_config['emoji_usage'],
            symptoms=context.get('symptoms', ''),
            current_size=context.get('size', ''),
            season=context.get('season', 'current season'),
            soil_condition=context.get('soil_condition', ''),
            user_experience=context.get('user_experience', 'beginner')
        )
        
        # For now, use the existing AI logic but with enhanced prompts
        # In the future, you could integrate with GPT-3, BERT, or other advanced models
        
        if intent == 'plant_care' and context.get('plant_type'):
            return self._get_plant_care_response(context['plant_type'], style_config)
        elif intent == 'disease_diagnosis':
            return self._get_disease_response(context, style_config)
        elif intent == 'repotting_advice':
            return self._get_repotting_response(context, style_config)
        else:
            return self._get_general_response(message, context, style_config)
    
    def _get_plant_care_response(self, plant_type: str, style: Dict) -> str:
        """Get enhanced plant care response"""
        # This would integrate with your existing PlantCareAI
        # For now, return enhanced template response
        
        if style['tone'] == 'professional':
            return f"""
🌱 **{plant_type} Care Guide - Professional Analysis**

Based on botanical research and horticultural best practices:

**Environmental Requirements:**
• Watering: Monitor soil moisture levels
• Sunlight: Provide appropriate light conditions
• Temperature: Maintain optimal temperature range
• Humidity: Ensure adequate humidity levels
• Soil: Use well-draining potting medium

**Care Recommendations:**
• Implement regular watering schedule
• Monitor for signs of stress or disease
• Adjust care based on seasonal changes
• Maintain proper air circulation

**Professional Tips:**
• Document care routine for consistency
• Consider environmental monitoring tools
• Regular health assessments recommended
            """.strip()
        
        elif style['tone'] == 'casual':
            return f"""
Hey there! 🌿 Let me help you with your {plant_type}!

**Here's what your plant needs:**
💧 **Watering**: Keep the soil moist but not soggy
☀️ **Light**: Bright, indirect sunlight works best
🌡️ **Temperature**: Room temperature is perfect
💨 **Humidity**: They love a bit of humidity
🌱 **Soil**: Well-draining potting mix

**Pro Tips:**
• Water when the top inch feels dry
• Rotate your plant weekly for even growth
• Clean those beautiful leaves monthly
• They're pretty forgiving, so don't stress too much!

Need help with anything specific? 😊
            """.strip()
        
        else:  # minimalist
            return f"""
{plant_type} Care:
Water: When soil feels dry
Light: Bright indirect
Temp: 65-75°F
Soil: Well-draining
            """.strip()
    
    def _get_disease_response(self, context: Dict, style: Dict) -> str:
        """Get disease diagnosis response"""
        return f"""
🔍 **Plant Health Diagnosis**

Based on your description, here are potential issues and solutions:

**Common Problems:**
• Yellow leaves: Usually overwatering or nutrient deficiency
• Brown spots: Could be sunburn, disease, or pests
• Wilting: Check soil moisture and root health
• Stunted growth: May need repotting or fertilizer

**Immediate Actions:**
1. Check soil moisture
2. Inspect for pests
3. Assess light conditions
4. Review watering schedule

**Prevention:**
• Regular health checks
• Proper watering habits
• Good air circulation
• Clean growing environment

Would you like me to help diagnose a specific symptom?
            """.strip()
    
    def _get_repotting_response(self, context: Dict, style: Dict) -> str:
        """Get repotting advice response"""
        return f"""
🌱 **Repotting Guide**

**When to Repot:**
• Roots coming out of drainage holes
• Plant looks top-heavy
• Soil dries out too quickly
• No new growth for months

**Step-by-Step Process:**
1. Choose new pot (1-2 inches larger)
2. Prepare fresh potting mix
3. Gently remove plant from old pot
4. Loosen root ball slightly
5. Place in new pot and fill with soil
6. Water thoroughly

**Best Time:** Spring or early summer
**Aftercare:** Keep in shade for a few days, then resume normal care

Need help with a specific plant type?
            """.strip()
    
    def _get_general_response(self, message: str, context: Dict, style: Dict) -> str:
        """Get general help response"""
        return f"""
🌿 **Plant Care Help**

I'm here to help with all your plant questions! 

**What I can help with:**
• Plant care advice
• Disease diagnosis
• Repotting guidance
• Fertilizer recommendations
• Growing tips

**Try asking:**
• "How do I care for my [plant name]?"
• "What's wrong with my plant's leaves?"
• "When should I repot my plant?"
• "Best plants for low light?"

What would you like to know about today?
            """.strip()
    
    def _format_response(self, response: str, style: str) -> str:
        """Format response based on user preferences"""
        # Apply formatting based on style
        if style['emoji_usage'] == 'none':
            # Remove emojis
            response = re.sub(r'[^\w\s\-\*\.,!?]', '', response)
        
        return response
    
    def _calculate_confidence(self, context: Dict) -> float:
        """Calculate confidence in the response"""
        confidence = 0.5  # Base confidence
        
        if context.get('plant_type'):
            confidence += 0.3
        
        if context.get('user_experience') == 'expert':
            confidence += 0.1
        
        if context.get('urgency_level') == 'high':
            confidence += 0.1
        
        return min(confidence, 1.0)
    
    def _generate_suggestions(self, message: str, intent: str) -> List[str]:
        """Generate helpful suggestions for user"""
        suggestions = []
        
        if intent == 'plant_care':
            suggestions = [
                "Try asking about specific care topics like watering or light",
                "Include your plant type for more personalized advice",
                "Mention any specific issues you're experiencing"
            ]
        elif intent == 'disease_diagnosis':
            suggestions = [
                "Describe the symptoms in detail",
                "Include when you first noticed the problem",
                "Mention any recent changes in care routine"
            ]
        
        return suggestions
    
    def _update_conversation_history(self, user_id: str, user_message: str, ai_response: str):
        """Update conversation history for context awareness"""
        if user_id not in self.conversation_history:
            self.conversation_history[user_id] = []
        
        self.conversation_history[user_id].append({
            'timestamp': datetime.now().isoformat(),
            'user_message': user_message,
            'ai_response': ai_response,
            'context': self._extract_context(user_message)
        })
        
        # Keep only last 10 messages
        if len(self.conversation_history[user_id]) > 10:
            self.conversation_history[user_id] = self.conversation_history[user_id][-10:]

# Enhanced Plant Care AI (keeping your existing ML models)
class EnhancedPlantCareAI:
    """Enhanced version of your existing PlantCareAI"""
    
    def __init__(self):
        # Keep your existing ML model
        self.model = None
        self.label_encoders = {}
        self.plant_data = self._create_plant_dataset()
        self._train_model()
        
        # Add enhanced features
        self.chat_ai = EnhancedChatAI()
    
    def _create_plant_dataset(self):
        """Enhanced plant dataset with more features"""
        plant_data = {
            'plant_type': [
                'Monstera', 'Snake Plant', 'Pothos', 'Fiddle Leaf Fig', 'ZZ Plant',
                'Peace Lily', 'Spider Plant', 'Aloe Vera', 'Succulent', 'Cactus',
                'Philodendron', 'Calathea', 'Bird of Paradise', 'Orchid', 'Bamboo'
            ],
            'watering_frequency': [
                'weekly', 'bi-weekly', 'monthly', 'when dry', 'minimal',
                'weekly', 'weekly', 'monthly', 'monthly', 'minimal',
                'weekly', 'weekly', 'weekly', 'weekly', 'weekly'
            ],
            'sunlight': [
                'indirect bright', 'low light', 'low light', 'bright indirect', 'low light',
                'low light', 'bright indirect', 'bright direct', 'bright direct', 'bright direct',
                'indirect bright', 'indirect bright', 'bright indirect', 'bright indirect', 'bright indirect'
            ],
            'temperature': [
                '65-80°F', '60-75°F', '60-75°F', '65-75°F', '65-75°F',
                '65-80°F', '60-75°F', '60-75°F', '60-80°F', '60-80°F',
                '65-80°F', '65-80°F', '65-80°F', '65-80°F', '65-80°F'
            ],
            'humidity': [
                'high', 'low', 'low', 'medium', 'low',
                'high', 'medium', 'low', 'low', 'low',
                'high', 'high', 'medium', 'high', 'medium'
            ],
            'soil_type': [
                'well-draining', 'well-draining', 'well-draining', 'well-draining', 'well-draining',
                'moisture-retaining', 'well-draining', 'sandy', 'sandy', 'sandy',
                'well-draining', 'moisture-retaining', 'well-draining', 'well-draining', 'well-draining'
            ],
            'difficulty_level': [
                'easy', 'very easy', 'very easy', 'moderate', 'very easy',
                'easy', 'easy', 'easy', 'easy', 'easy',
                'easy', 'moderate', 'moderate', 'moderate', 'easy'
            ],
            'growth_rate': [
                'fast', 'slow', 'fast', 'moderate', 'slow',
                'moderate', 'fast', 'slow', 'slow', 'slow',
                'fast', 'moderate', 'fast', 'slow', 'fast'
            ]
        }
        return pd.DataFrame(plant_data)
    
    def _train_model(self):
        """Train the enhanced plant care model"""
        # Your existing training code
        X = self.plant_data.drop('plant_type', axis=1)
        y = self.plant_data['plant_type']
        
        for column in X.columns:
            le = LabelEncoder()
            X[column] = le.fit_transform(X[column])
            self.label_encoders[column] = le
        
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X, y)
        
        print("✅ Enhanced Plant Care AI Model trained successfully!")
    
    def get_enhanced_plant_care(self, plant_type: str, user_style: str = 'friendly') -> str:
        """Get enhanced plant care with better formatting"""
        if plant_type not in self.plant_data['plant_type'].values:
            return f"Sorry, I don't have care information for {plant_type}. Try asking about: {', '.join(self.plant_data['plant_type'][:5])}"
        
        plant_info = self.plant_data[self.plant_data['plant_type'] == plant_type].iloc[0]
        
        if user_style == 'professional':
            return f"""
🌱 **{plant_type} - Comprehensive Care Guide**

**Environmental Requirements:**
• Watering Frequency: {plant_info['watering_frequency']}
• Light Conditions: {plant_info['sunlight']}
• Temperature Range: {plant_info['temperature']}
• Humidity Preference: {plant_info['humidity']}
• Soil Requirements: {plant_info['soil_type']}

**Growth Characteristics:**
• Difficulty Level: {plant_info['difficulty_level'].title()}
• Growth Rate: {plant_info['growth_rate'].title()}

**Care Protocol:**
• Implement consistent watering schedule based on soil moisture
• Monitor light exposure and adjust positioning as needed
• Maintain optimal temperature range for healthy growth
• Ensure appropriate humidity levels for species requirements
• Use recommended soil composition for optimal root health

**Professional Recommendations:**
• Regular health assessments and monitoring
• Document care routine for consistency
• Seasonal care adjustments as needed
• Preventive maintenance schedule
            """.strip()
        
        elif user_style == 'minimalist':
            return f"""
{plant_type}:
Water: {plant_info['watering_frequency']}
Light: {plant_info['sunlight']}
Temp: {plant_info['temperature']}
Humidity: {plant_info['humidity']}
Soil: {plant_info['soil_type']}
Difficulty: {plant_info['difficulty_level']}
            """.strip()
        
        else:  # friendly
            return f"""
🌱 **{plant_type} Care Guide**

💧 **Watering**: {plant_info['watering_frequency']}
☀️ **Sunlight**: {plant_info['sunlight']}
🌡️ **Temperature**: {plant_info['temperature']}
💨 **Humidity**: {plant_info['humidity']}
🌱 **Soil**: {plant_info['soil_type']}

**Plant Personality:**
• Difficulty: {plant_info['difficulty_level'].title()} to care for
• Growth: {plant_info['growth_rate'].title()} growing

**Pro Tips:**
• Water when top 1-2 inches of soil feels dry
• Avoid overwatering - this is the #1 killer of houseplants
• Rotate plant weekly for even growth
• Clean leaves monthly to remove dust

Need help with anything specific about your {plant_type}? 😊
            """.strip()

# Global instances
enhanced_chat_ai = None
enhanced_plant_ai = None

def get_enhanced_chat_ai():
    """Get or create EnhancedChatAI instance"""
    global enhanced_chat_ai
    if enhanced_chat_ai is None:
        enhanced_chat_ai = EnhancedChatAI()
    return enhanced_chat_ai

def get_enhanced_plant_ai():
    """Get or create EnhancedPlantCareAI instance"""
    global enhanced_plant_ai
    if enhanced_plant_ai is None:
        enhanced_plant_ai = EnhancedPlantCareAI()
    return enhanced_plant_ai

def enhanced_chat_with_ai(user_message: str, user_id: str = None, 
                         context: Dict = None, style: str = 'friendly') -> Dict[str, Any]:
    """Enhanced AI chat function with better features"""
    chat_ai = get_enhanced_chat_ai()
    return chat_ai.process_user_message(user_message, user_id, context, style)

if __name__ == "__main__":
    # Test the enhanced AI
    print("🌱 Enhanced Plant AI Chat Bot")
    print("=" * 50)
    
    test_messages = [
        "HOW DO I CARE FOR MY MONSTERA???",
        "What's wrong with my plant's leaves?",
        "When should I repot my plant?",
        "Hello, can you help me?"
    ]
    
    for message in test_messages:
        print(f"\n🤔 You: {message}")
        response = enhanced_chat_with_ai(message, style='friendly')
        print(f"🤖 AI: {response['data']['response']}")
        print(f"📊 Intent: {response['data']['intent']}")
        print(f"🎯 Confidence: {response['data']['confidence']:.2f}")
        print("-" * 50)


