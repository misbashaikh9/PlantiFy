#!/usr/bin/env python3
"""
Debug script to trace ML data flow and find N/A issue
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def debug_ml_system():
    print("🔍 Debugging ML System...")
    
    from ml_plant_care_system import get_ml_system
    ml_system = get_ml_system()
    
    # Test fertilizer recommendation directly
    print("\n🌿 Testing Fertilizer ML Directly...")
    test_input = {
        'plant_type': 'Monstera',
        'season': 'spring',
        'soil_type': 'well_draining',
        'plant_age': 'mature',
        'growth_rate': 'active'
    }
    
    result = ml_system.recommend_fertilizer(test_input)
    print(f"Raw ML Result: {result}")
    print(f"Type: {type(result)}")
    print(f"Keys: {list(result.keys()) if isinstance(result, dict) else 'Not a dict'}")
    print(f"Fertilizer Type: {result.get('fertilizer_type', 'N/A')}")
    print(f"Confidence: {result.get('confidence', 'N/A')}")
    
    # Check if values are actually N/A
    if result.get('fertilizer_type') == 'N/A' or result.get('confidence') == 'N/A':
        print("❌ ML system is returning N/A values!")
    else:
        print("✅ ML system has real values!")
    
    return result

def debug_guided_ai_flow():
    print("\n🤖 Debugging Guided AI Flow...")
    
    from guided_ai_chat import get_guided_ai
    ai = get_guided_ai()
    
    # Simulate complete fertilizer flow
    user_id = "debug_user_123"
    
    print("Starting conversation...")
    response1 = ai.start_conversation(user_id)
    print(f"1. Start: {response1.get('type')}")
    
    print("Selecting fertilizer category...")
    response2 = ai.select_category(user_id, "fertilizer")
    print(f"2. Category: {response2.get('type')}")
    
    print("Answering Q1 - Plant type...")
    response3 = ai.answer_question(user_id, "Monstera")
    print(f"3. Q1: {response3.get('type')}")
    
    print("Answering Q2 - Soil type...")
    response4 = ai.answer_question(user_id, "Well-draining mix")
    print(f"4. Q2: {response4.get('type')}")
    
    print("Answering Q3 - Season...")
    response5 = ai.answer_question(user_id, "Spring")
    print(f"5. Q3: {response5.get('type')}")
    
    print("Answering Q4 - Frequency...")
    response6 = ai.answer_question(user_id, "Monthly")
    print(f"6. Q4: {response6.get('type')}")
    
    # Check ML data in final response
    print(f"\n🎯 Final Response Analysis:")
    print(f"Type: {response6.get('type')}")
    print(f"Keys: {list(response6.keys())}")
    
    if 'ml_recommendation' in response6:
        ml_data = response6['ml_recommendation']
        print(f"\n✅ ML Recommendation Found!")
        print(f"  ML Data Type: {type(ml_data)}")
        print(f"  ML Data Keys: {list(ml_data.keys()) if isinstance(ml_data, dict) else 'Not a dict'}")
        print(f"  Fertilizer Type: {ml_data.get('fertilizer_type', 'N/A')}")
        print(f"  Confidence: {ml_data.get('confidence', 'N/A')}")
        
        # Check if ML data has real values
        if ml_data.get('fertilizer_type') == 'N/A' or ml_data.get('confidence') == 'N/A':
            print("❌ ML data contains N/A values!")
            print(f"Full ML data: {ml_data}")
        else:
            print("✅ ML data has real values!")
            
    else:
        print("❌ No ml_recommendation in response!")
        print(f"Available keys: {list(response6.keys())}")
    
    return response6

def debug_api_response():
    print("\n🌐 Testing API Response...")
    
    import requests
    
    try:
        base_url = "http://localhost:8000/plant_ai/api/ai/guided"
        user_id = "api_debug_user"
        
        print("Starting API conversation...")
        response = requests.post(f"{base_url}/start/", json={"user_id": user_id})
        print(f"1. Start: {response.status_code}")
        
        response = requests.post(f"{base_url}/select/", json={"user_id": user_id, "category_id": "fertilizer"})
        print(f"2. Category: {response.status_code}")
        
        response = requests.post(f"{base_url}/chat/", json={"message": "Monstera", "user_id": user_id})
        print(f"3. Q1: {response.status_code}")
        
        response = requests.post(f"{base_url}/chat/", json={"message": "Well-draining mix", "user_id": user_id})
        print(f"4. Q2: {response.status_code}")
        
        response = requests.post(f"{base_url}/chat/", json={"message": "Spring", "user_id": user_id})
        print(f"5. Q3: {response.status_code}")
        
        response = requests.post(f"{base_url}/chat/", json={"message": "Monthly", "user_id": user_id})
        print(f"6. Q4: {response.status_code}")
        
        data = response.json()
        result_data = data.get('data', {})
        
        print(f"\n📋 API Response Analysis:")
        print(f"Success: {data.get('success')}")
        print(f"Response Type: {result_data.get('type')}")
        print(f"Response Keys: {list(result_data.keys())}")
        
        if 'ml_recommendation' in result_data:
            ml_data = result_data['ml_recommendation']
            print(f"\n🎯 ML Data in API Response:")
            print(f"  ML Data Type: {type(ml_data)}")
            print(f"  ML Data Keys: {list(ml_data.keys()) if isinstance(ml_data, dict) else 'Not a dict'}")
            print(f"  Fertilizer Type: {ml_data.get('fertilizer_type', 'N/A')}")
            print(f"  Confidence: {ml_data.get('confidence', 'N/A')}")
            
            if ml_data.get('fertilizer_type') == 'N/A' or ml_data.get('confidence') == 'N/A':
                print("❌ API is returning N/A values!")
                print(f"Full ML data: {ml_data}")
            else:
                print("✅ API has real ML values!")
        else:
            print("❌ No ml_recommendation in API response!")
            
    except Exception as e:
        print(f"❌ API Test Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("🚀 Starting ML Data Flow Debug...")
    print("=" * 60)
    
    # Test 1: ML System directly
    ml_result = debug_ml_system()
    
    # Test 2: Guided AI directly
    guided_result = debug_guided_ai_flow()
    
    # Test 3: API endpoint
    debug_api_response()
    
    print("\n" + "=" * 60)
    print("🎯 DEBUG SUMMARY:")
    print(f"ML System: {'✅' if ml_result.get('confidence') != 'N/A' else '❌'}")
    print(f"Guided AI: {'✅' if guided_result.get('ml_recommendation', {}).get('confidence') != 'N/A' else '❌'}")
    
    print("\n🔍 Next Steps:")
    print("1. Check if ML models are properly loaded")
    print("2. Verify data mapping functions")
    print("3. Check API response structure")
    print("4. Verify frontend data handling")

