#!/usr/bin/env python3
"""
Simple test script to verify Django backend is working
Run this from the project root directory
"""

import requests
import json

# Test configuration
BASE_URL = "http://localhost:8000"
API_BASE = f"{BASE_URL}/plant_store/api"

def test_backend_health():
    """Test if Django server is running"""
    try:
        response = requests.get(f"{BASE_URL}/admin/")
        if response.status_code == 200:
            print("✅ Django server is running")
            return True
        else:
            print(f"❌ Django server responded with status: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to Django server. Is it running?")
        print("   Run: cd backend && python manage.py runserver")
        return False

def test_api_endpoints():
    """Test if API endpoints are accessible"""
    endpoints = [
        ("/categories/", "GET"),
        ("/products/", "GET"),
        ("/register/", "POST"),
        ("/login/", "POST"),
    ]
    
    print("\n🔌 Testing API endpoints...")
    
    for endpoint, method in endpoints:
        try:
            if method == "GET":
                response = requests.get(f"{API_BASE}{endpoint}")
            else:
                response = requests.get(f"{API_BASE}{endpoint}")
            
            if response.status_code in [200, 401, 405]:  # 401/405 are expected for some endpoints
                print(f"✅ {method} {endpoint} - Status: {response.status_code}")
            else:
                print(f"❌ {method} {endpoint} - Unexpected status: {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ {method} {endpoint} - Error: {e}")

def test_user_registration():
    """Test user registration endpoint"""
    print("\n👤 Testing user registration...")
    
    import random
    random_num = random.randint(1000, 9999)
    
    test_user = {
        "username": f"testuser{random_num}",
        "email": f"test{random_num}@example.com",
        "password": "TestPass123"
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/register/",
            json=test_user,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 201:
            print("✅ User registration successful")
            print(f"   Username: {test_user['username']}")
            print(f"   Email: {test_user['email']}")
            return True
        else:
            print(f"❌ User registration failed - Status: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ User registration error: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Testing PlantiFy Backend Integration")
    print("=" * 50)
    
    # Test 1: Backend health
    if not test_backend_health():
        return
    
    # Test 2: API endpoints
    test_api_endpoints()
    
    # Test 3: User registration
    test_user_registration()
    
    print("\n" + "=" * 50)
    print("🎯 Backend testing complete!")
    print("\nNext steps:")
    print("1. Start frontend: cd frontend && npm run dev")
    print("2. Test full integration in browser")
    print("3. Check Django admin: http://localhost:8000/admin")

if __name__ == "__main__":
    main()
