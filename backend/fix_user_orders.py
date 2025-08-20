#!/usr/bin/env python
import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'plantify_backend.settings')
django.setup()

from plant_store.models import Order
from django.contrib.auth.models import User as DjangoUser

def fix_user_orders():
    """Move orders from user 'misba' to user 'Misba'"""
    try:
        # Find the users
        misba_lower = DjangoUser.objects.get(username='misba')
        misba_upper = DjangoUser.objects.get(username='Misba')
        
        print(f"Found users:")
        print(f"  - 'misba' (ID: {misba_lower.id})")
        print(f"  - 'Misba' (ID: {misba_upper.id})")
        
        # Get orders from 'misba'
        orders_from_misba = Order.objects.filter(user=misba_lower)
        print(f"\nOrders from 'misba': {orders_from_misba.count()}")
        
        # Move orders to 'Misba'
        updated_count = 0
        for order in orders_from_misba:
            print(f"Moving order {order.order_number} from 'misba' to 'Misba'")
            order.user = misba_upper
            order.save()
            updated_count += 1
        
        print(f"\n✅ Successfully moved {updated_count} orders to user 'Misba'")
        
        # Verify the change
        orders_for_misba_upper = Order.objects.filter(user=misba_upper)
        print(f"Orders for 'Misba': {orders_for_misba_upper.count()}")
        
        for order in orders_for_misba_upper:
            print(f"  - {order.order_number}: {order.status}")
            
    except DjangoUser.DoesNotExist as e:
        print(f"❌ User not found: {e}")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    print("🔄 Fixing user order relationships...")
    fix_user_orders()
    print("\n🎉 Done!")





