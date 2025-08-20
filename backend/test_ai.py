#!/usr/bin/env python3
"""
Test script for Plant AI Models
Run this to verify everything works before starting the API
"""
from plant_ai_models import chat_with_ai, plant_ai, fertilizer_ai

def test_plant_care():
    """Test plant care recommendations"""
    print("🧪 Testing Plant Care AI...")
    print("=" * 50)
    
    test_plants = ["Monstera", "Snake Plant", "Pothos"]
    
    for plant in test_plants:
        print(f"\n🌱 Testing: {plant}")
        care_info = plant_ai.get_plant_care(plant)
        print(care_info)
        print("-" * 30)

def test_fertilizer():
    """Test fertilizer recommendations"""
    print("\n🧪 Testing Fertilizer AI...")
    print("=" * 50)
    
    test_cases = [
        ("Monstera", 6.0, "spring"),
        ("Snake Plant", 6.5, "summer"),
        ("Succulent", 7.0, "fall")
    ]
    
    for plant, ph, season in test_cases:
        print(f"\n🌿 Testing: {plant} (pH: {ph}, Season: {season})")
        fertilizer_info = fertilizer_ai.get_fertilizer_recommendation(plant, ph, season)
        print(fertilizer_info)
        print("-" * 30)

def test_chat():
    """Test AI chat functionality"""
    print("\n🧪 Testing AI Chat...")
    print("=" * 50)
    
    test_messages = [
        "How do I care for my Monstera?",
        "What fertilizer for my Snake Plant?",
        "Hello, can you help me?",
        "I have a Pothos plant, what should I do?",
        "What's the best soil for succulents?"
    ]
    
    for message in test_messages:
        print(f"\n🤔 You: {message}")
        response = chat_with_ai(message)
        print(f"🤖 AI: {response}")
        print("-" * 30)

def main():
    """Run all tests"""
    print("🚀 Plant AI Models Test Suite")
    print("=" * 60)
    
    try:
        # Test individual components
        test_plant_care()
        test_fertilizer()
        test_chat()
        
        print("\n✅ All tests passed! AI models are working correctly!")
        print("🚀 You can now start the Flask API with: python ai_api.py")
        
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()



