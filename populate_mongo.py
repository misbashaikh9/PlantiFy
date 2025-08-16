#!/usr/bin/env python3
"""
Script to populate MongoDB with initial data
This will create collections and show MongoDB integration is working
"""

import os
import sys
import django

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'plantify_backend.settings')
django.setup()

# Now import mongoengine models
from plant_store.mongo_models import PlantCareTip, UserPlantCollection, PlantIdentification

def create_sample_data():
    """Create sample data in MongoDB"""
    print("🌱 Creating sample data in MongoDB...")
    
    try:
        # 1. Create Plant Care Tips
        print("\n📝 Creating Plant Care Tips...")
        
        care_tips = [
            {
                'title': 'Watering Succulents',
                'content': 'Succulents need minimal water. Water only when soil is completely dry.',
                'plant_type': 'succulent',
                'difficulty_level': 'beginner',
                'tags': ['watering', 'succulent', 'care']
            },
            {
                'title': 'Fertilizing House Plants',
                'content': 'Use balanced fertilizer every 2-4 weeks during growing season.',
                'plant_type': 'houseplant',
                'difficulty_level': 'intermediate',
                'tags': ['fertilizer', 'houseplant', 'nutrition']
            },
            {
                'title': 'Pruning for Growth',
                'content': 'Regular pruning encourages bushier growth and removes dead leaves.',
                'plant_type': 'general',
                'difficulty_level': 'beginner',
                'tags': ['pruning', 'growth', 'maintenance']
            }
        ]
        
        for tip_data in care_tips:
            tip = PlantCareTip(**tip_data)
            tip.save()
            print(f"   ✅ Created: {tip.title}")
        
        # 2. Create Sample User Plant Collection
        print("\n🌿 Creating User Plant Collection...")
        
        user_plants = [
            {
                'user_id': 1,
                'plant_name': 'Snake Plant',
                'plant_type': 'succulent',
                'care_notes': 'Very low maintenance, perfect for beginners',
                'watering_schedule': 'Every 2-3 weeks',
                'health_status': 'healthy'
            },
            {
                'user_id': 1,
                'plant_name': 'Monstera Deliciosa',
                'plant_type': 'tropical',
                'care_notes': 'Loves humidity and indirect light',
                'watering_schedule': 'Weekly',
                'health_status': 'healthy'
            }
        ]
        
        for plant_data in user_plants:
            plant = UserPlantCollection(**plant_data)
            plant.save()
            print(f"   ✅ Created: {plant.plant_name}")
        
        # 3. Create Sample Plant Identification
        print("\n🔍 Creating Plant Identification...")
        
        identification = PlantIdentification(
            user_id=1,
            image_url='sample_plant.jpg',
            identified_plant='Monstera Deliciosa',
            confidence_score=0.95,
            care_recommendations=[
                'Bright indirect light',
                'Water when top soil is dry',
                'High humidity preferred'
            ]
        )
        identification.save()
        print(f"   ✅ Created: Plant ID for {identification.identified_plant}")
        
        print("\n🎉 MongoDB population complete!")
        return True
        
    except Exception as e:
        print(f"❌ Error creating sample data: {e}")
        return False

def show_collections():
    """Show what collections exist in MongoDB"""
    print("\n📊 MongoDB Collections Status:")
    print("=" * 40)
    
    try:
        # Check each collection
        care_tips_count = PlantCareTip.objects.count()
        user_plants_count = UserPlantCollection.objects.count()
        identifications_count = PlantIdentification.objects.count()
        
        print(f"🌱 Plant Care Tips: {care_tips_count} documents")
        print(f"🌿 User Plant Collections: {user_plants_count} documents")
        print(f"🔍 Plant Identifications: {identifications_count} documents")
        
        if care_tips_count > 0:
            print(f"\n📝 Sample Care Tip:")
            sample_tip = PlantCareTip.objects.first()
            print(f"   Title: {sample_tip.title}")
            print(f"   Content: {sample_tip.content[:50]}...")
            print(f"   Plant Type: {sample_tip.plant_type}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error checking collections: {e}")
        return False

if __name__ == "__main__":
    print("🚀 PlantiFy MongoDB Population Script")
    print("=" * 50)
    
    # Create sample data
    if create_sample_data():
        # Show collections status
        show_collections()
        
        print("\n🎯 Next Steps:")
        print("1. Check MongoDB Compass to see collections")
        print("2. Test frontend signup to see data flow")
        print("3. Verify Django admin is working")
    else:
        print("❌ Failed to populate MongoDB")


