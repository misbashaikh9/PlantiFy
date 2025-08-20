#!/usr/bin/env python3
"""
Test script for PlantiFy email system
Run this to test if emails are working correctly
"""

import os
import sys
import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'plantify_backend.settings')
django.setup()

from plant_store.email_service import test_email_system, send_order_confirmation

def test_order_confirmation_email():
    """Test sending an order confirmation email"""
    print("🧪 Testing Order Confirmation Email...")
    
    # Test order data
    test_order = {
        'order_number': 'TEST-001',
        'order_date': 'December 15, 2024',
        'total_amount': '₹1,299.99',
        'payment_method': 'Credit Card',
        'shipping_address': '123 Test Street, Test City, Test State 12345, Test Country',
        'items': [
            {'name': 'Monstera Deliciosa', 'quantity': 1, 'price': '₹899.99', 'total': '₹899.99'},
            {'name': 'Snake Plant', 'quantity': 1, 'price': '₹399.99', 'total': '₹399.99'}
        ]
    }
    
    print(f"📧 Sending test order confirmation email...")
    print(f"📋 Order: {test_order['order_number']}")
    print(f"💰 Total: {test_order['total_amount']}")
    print(f"🏠 Address: {test_order['shipping_address']}")
    
    if send_order_confirmation(test_order, 'plantify.orders@gmail.com', 'Test Customer'):
        print("✅ Order confirmation email test successful!")
        return True
    else:
        print("❌ Order confirmation email test failed!")
        return False

def main():
    """Main test function"""
    print("🚀 PlantiFy Email System Test")
    print("=" * 40)
    
    # Test basic email connection
    print("\n1️⃣ Testing Basic Email Connection...")
    if test_email_system():
        print("✅ Basic email connection working!")
    else:
        print("❌ Basic email connection failed!")
        print("Please check your email configuration in settings.py")
        return
    
    # Test order confirmation email
    print("\n2️⃣ Testing Order Confirmation Email...")
    test_order_confirmation_email()
    
    print("\n🎯 Email system test completed!")
    print("Check your email inbox for test messages.")

if __name__ == "__main__":
    main()


