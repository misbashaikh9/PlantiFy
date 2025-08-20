#!/usr/bin/env python3
"""
Script to train and initialize ML models for the Plant Care AI system
Run this script to set up the ML models before using the guided AI chat
"""

import sys
import os

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ml_plant_care_system import get_ml_system
from plant_knowledge_base import get_plant_knowledge_base

def main():
    """Main function to train ML models"""
    print("🌿 Plant Care ML System Training")
    print("=" * 50)
    
    try:
        # Initialize knowledge base
        print("📚 Loading Plant Knowledge Base...")
        kb = get_plant_knowledge_base()
        print(f"✅ Loaded {len(kb.get_all_plant_names())} plant types")
        
        # Initialize ML system
        print("🤖 Initializing ML System...")
        ml_system = get_ml_system()
        
        # Train models
        print("🚀 Training ML Models...")
        ml_system.train_models()
        
        # Test the system
        print("\n🧪 Testing ML System...")
        test_ml_system(ml_system)
        
        print("\n🎉 ML System Training Complete!")
        print("You can now use the guided AI chat with ML-powered responses!")
        
    except Exception as e:
        print(f"❌ Error during training: {e}")
        print("Please check that all dependencies are installed:")
        print("pip install -r ml_requirements.txt")
        return 1
    
    return 0

def test_ml_system(ml_system):
    """Test the trained ML system with sample inputs"""
    
    # Test 1: Plant Care Success Prediction
    print("\n1. Testing Plant Care Success Prediction...")
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
    
    care_result = ml_system.predict_care_success(test_plant)
    if "error" not in care_result:
        print(f"✅ Care Success: {care_result['success_probability']:.1%} confidence")
    else:
        print(f"❌ Care Prediction failed: {care_result['error']}")
    
    # Test 2: Disease Diagnosis
    print("\n2. Testing Disease Diagnosis...")
    disease_result = ml_system.diagnose_disease("yellow leaves, wilting", {
        "plant_type": "Monstera",
        "environment": "indoor",
        "care_history": "overwatering"
    })
    
    if "error" not in disease_result:
        print(f"✅ Disease Diagnosis: {disease_result['diagnosis']} ({disease_result['confidence']:.1%} confidence)")
    else:
        print(f"❌ Disease Diagnosis failed: {disease_result['error']}")
    
    # Test 3: Fertilizer Recommendation
    print("\n3. Testing Fertilizer Recommendation...")
    fertilizer_result = ml_system.recommend_fertilizer({
        "plant_type": "Monstera",
        "season": "spring",
        "soil_type": "well_draining",
        "plant_age": "mature",
        "growth_rate": "active"
    })
    
    if "error" not in fertilizer_result:
        print(f"✅ Fertilizer: {fertilizer_result['fertilizer_type']} ({fertilizer_result['confidence']:.1%} confidence)")
    else:
        print(f"❌ Fertilizer Recommendation failed: {fertilizer_result['error']}")

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
