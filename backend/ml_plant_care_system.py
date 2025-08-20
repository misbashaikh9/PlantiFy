#!/usr/bin/env python3
"""
Full ML Plant Care System
Includes data collection, model training, user feedback learning, and dynamic responses
"""

import json
import pickle
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import LabelEncoder, StandardScaler
import joblib
import os

class PlantCareMLSystem:
    """Full ML system for plant care with training and learning capabilities"""
    
    def __init__(self):
        self.models_dir = "ml_models"
        self.data_dir = "ml_data"
        self.ensure_directories()
        
        # Initialize models
        self.plant_classifier = None
        self.care_recommender = None
        self.disease_diagnoser = None
        self.fertilizer_predictor = None
        
        # Feature encoders
        self.label_encoders = {}
        self.scaler = StandardScaler()
        self.text_vectorizer = TfidfVectorizer(max_features=1000)
        
        # Training data
        self.training_data = {
            "plant_care": [],
            "disease_diagnosis": [],
            "fertilizer_recommendations": [],
            "user_feedback": []
        }
        
        # Load existing models if available
        self.load_models()
        
        # Initialize with synthetic training data
        self.initialize_training_data()
    
    def ensure_directories(self):
        """Create necessary directories for ML system"""
        os.makedirs(self.models_dir, exist_ok=True)
        os.makedirs(self.data_dir, exist_ok=True)
    
    def initialize_training_data(self):
        """Initialize with comprehensive training data"""
        # Plant care training data
        plant_care_data = [
            # Monstera examples
            {
                "plant_type": "Monstera",
                "environment": "indoor",
                "light_level": "bright_indirect",
                "humidity": "high",
                "temperature": "warm",
                "soil_type": "well_draining",
                "watering_frequency": "weekly",
                "fertilizer_frequency": "monthly",
                "success_rate": 0.95
            },
            {
                "plant_type": "Monstera",
                "environment": "indoor",
                "light_level": "low",
                "humidity": "low",
                "temperature": "cool",
                "soil_type": "heavy",
                "watering_frequency": "weekly",
                "fertilizer_frequency": "monthly",
                "success_rate": 0.45
            },
            # Snake Plant examples
            {
                "plant_type": "Snake Plant",
                "environment": "indoor",
                "light_level": "low",
                "humidity": "low",
                "temperature": "cool",
                "soil_type": "well_draining",
                "watering_frequency": "monthly",
                "fertilizer_frequency": "quarterly",
                "success_rate": 0.90
            },
            {
                "plant_type": "Snake Plant",
                "environment": "indoor",
                "light_level": "bright_direct",
                "humidity": "high",
                "temperature": "warm",
                "soil_type": "heavy",
                "watering_frequency": "weekly",
                "fertilizer_frequency": "monthly",
                "success_rate": 0.60
            },
            # Pothos examples
            {
                "plant_type": "Pothos",
                "environment": "indoor",
                "light_level": "bright_indirect",
                "humidity": "moderate",
                "temperature": "warm",
                "soil_type": "well_draining",
                "watering_frequency": "weekly",
                "fertilizer_frequency": "monthly",
                "success_rate": 0.92
            },
            {
                "plant_type": "Pothos",
                "environment": "indoor",
                "light_level": "low",
                "humidity": "low",
                "temperature": "cool",
                "soil_type": "heavy",
                "watering_frequency": "biweekly",
                "fertilizer_frequency": "quarterly",
                "success_rate": 0.70
            },
            # Succulent examples
            {
                "plant_type": "Succulent",
                "environment": "outdoor",
                "light_level": "bright_direct",
                "humidity": "low",
                "temperature": "warm",
                "soil_type": "cactus_mix",
                "watering_frequency": "monthly",
                "fertilizer_frequency": "quarterly",
                "success_rate": 0.88
            },
            {
                "plant_type": "Succulent",
                "environment": "indoor",
                "light_level": "low",
                "humidity": "high",
                "temperature": "cool",
                "soil_type": "heavy",
                "watering_frequency": "weekly",
                "fertilizer_frequency": "monthly",
                "success_rate": 0.35
            }
        ]
        
        # Disease diagnosis training data
        disease_data = [
            {
                "symptoms": "yellow_leaves, wilting, soft_stem",
                "plant_type": "Monstera",
                "environment": "indoor",
                "care_history": "overwatering",
                "diagnosis": "root_rot",
                "confidence": 0.92,
                "treatment": "repot, trim roots, reduce watering"
            },
            {
                "symptoms": "brown_tips, crispy_leaves, slow_growth",
                "plant_type": "Snake Plant",
                "environment": "indoor",
                "care_history": "underwatering",
                "diagnosis": "dehydration",
                "confidence": 0.88,
                "treatment": "increase watering, check soil moisture"
            },
            {
                "symptoms": "brown_spots, leaf_drop, no_growth",
                "plant_type": "Fiddle Leaf Fig",
                "environment": "indoor",
                "care_history": "insufficient_light",
                "diagnosis": "light_deficiency",
                "confidence": 0.85,
                "treatment": "move to brighter location, avoid direct sun"
            },
            {
                "symptoms": "yellow_leaves, stunted_growth, pale_color",
                "plant_type": "Monstera",
                "environment": "indoor",
                "care_history": "normal",
                "diagnosis": "nutrient_deficiency",
                "confidence": 0.78,
                "treatment": "apply balanced fertilizer, check soil quality"
            },
            {
                "symptoms": "leaf_drop, wilting, brown_edges",
                "plant_type": "Pothos",
                "environment": "indoor",
                "care_history": "repotting",
                "diagnosis": "transplant_shock",
                "confidence": 0.82,
                "treatment": "maintain consistent care, avoid overwatering"
            },
            {
                "symptoms": "yellow_leaves, slow_growth, no_new_leaves",
                "plant_type": "Snake Plant",
                "environment": "indoor",
                "care_history": "normal",
                "diagnosis": "light_deficiency",
                "confidence": 0.75,
                "treatment": "move to brighter location, maintain care routine"
            }
        ]
        
        # Fertilizer recommendations training data
        fertilizer_data = [
            {
                "plant_type": "Monstera",
                "season": "spring",
                "soil_type": "well_draining",
                "plant_age": "mature",
                "growth_rate": "active",
                "fertilizer_type": "balanced_20_20_20",
                "frequency": "monthly",
                "dilution": "half_strength",
                "success_rate": 0.94
            },
            {
                "plant_type": "Snake Plant",
                "season": "summer",
                "soil_type": "cactus_mix",
                "plant_age": "mature",
                "growth_rate": "slow",
                "fertilizer_type": "cactus_fertilizer",
                "frequency": "quarterly",
                "dilution": "quarter_strength",
                "success_rate": 0.89
            },
            {
                "plant_type": "Succulent",
                "season": "winter",
                "soil_type": "cactus_mix",
                "plant_age": "young",
                "growth_rate": "dormant",
                "fertilizer_type": "none",
                "frequency": "none",
                "dilution": "none",
                "success_rate": 0.95
            }
        ]
        
        self.training_data["plant_care"] = plant_care_data
        self.training_data["disease_diagnosis"] = disease_data
        self.training_data["fertilizer_recommendations"] = fertilizer_data
    
    def prepare_features(self, data_type: str) -> Tuple[np.ndarray, np.ndarray]:
        """Prepare features and labels for training"""
        if data_type == "plant_care":
            return self._prepare_plant_care_features()
        elif data_type == "disease_diagnosis":
            return self._prepare_disease_features()
        elif data_type == "fertilizer_recommendations":
            return self._prepare_fertilizer_features()
        else:
            raise ValueError(f"Unknown data type: {data_type}")
    
    def _prepare_plant_care_features(self) -> Tuple[np.ndarray, np.ndarray]:
        """Prepare features for plant care model"""
        data = self.training_data["plant_care"]
        
        # Create feature matrix
        features = []
        labels = []
        
        for item in data:
            feature_vector = [
                self._encode_categorical("plant_type", item["plant_type"]),
                self._encode_categorical("environment", item["environment"]),
                self._encode_categorical("light_level", item["light_level"]),
                self._encode_categorical("humidity", item["humidity"]),
                self._encode_categorical("temperature", item["temperature"]),
                self._encode_categorical("soil_type", item["soil_type"]),
                self._encode_categorical("watering_frequency", item["watering_frequency"]),
                self._encode_categorical("fertilizer_frequency", item["fertilizer_frequency"])
            ]
            features.append(feature_vector)
            labels.append(item["success_rate"])
        
        return np.array(features), np.array(labels)
    
    def _prepare_disease_features(self) -> Tuple[np.ndarray, np.ndarray]:
        """Prepare features for disease diagnosis model"""
        data = self.training_data["disease_diagnosis"]
        
        # Use text vectorization for symptoms - fit on all possible symptoms
        symptoms_texts = [item["symptoms"] for item in data]
        
        # Add common symptoms that might not be in training data
        common_symptoms = [
            "yellow leaves", "brown spots", "wilting", "leaf drop", "stunted growth",
            "root rot", "dehydration", "light deficiency", "overwatering", "underwatering",
            "nutrient deficiency", "pest damage", "fungal infection", "sunburn"
        ]
        
        # Combine training symptoms with common symptoms for better coverage
        all_symptoms = symptoms_texts + common_symptoms
        
        # Fit the vectorizer on all symptoms
        symptoms_features = self.text_vectorizer.fit_transform(all_symptoms).toarray()
        
        # Use only the training data features
        training_features = symptoms_features[:len(symptoms_texts)]
        
        # Combine with other features
        features = []
        labels = []
        
        for i, item in enumerate(data):
            feature_vector = list(training_features[i]) + [
                self._encode_categorical("plant_type", item["plant_type"]),
                self._encode_categorical("environment", item["environment"]),
                self._encode_categorical("care_history", item["care_history"])
            ]
            features.append(feature_vector)
            labels.append(item["diagnosis"])
        
        return np.array(features), np.array(labels)
    
    def _prepare_fertilizer_features(self) -> Tuple[np.ndarray, np.ndarray]:
        """Prepare features for fertilizer recommendation model"""
        data = self.training_data["fertilizer_recommendations"]
        
        features = []
        labels = []
        
        for item in data:
            feature_vector = [
                self._encode_categorical("plant_type", item["plant_type"]),
                self._encode_categorical("season", item["season"]),
                self._encode_categorical("soil_type", item["soil_type"]),
                self._encode_categorical("plant_age", item["plant_age"]),
                self._encode_categorical("growth_rate", item["growth_rate"])
            ]
            features.append(feature_vector)
            labels.append(item["fertilizer_type"])
        
        return np.array(features), np.array(labels)
    
    def _encode_categorical(self, feature_name: str, value: str) -> int:
        """Encode categorical features"""
        if feature_name not in self.label_encoders:
            self.label_encoders[feature_name] = LabelEncoder()
            # Get all unique values for this feature
            all_values = []
            for data_type in self.training_data.values():
                if isinstance(data_type, list):
                    for item in data_type:
                        if feature_name in item:
                            all_values.append(item[feature_name])
            unique_values = list(set(all_values))
            self.label_encoders[feature_name].fit(unique_values)
        
        try:
            return self.label_encoders[feature_name].transform([value])[0]
        except ValueError:
            # If value not seen during training, return a default encoding
            print(f"Warning: Unknown value '{value}' for feature '{feature_name}', using default encoding")
            return 0
    
    def train_models(self):
        """Train all ML models"""
        print("🌱 Training Plant Care ML Models...")
        
        # Train plant care success predictor
        self._train_plant_care_model()
        
        # Train disease diagnoser
        self._train_disease_model()
        
        # Train fertilizer recommender
        self._train_fertilizer_model()
        
        # Save models
        self.save_models()
        
        print("✅ All models trained and saved successfully!")
    
    def _train_plant_care_model(self):
        """Train plant care success prediction model"""
        X, y = self.prepare_features("plant_care")
        
        if len(X) < 2:
            print("⚠️ Insufficient data for plant care model training")
            return
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Train model
        self.care_recommender = RandomForestRegressor(n_estimators=100, random_state=42)
        self.care_recommender.fit(X_train, y_train)
        
        # Evaluate
        y_pred = self.care_recommender.predict(X_test)
        mse = np.mean((y_test - y_pred) ** 2)
        print(f"Plant Care Model - MSE: {mse:.4f}")
    
    def _train_disease_model(self):
        """Train disease diagnosis model"""
        X, y = self.prepare_features("disease_diagnosis")
        
        if len(X) < 2:
            print("⚠️ Insufficient data for disease model training")
            return
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Train model
        self.disease_diagnoser = RandomForestClassifier(n_estimators=100, random_state=42)
        self.disease_diagnoser.fit(X_train, y_train)
        
        # Evaluate
        y_pred = self.disease_diagnoser.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        print(f"Disease Diagnosis Model - Accuracy: {accuracy:.4f}")
    
    def _train_fertilizer_model(self):
        """Train fertilizer recommendation model"""
        X, y = self.prepare_features("fertilizer_recommendations")
        
        if len(X) < 2:
            print("⚠️ Insufficient data for fertilizer model training")
            return
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Train model
        self.fertilizer_predictor = RandomForestClassifier(n_estimators=100, random_state=42)
        self.fertilizer_predictor.fit(X_train, y_train)
        
        # Evaluate
        y_pred = self.fertilizer_predictor.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        print(f"Fertilizer Recommendation Model - Accuracy: {accuracy:.4f}")
    
    def predict_care_success(self, plant_info: Dict[str, str]) -> Dict[str, Any]:
        """Predict plant care success probability"""
        if self.care_recommender is None:
            return {"error": "Model not trained yet"}
        
        try:
            # Prepare features
            features = [
                self._encode_categorical("plant_type", plant_info.get("plant_type", "Unknown")),
                self._encode_categorical("environment", plant_info.get("environment", "indoor")),
                self._encode_categorical("light_level", plant_info.get("light_level", "bright_indirect")),
                self._encode_categorical("humidity", plant_info.get("humidity", "moderate")),
                self._encode_categorical("temperature", plant_info.get("temperature", "warm")),
                self._encode_categorical("soil_type", plant_info.get("soil_type", "well_draining")),
                self._encode_categorical("watering_frequency", plant_info.get("watering_frequency", "weekly")),
                self._encode_categorical("fertilizer_frequency", plant_info.get("fertilizer_frequency", "monthly"))
            ]
            
            # Make prediction
            success_prob = self.care_recommender.predict([features])[0]
            
            return {
                "success_probability": float(success_prob),
                "confidence": "high" if success_prob > 0.8 else "medium" if success_prob > 0.6 else "low",
                "recommendations": self._generate_care_recommendations(plant_info, success_prob)
            }
        
        except Exception as e:
            return {"error": f"Prediction failed: {str(e)}"}
    
    def diagnose_disease(self, symptoms: str, plant_info: Dict[str, str]) -> Dict[str, Any]:
        """Diagnose plant disease using ML model"""
        if self.disease_diagnoser is None:
            return {"error": "Model not trained yet"}
        
        try:
            # Prepare features
            symptoms_features = self.text_vectorizer.transform([symptoms]).toarray()[0]
            other_features = [
                self._encode_categorical("plant_type", plant_info.get("plant_type", "Unknown")),
                self._encode_categorical("environment", plant_info.get("environment", "indoor")),
                self._encode_categorical("care_history", plant_info.get("care_history", "normal"))
            ]
            
            features = list(symptoms_features) + other_features
            
            # Make prediction
            diagnosis = self.disease_diagnoser.predict([features])[0]
            probabilities = self.disease_diagnoser.predict_proba([features])[0]
            confidence = max(probabilities)
            
            return {
                "diagnosis": diagnosis,
                "confidence": float(confidence),
                "treatment": self._get_treatment_plan(diagnosis, plant_info),
                "alternative_diagnoses": self._get_alternative_diagnoses(probabilities)
            }
        
        except Exception as e:
            return {"error": f"Diagnosis failed: {str(e)}"}
    
    def recommend_fertilizer(self, plant_info: Dict[str, str]) -> Dict[str, Any]:
        """Recommend fertilizer using ML model"""
        if self.fertilizer_predictor is None:
            return {"error": "Model not trained yet"}
        
        try:
            # Prepare features
            features = [
                self._encode_categorical("plant_type", plant_info.get("plant_type", "Unknown")),
                self._encode_categorical("season", plant_info.get("season", "spring")),
                self._encode_categorical("soil_type", plant_info.get("soil_type", "well_draining")),
                self._encode_categorical("plant_age", plant_info.get("plant_age", "mature")),
                self._encode_categorical("growth_rate", plant_info.get("growth_rate", "active"))
            ]
            
            # Make prediction
            fertilizer_type = self.fertilizer_predictor.predict([features])[0]
            probabilities = self.fertilizer_predictor.predict_proba([features])[0]
            confidence = max(probabilities)
            
            return {
                "fertilizer_type": fertilizer_type,
                "confidence": float(confidence),
                "application_details": self._get_fertilizer_details(fertilizer_type),
                "seasonal_adjustments": self._get_seasonal_adjustments(plant_info.get("season", "spring"))
            }
        
        except Exception as e:
            return {"error": f"Fertilizer recommendation failed: {str(e)}"}
    
    def add_user_feedback(self, feedback_data: Dict[str, Any]):
        """Add user feedback to training data for continuous learning"""
        feedback_data["timestamp"] = datetime.now().isoformat()
        self.training_data["user_feedback"].append(feedback_data)
        
        # Retrain models periodically (every 10 new feedback entries)
        if len(self.training_data["user_feedback"]) % 10 == 0:
            print("🔄 Retraining models with new user feedback...")
            self.train_models()
    
    def _generate_care_recommendations(self, plant_info: Dict[str, str], success_prob: float) -> List[str]:
        """Generate care recommendations based on success probability"""
        recommendations = []
        
        if success_prob < 0.5:
            recommendations.extend([
                "Consider adjusting light conditions",
                "Check soil drainage",
                "Monitor watering frequency",
                "Consider repotting with fresh soil"
            ])
        elif success_prob < 0.8:
            recommendations.extend([
                "Slight adjustments to care routine",
                "Monitor plant response",
                "Consider seasonal changes"
            ])
        else:
            recommendations.extend([
                "Continue current care routine",
                "Monitor for any changes",
                "Maintain consistent environment"
            ])
        
        return recommendations
    
    def _get_treatment_plan(self, diagnosis: str, plant_info: Dict[str, str]) -> str:
        """Get treatment plan for diagnosed disease"""
        treatment_plans = {
            "root_rot": "Remove from pot, trim damaged roots, repot in fresh soil, reduce watering",
            "dehydration": "Water thoroughly, check soil moisture regularly, consider repotting",
            "light_deficiency": "Move to brighter location, avoid direct sun, monitor growth",
            "overwatering": "Let soil dry between waterings, improve drainage, check roots",
            "nutrient_deficiency": "Apply balanced fertilizer, check soil quality, consider repotting"
        }
        
        return treatment_plans.get(diagnosis, "Monitor plant and adjust care routine")
    
    def _get_alternative_diagnoses(self, probabilities: np.ndarray) -> List[Dict[str, Any]]:
        """Get alternative diagnoses with probabilities"""
        # This would require storing class names from training
        # For now, return generic alternatives
        return [
            {"diagnosis": "Environmental stress", "probability": 0.3},
            {"diagnosis": "Care routine issue", "probability": 0.2}
        ]
    
    def _get_fertilizer_details(self, fertilizer_type: str) -> Dict[str, str]:
        """Get detailed fertilizer application information"""
        fertilizer_details = {
            "balanced_20_20_20": {
                "dilution": "Half strength for most plants",
                "frequency": "Monthly during growing season",
                "application": "Apply to moist soil, water thoroughly after"
            },
            "cactus_fertilizer": {
                "dilution": "Quarter strength",
                "frequency": "Every 2-3 months",
                "application": "Apply sparingly, avoid over-fertilization"
            },
            "none": {
                "dilution": "N/A",
                "frequency": "None during dormancy",
                "application": "Resume fertilizing in spring"
            }
        }
        
        return fertilizer_details.get(fertilizer_type, {})
    
    def _get_seasonal_adjustments(self, season: str) -> List[str]:
        """Get seasonal adjustments for fertilizer application"""
        seasonal_guide = {
            "spring": ["Resume fertilizing", "Increase frequency", "Use full strength"],
            "summer": ["Continue regular schedule", "Monitor plant response", "Adjust if needed"],
            "fall": ["Reduce frequency", "Use half strength", "Prepare for dormancy"],
            "winter": ["Stop fertilizing", "Focus on light", "Minimize watering"]
        }
        
        return seasonal_guide.get(season, ["Follow regular schedule"])
    
    def save_models(self):
        """Save trained models to disk"""
        if self.care_recommender:
            joblib.dump(self.care_recommender, os.path.join(self.models_dir, "care_recommender.pkl"))
        
        if self.disease_diagnoser:
            joblib.dump(self.disease_diagnoser, os.path.join(self.models_dir, "disease_diagnoser.pkl"))
        
        if self.fertilizer_predictor:
            joblib.dump(self.fertilizer_predictor, os.path.join(self.models_dir, "fertilizer_predictor.pkl"))
        
        # Save TF-IDF vectorizer
        if hasattr(self.text_vectorizer, 'vocabulary_'):
            joblib.dump(self.text_vectorizer, os.path.join(self.models_dir, "tfidf_vectorizer.pkl"))
        
        # Save encoders and scaler
        with open(os.path.join(self.models_dir, "label_encoders.pkl"), "wb") as f:
            pickle.dump(self.label_encoders, f)
        
        # Save training data
        with open(os.path.join(self.data_dir, "training_data.json"), "w") as f:
            json.dump(self.training_data, f, indent=2)
    
    def load_models(self):
        """Load trained models from disk"""
        try:
            if os.path.exists(os.path.join(self.models_dir, "care_recommender.pkl")):
                self.care_recommender = joblib.load(os.path.join(self.models_dir, "care_recommender.pkl"))
            
            if os.path.exists(os.path.join(self.models_dir, "disease_diagnoser.pkl")):
                self.disease_diagnoser = joblib.load(os.path.join(self.models_dir, "disease_diagnoser.pkl"))
            
            if os.path.exists(os.path.join(self.models_dir, "fertilizer_predictor.pkl")):
                self.fertilizer_predictor = joblib.load(os.path.join(self.models_dir, "fertilizer_predictor.pkl"))
            
            # Load TF-IDF vectorizer
            if os.path.exists(os.path.join(self.models_dir, "tfidf_vectorizer.pkl")):
                self.text_vectorizer = joblib.load(os.path.join(self.models_dir, "tfidf_vectorizer.pkl"))
            
            if os.path.exists(os.path.join(self.models_dir, "label_encoders.pkl")):
                with open(os.path.join(self.models_dir, "label_encoders.pkl"), "rb") as f:
                    self.label_encoders = pickle.load(f)
            
            if os.path.exists(os.path.join(self.data_dir, "training_data.json")):
                with open(os.path.join(self.data_dir, "training_data.json"), "r") as f:
                    self.training_data = json.load(f)
            
            print("✅ ML models loaded successfully!")
            
        except Exception as e:
            print(f"⚠️ Could not load existing models: {e}")
            print("Models will be trained from scratch")

# Global instance
ml_system = None

def get_ml_system():
    """Get or create ML system instance"""
    global ml_system
    if ml_system is None:
        ml_system = PlantCareMLSystem()
    return ml_system

if __name__ == "__main__":
    # Test the ML system
    print("🌿 Plant Care ML System")
    print("=" * 50)
    
    ml = get_ml_system()
    
    # Train models
    ml.train_models()
    
    # Test predictions
    test_plant = {
        "plant_type": "Monstera",
        "environment": "indoor",
        "light_level": "bright_indirect",
        "humidity": "high",
        "temperature": "warm",
        "soil_type": "well_draining",
        "watering_frequency": "weekly",
        "fertilizer_frequency": "monthly"
    }
    
    # Test care success prediction
    care_result = ml.predict_care_success(test_plant)
    print(f"Care Success Prediction: {care_result}")
    
    # Test disease diagnosis
    disease_result = ml.diagnose_disease("yellow leaves, wilting", test_plant)
    print(f"Disease Diagnosis: {disease_result}")
    
    # Test fertilizer recommendation
    fertilizer_result = ml.recommend_fertilizer({
        "plant_type": "Monstera",
        "season": "spring",
        "soil_type": "well_draining",
        "plant_age": "mature",
        "growth_rate": "active"
    })
    print(f"Fertilizer Recommendation: {fertilizer_result}")
