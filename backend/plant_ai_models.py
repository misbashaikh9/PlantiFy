#!/usr/bin/env python3
"""
Plant AI Models - Core Python ML for plant care and fertilizer recommendations
"""
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import pickle
import json
import os

class PlantCareAI:
    def __init__(self):
        self.model = None
        self.label_encoders = {}
        self.plant_data = self._create_plant_dataset()
        self._train_model()
    
    def _create_plant_dataset(self):
        """Create comprehensive plant care dataset"""
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
            ]
        }
        return pd.DataFrame(plant_data)
    
    def _train_model(self):
        """Train the plant care recommendation model"""
        # Prepare features
        X = self.plant_data.drop('plant_type', axis=1)
        y = self.plant_data['plant_type']
        
        # Encode categorical variables
        for column in X.columns:
            le = LabelEncoder()
            X[column] = le.fit_transform(X[column])
            self.label_encoders[column] = le
        
        # Train Random Forest
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X, y)
        
        print("✅ Plant Care AI Model trained successfully!")
    
    def get_plant_care(self, plant_type):
        """Get care recommendations for a specific plant"""
        if plant_type not in self.plant_data['plant_type'].values:
            return f"Sorry, I don't have care information for {plant_type}. Try asking about: {', '.join(self.plant_data['plant_type'][:5])}"
        
        plant_info = self.plant_data[self.plant_data['plant_type'] == plant_type].iloc[0]
        
        care_tips = f"""
🌱 **{plant_type} Care Guide**

💧 **Watering**: {plant_info['watering_frequency']}
☀️ **Sunlight**: {plant_info['sunlight']}
🌡️ **Temperature**: {plant_info['temperature']}
💨 **Humidity**: {plant_info['humidity']}
🌱 **Soil**: {plant_info['soil_type']}

**Pro Tips:**
• Water when top 1-2 inches of soil feels dry
• Avoid overwatering - this is the #1 killer of houseplants
• Rotate plant weekly for even growth
• Clean leaves monthly to remove dust
        """
        return care_tips.strip()
    
    def search_plants_by_condition(self, condition, value):
        """Find plants that match specific care conditions"""
        matching_plants = self.plant_data[self.plant_data[condition] == value]['plant_type'].tolist()
        
        if matching_plants:
            return f"Plants that prefer {condition}: {value}:\n" + "\n".join([f"• {plant}" for plant in matching_plants])
        else:
            return f"No plants found with {condition}: {value}"

class FertilizerAI:
    def __init__(self):
        self.model = None
        self.fertilizer_data = self._create_fertilizer_dataset()
        self._train_model()
    
    def _create_fertilizer_dataset(self):
        """Create fertilizer recommendation dataset"""
        # Create a proper dataset with consistent lengths
        plant_types = ['Monstera', 'Snake Plant', 'Pothos', 'Succulent', 'Cactus', 'Orchid']
        soil_ph_values = [6.0, 6.5, 6.0, 6.5, 7.0, 5.5]
        seasons = ['spring', 'summer', 'fall', 'winter']
        
        # Create combinations for each plant type
        data = []
        for i, plant_type in enumerate(plant_types):
            for season in seasons:
                data.append({
                    'plant_type': plant_type,
                    'soil_ph': soil_ph_values[i],
                    'season': season,
                    'fertilizer_type': self._get_fertilizer_type(plant_type),
                    'fertilizer_amount': self._get_fertilizer_amount(plant_type),
                    'frequency': self._get_frequency(plant_type, season)
                })
        
        return pd.DataFrame(data)
    
    def _get_fertilizer_type(self, plant_type):
        """Get fertilizer type for specific plant"""
        fertilizer_map = {
            'Monstera': 'NPK 20-20-20',
            'Snake Plant': 'NPK 10-10-10',
            'Pothos': 'NPK 20-20-20',
            'Succulent': 'NPK 5-10-10',
            'Cactus': 'NPK 5-10-10',
            'Orchid': 'Orchid 30-10-10'
        }
        return fertilizer_map.get(plant_type, 'NPK 10-10-10')
    
    def _get_fertilizer_amount(self, plant_type):
        """Get fertilizer amount for specific plant"""
        amount_map = {
            'Monstera': 10,
            'Snake Plant': 8,
            'Pothos': 10,
            'Succulent': 5,
            'Cactus': 5,
            'Orchid': 15
        }
        return amount_map.get(plant_type, 10)
    
    def _get_frequency(self, plant_type, season):
        """Get fertilizer frequency based on plant and season"""
        if plant_type in ['Succulent', 'Cactus']:
            return 'quarterly'
        elif plant_type == 'Orchid':
            return 'weekly'
        else:
            return 'monthly'
    
    def _train_model(self):
        """Train the fertilizer recommendation model"""
        # Prepare features - use .copy() to avoid pandas warnings
        X = self.fertilizer_data[['plant_type', 'soil_ph', 'season']].copy()
        y = self.fertilizer_data[['fertilizer_type', 'fertilizer_amount', 'frequency']].copy()
        
        # Encode categorical variables
        le_plant = LabelEncoder()
        le_season = LabelEncoder()
        
        X.loc[:, 'plant_type'] = le_plant.fit_transform(X['plant_type'])
        X.loc[:, 'season'] = le_season.fit_transform(X['season'])
        
        self.label_encoders = {
            'plant_type': le_plant,
            'season': le_season
        }
        
        # Train Random Forest for each target
        self.models = {}
        
        # For fertilizer_type and frequency (categorical), use RandomForestClassifier
        # For fertilizer_amount (numerical), use RandomForestRegressor
        for target in y.columns:
            if target in ['fertilizer_type', 'frequency']:
                # Categorical target - use classifier
                le_target = LabelEncoder()
                y_encoded = le_target.fit_transform(y[target])
                model = RandomForestClassifier(n_estimators=50, random_state=42)
                model.fit(X, y_encoded)
                self.models[target] = {'model': model, 'encoder': le_target}
            else:
                # Numerical target - use regressor
                model = RandomForestRegressor(n_estimators=50, random_state=42)
                model.fit(X, y[target])
                self.models[target] = {'model': model, 'encoder': None}
        
        print("✅ Fertilizer AI Model trained successfully!")
    
    def get_fertilizer_recommendation(self, plant_type, soil_ph=6.5, season='spring'):
        """Get fertilizer recommendations"""
        if plant_type not in self.fertilizer_data['plant_type'].values:
            return f"Sorry, I don't have fertilizer info for {plant_type}."
        
        # Prepare input
        plant_encoded = self.label_encoders['plant_type'].transform([plant_type])[0]
        season_encoded = self.label_encoders['season'].transform([season])[0]
        
        X_input = np.array([[plant_encoded, soil_ph, season_encoded]])
        
        # Get predictions
        fertilizer_type_pred = self.models['fertilizer_type']['model'].predict(X_input)[0]
        fertilizer_type = self.models['fertilizer_type']['encoder'].inverse_transform([fertilizer_type_pred])[0]
        
        amount = self.models['fertilizer_amount']['model'].predict(X_input)[0]
        
        frequency_pred = self.models['frequency']['model'].predict(X_input)[0]
        frequency = self.models['frequency']['encoder'].inverse_transform([frequency_pred])[0]
        
        recommendation = f"""
🌱 **Fertilizer Recommendation for {plant_type}**

🌿 **Fertilizer Type**: {fertilizer_type}
📏 **Amount**: {amount:.0f} grams per gallon of water
⏰ **Frequency**: {frequency}
🌡️ **Soil pH**: {soil_ph} (optimal range)
🌤️ **Season**: {season}

**Application Tips:**
• Dilute fertilizer in water before applying
• Apply to moist soil, never dry soil
• Reduce frequency in winter months
• Always follow package instructions
        """
        return recommendation.strip()

# Initialize AI models - but don't create them at import time
plant_ai = None
fertilizer_ai = None

def get_plant_ai():
    """Get or create PlantCareAI instance"""
    global plant_ai
    if plant_ai is None:
        plant_ai = PlantCareAI()
    return plant_ai

def get_fertilizer_ai():
    """Get or create FertilizerAI instance"""
    global fertilizer_ai
    if fertilizer_ai is None:
        fertilizer_ai = FertilizerAI()
    return fertilizer_ai

def chat_with_ai(user_message):
    """Main AI chat function"""
    # Get AI instances when needed
    plant_ai_instance = get_plant_ai()
    fertilizer_ai_instance = get_fertilizer_ai()
    
    user_message = user_message.lower()
    
    # Plant care queries
    if any(word in user_message for word in ['care', 'water', 'sunlight', 'temperature', 'humidity']):
        for plant in plant_ai_instance.plant_data['plant_type']:
            if plant.lower() in user_message:
                return plant_ai_instance.get_plant_care(plant)
        return "I can help with plant care! Please specify a plant type (e.g., 'How do I care for my Monstera?')"
    
    # Fertilizer queries
    elif any(word in user_message for word in ['fertilizer', 'feed', 'nutrient', 'soil']):
        for plant in fertilizer_ai_instance.fertilizer_data['plant_type']:
            if plant.lower() in user_message:
                return fertilizer_ai_instance.get_fertilizer_recommendation(plant, 6.5, 'spring')
        return "I can help with fertilizer recommendations! Please specify a plant type (e.g., 'What fertilizer for my Monstera?')"
    
    # General queries
    elif any(word in user_message for word in ['hello', 'hi', 'help']):
        return """
🌱 **Plant AI Assistant**

I can help you with:
• Plant care recommendations
• Fertilizer advice
• Growing tips

Try asking:
• "How do I care for my Monstera?"
• "What fertilizer for my Snake Plant?"
• "Help with my Pothos care"
        """.strip()
    
    else:
        return "I'm here to help with plant care and fertilizer questions! Try asking about a specific plant or care topic."

if __name__ == "__main__":
    # Test the AI
    print("🌱 Plant AI Chat Bot")
    print("=" * 40)
    
    test_questions = [
        "How do I care for my Monstera?",
        "What fertilizer for my Snake Plant?",
        "Hello, can you help me?"
    ]
    
    for question in test_questions:
        print(f"\n🤔 You: {question}")
        print(f"🤖 AI: {chat_with_ai(question)}")
        print("-" * 40)
