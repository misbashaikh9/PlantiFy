#!/usr/bin/env python3
"""
Simple test file to debug enhanced AI import issues
"""

print("Starting test...")

try:
    print("1. Testing basic imports...")
    import pandas as pd
    print("   ✅ Pandas imported successfully")
    
    import numpy as np
    print("   ✅ Numpy imported successfully")
    
    from sklearn.ensemble import RandomForestClassifier
    print("   ✅ Scikit-learn imported successfully")
    
    print("2. Testing enhanced AI import...")
    from enhanced_plant_ai import get_enhanced_plant_ai
    print("   ✅ Enhanced AI imported successfully")
    
    print("3. Testing enhanced AI functionality...")
    ai = get_enhanced_plant_ai()
    print("   ✅ Enhanced AI instance created successfully")
    
    print("4. Testing plant data access...")
    plants = list(ai.plant_data['plant_type'].unique())
    print(f"   ✅ Found {len(plants)} plants: {plants[:3]}...")
    
    print("5. Testing enhanced plant care...")
    response = ai.get_enhanced_plant_care("Monstera", "friendly")
    print("   ✅ Enhanced plant care working")
    print(f"   Response length: {len(response)} characters")
    
    print("\n🎉 All tests passed! Enhanced AI is working correctly!")
    
except Exception as e:
    print(f"\n❌ Error occurred: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()


