#!/usr/bin/env python
import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'plantify_backend.settings')
django.setup()

from plant_store.models import Order, OrderItem
from django.contrib.auth.models import User as DjangoUser

def debug_orders():
    """Debug function to see what's in the database"""
    print("🔍 DEBUGGING ORDERS AND ORDER ITEMS")
    print("=" * 50)
    
    # Check all users
    print("\n👥 USERS:")
    users = DjangoUser.objects.all()
    for user in users:
        print(f"  - User ID: {user.id}, Username: {user.username}, Email: {user.email}")
    
    # Check all orders
    print("\n📦 ORDERS:")
    orders = Order.objects.all()
    for order in orders:
        print(f"  - Order ID: {order.id}")
        print(f"    Order Number: {order.order_number}")
        print(f"    User: {order.user.username} (ID: {order.user.id})")
        print(f"    Status: {order.status}")
        print(f"    Created: {order.created_at}")
        
        # Check order items
        items = order.items.all()
        print(f"    Items count: {items.count()}")
        for item in items:
            print(f"      - {item.quantity}x {item.product_name} (Product ID: {item.product.id})")
        print()
    
    # Check specific user orders
    print("\n🎯 CHECKING SPECIFIC USER ORDERS:")
    for user in users:
        user_orders = Order.objects.filter(user=user)
        print(f"  User '{user.username}' has {user_orders.count()} orders")
        
        if user_orders.count() > 0:
            for order in user_orders:
                items = order.items.all()
                print(f"    Order {order.order_number}: {items.count()} items")
                for item in items:
                    print(f"      - {item.product.name} (ID: {item.product.id})")

if __name__ == '__main__':
    debug_orders()
