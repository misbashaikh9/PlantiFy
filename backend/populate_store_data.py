#!/usr/bin/env python
"""
Script to populate the plant store database with sample categories and products
Run this after running migrations: python manage.py shell < populate_store_data.py
"""

import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'plantify_backend.settings')
django.setup()

from plant_store.models import Category, Product
from decimal import Decimal

def create_categories():
    """Create main plant categories"""
    categories_data = [
        {
            'name': 'Indoor Plants',
            'description': 'Beautiful plants that thrive indoors, perfect for home and office spaces.',
        },
        {
            'name': 'Herbs & Edibles',
            'description': 'Fresh herbs and edible plants for your kitchen garden.',
        },
        {
            'name': 'Seeds',
            'description': 'High-quality seeds for growing your own plants from scratch.',
        },
        {
            'name': 'Fertilizers',
            'description': 'Premium plant nutrients and soil enhancers for healthy growth.',
        }
    ]
    
    created_categories = {}
    for cat_data in categories_data:
        category, created = Category.objects.get_or_create(
            name=cat_data['name'],
            defaults={'description': cat_data['description']}
        )
        created_categories[cat_data['name']] = category
        if created:
            print(f"✅ Created category: {category.name}")
        else:
            print(f"ℹ️  Category already exists: {category.name}")
    
    return created_categories

def create_products(categories):
    """Create products for each category based on available images"""
    
    products_data = [
        # Indoor Plants - 9 products
        {
            'name': 'Monstera Deliciosa',
            'category': categories['Indoor Plants'],
            'price': 2499.00,  # ~$29.99 in INR
            'sale_price': 2074.00,  # ~$24.99 in INR
            'sku': 'MON-001',
            'description': 'The iconic Swiss Cheese Plant with distinctive split leaves. Perfect for creating a tropical jungle vibe in your home. This stunning Monstera features large, glossy leaves with natural holes and splits that develop as the plant matures. Ideal for bright, indirect light areas.',
            'plant_type': 'tropical',
            'care_level': 'moderate',
            'light_requirements': 'Bright indirect light',
            'water_needs': 'Moderate watering - let top 2-3 inches dry between waterings',
            'stock_quantity': 15
        },
        {
            'name': 'Snake Plant',
            'category': categories['Indoor Plants'],
            'price': 1659.00,  # ~$19.99 in INR
            'sale_price': None,
            'sku': 'SNA-001',
            'description': 'Also known as Mother-in-Law\'s Tongue, this hardy plant is virtually indestructible. Features tall, sword-like leaves with striking yellow edges. Perfect for beginners and low-light areas. NASA-approved air purifier that releases oxygen at night.',
            'plant_type': 'succulent',
            'care_level': 'easy',
            'light_requirements': 'Low to bright indirect light',
            'water_needs': 'Low watering - drought tolerant, water every 2-3 weeks',
            'stock_quantity': 25
        },
        {
            'name': 'Peace Lily',
            'category': categories['Indoor Plants'],
            'price': 2904.00,  # ~$34.99 in INR
            'sale_price': 2489.00,  # ~$29.99 in INR
            'sku': 'PEA-001',
            'description': 'Elegant white blooms and glossy dark green leaves make this a classic choice. Excellent air purifier that removes toxins like formaldehyde and benzene. Blooms throughout the year with proper care. Perfect for bedrooms and living areas.',
            'plant_type': 'tropical',
            'care_level': 'easy',
            'light_requirements': 'Medium to bright indirect light',
            'water_needs': 'Moderate watering - keep soil consistently moist',
            'stock_quantity': 20
        },
        {
            'name': 'ZZ Plant',
            'category': categories['Indoor Plants'],
            'price': 2738.00,  # ~$32.99 in INR
            'sale_price': None,
            'sku': 'ZZP-001',
            'description': 'Zamioculcas zamiifolia, known for its waxy, dark green leaves and low maintenance requirements. This plant stores water in its rhizomes, making it perfect for forgetful plant parents. Thrives in low light and requires minimal care.',
            'plant_type': 'tropical',
            'care_level': 'easy',
            'light_requirements': 'Low to bright indirect light',
            'water_needs': 'Low watering - water every 2-3 weeks, drought tolerant',
            'stock_quantity': 18
        },
        {
            'name': 'Pothos Golden',
            'category': categories['Indoor Plants'],
            'price': 1577.00,  # ~$18.99 in INR
            'sale_price': None,
            'sku': 'POT-001',
            'description': 'Classic trailing plant with heart-shaped leaves featuring beautiful golden variegation. Perfect for hanging baskets or climbing up moss poles. Fast-growing and easy to propagate. Great for beginners and adds instant greenery to any space.',
            'plant_type': 'tropical',
            'care_level': 'easy',
            'light_requirements': 'Low to bright indirect light',
            'water_needs': 'Moderate watering - let top inch dry between waterings',
            'stock_quantity': 30
        },
        {
            'name': 'Philodendron Brasil',
            'category': categories['Indoor Plants'],
            'price': 2157.00,  # ~$25.99 in INR
            'sale_price': 1908.00,  # ~$22.99 in INR
            'sku': 'PHI-001',
            'description': 'Stunning variegated leaves with lime green centers and dark green edges. This trailing philodendron is perfect for hanging baskets or climbing. Easy to care for and adds a pop of color to any room. Great for both beginners and experienced plant lovers.',
            'plant_type': 'tropical',
            'care_level': 'easy',
            'light_requirements': 'Medium to bright indirect light',
            'water_needs': 'Moderate watering - keep soil evenly moist',
            'stock_quantity': 22
        },
        {
            'name': 'Chinese Evergreen',
            'category': categories['Indoor Plants'],
            'price': 2406.00,  # ~$28.99 in INR
            'sale_price': None,
            'sku': 'CHI-001',
            'description': 'Aglaonema with beautiful variegated leaves in shades of green, silver, and sometimes pink. Known for its air-purifying qualities and tolerance to low light. Perfect for offices and homes with limited natural light. Low maintenance and long-lasting.',
            'plant_type': 'tropical',
            'care_level': 'easy',
            'light_requirements': 'Low to medium indirect light',
            'water_needs': 'Moderate watering - let top inch dry between waterings',
            'stock_quantity': 16
        },
        {
            'name': 'Dracaena Marginata',
            'category': categories['Indoor Plants'],
            'price': 2988.00,  # ~$35.99 in INR
            'sale_price': 2566.00,  # ~$30.99 in INR
            'sku': 'DRA-001',
            'description': 'Dragon Tree with thin, arching leaves edged in red. This architectural plant adds height and drama to any room. Slow-growing and perfect for corners or as a focal point. Excellent air purifier that removes toxins from the air.',
            'plant_type': 'tropical',
            'care_level': 'easy',
            'light_requirements': 'Medium to bright indirect light',
            'water_needs': 'Low to moderate watering - let soil dry between waterings',
            'stock_quantity': 12
        },
        {
            'name': 'Spider Plant',
            'category': categories['Indoor Plants'],
            'price': 1411.00,  # ~$16.99 in INR
            'sale_price': None,
            'sku': 'SPI-001',
            'description': 'Chlorophytum comosum with long, arching leaves and adorable baby plantlets. Perfect hanging plant that produces numerous offsets. Non-toxic to pets and excellent air purifier. Easy to care for and great for beginners.',
            'plant_type': 'tropical',
            'care_level': 'easy',
            'light_requirements': 'Medium to bright indirect light',
            'water_needs': 'Moderate watering - keep soil evenly moist',
            'stock_quantity': 28
        },
        
        # Herbs & Edibles - 6 products
        {
            'name': 'Fresh Herb Garden Kit',
            'category': categories['Herbs & Edibles'],
            'price': 2904.00,  # ~$34.99 in INR
            'sale_price': 2489.00,  # ~$29.99 in INR
            'sku': 'HER-001',
            'description': 'Complete starter kit with 6 popular culinary herbs: basil, mint, rosemary, thyme, oregano, and sage. Includes organic potting mix, biodegradable pots, and detailed growing guide. Perfect for kitchen windowsills and beginner gardeners.',
            'plant_type': 'herb',
            'care_level': 'easy',
            'light_requirements': 'Bright direct light - 6+ hours daily',
            'water_needs': 'Moderate watering - keep soil consistently moist',
            'stock_quantity': 20
        },
        {
            'name': 'Dwarf Tomato Plant',
            'category': categories['Herbs & Edibles'],
            'price': 1908.00,  # ~$22.99 in INR
            'sale_price': None,
            'sku': 'TOM-001',
            'description': 'Compact tomato plant perfect for containers and small spaces. Produces sweet, cherry-sized tomatoes throughout the growing season. Determinate variety that doesn\'t require staking. Great for balconies, patios, and indoor growing.',
            'plant_type': 'vegetable',
            'care_level': 'moderate',
            'light_requirements': 'Full sun - 8+ hours daily',
            'water_needs': 'High watering - keep soil consistently moist',
            'stock_quantity': 15
        },
        {
            'name': 'Basil Plant',
            'category': categories['Herbs & Edibles'],
            'price': 1078.00,  # ~$12.99 in INR
            'sale_price': None,
            'sku': 'BAS-001',
            'description': 'Sweet basil with aromatic leaves perfect for Italian cuisine. Fast-growing annual herb that thrives in warm weather. Pinch off flower buds to encourage leaf growth. Essential for pesto, salads, and Mediterranean dishes.',
            'plant_type': 'herb',
            'care_level': 'easy',
            'light_requirements': 'Full sun to partial shade - 6+ hours daily',
            'water_needs': 'Moderate watering - keep soil evenly moist',
            'stock_quantity': 25
        },
        {
            'name': 'Mint Plant',
            'category': categories['Herbs & Edibles'],
            'price': 995.00,  # ~$11.99 in INR
            'sale_price': None,
            'sku': 'MIN-001',
            'description': 'Refreshing mint perfect for teas, cocktails, and desserts. Fast-spreading perennial herb that\'s best grown in containers to prevent garden takeover. Multiple varieties available including spearmint and peppermint.',
            'plant_type': 'herb',
            'care_level': 'easy',
            'light_requirements': 'Partial shade to full sun - 4-6 hours daily',
            'water_needs': 'High watering - keep soil consistently moist',
            'stock_quantity': 30
        },
        {
            'name': 'Rosemary Plant',
            'category': categories['Herbs & Edibles'],
            'price': 1328.00,  # ~$15.99 in INR
            'sale_price': 1161.00,  # ~$13.99 in INR
            'sku': 'ROS-001',
            'description': 'Aromatic evergreen herb with needle-like leaves. Perfect for Mediterranean cooking, especially with lamb, chicken, and roasted vegetables. Drought-tolerant once established. Can be grown as a small shrub or in containers.',
            'plant_type': 'herb',
            'care_level': 'easy',
            'light_requirements': 'Full sun - 6+ hours daily',
            'water_needs': 'Low to moderate watering - drought tolerant',
            'stock_quantity': 18
        },
        {
            'name': 'Lavender Plant',
            'category': categories['Herbs & Edibles'],
            'price': 1577.00,  # ~$18.99 in INR
            'sale_price': None,
            'sku': 'LAV-001',
            'description': 'Beautiful purple flowering herb with calming fragrance. Perfect for aromatherapy, teas, and culinary use. Drought-tolerant perennial that attracts pollinators. Great for borders, containers, or as a focal point in the garden.',
            'plant_type': 'herb',
            'care_level': 'easy',
            'light_requirements': 'Full sun - 8+ hours daily',
            'water_needs': 'Low watering - drought tolerant once established',
            'stock_quantity': 22
        },
        
        # Seeds - 6 products
        {
            'name': 'Carrot Seeds',
            'category': categories['Seeds'],
            'price': 580.00,  # ~$6.99 in INR
            'sale_price': None,
            'sku': 'SEC-001',
            'description': 'Premium organic carrot seeds for growing sweet, crunchy carrots. Perfect for home gardens and containers. Sow directly in loose, well-draining soil. Harvest in 60-80 days. Great for beginners and kids.',
            'plant_type': 'vegetable',
            'care_level': 'easy',
            'light_requirements': 'Full sun - 6+ hours daily',
            'water_needs': 'Moderate watering - keep soil evenly moist',
            'stock_quantity': 50
        },
        {
            'name': 'Bell Pepper Seeds',
            'category': categories['Seeds'],
            'price': 663.00,  # ~$7.99 in INR
            'sku': 'SEP-001',
            'description': 'Sweet bell pepper seeds producing large, thick-walled fruits. Perfect for stuffing, salads, and cooking. Start indoors 6-8 weeks before last frost. Transplant outdoors when soil is warm. Harvest in 70-80 days.',
            'plant_type': 'vegetable',
            'care_level': 'moderate',
            'light_requirements': 'Full sun - 8+ hours daily',
            'water_needs': 'High watering - keep soil consistently moist',
            'stock_quantity': 40
        },
        {
            'name': 'Cucumber Seeds',
            'category': categories['Seeds'],
            'price': 497.00,  # ~$5.99 in INR
            'sku': 'SEC-002',
            'description': 'Crisp cucumber seeds perfect for fresh eating and pickling. Vining plants that can be trained on trellises. Plant after last frost when soil is warm. Harvest in 50-70 days. Great for salads and summer refreshment.',
            'plant_type': 'vegetable',
            'care_level': 'easy',
            'light_requirements': 'Full sun - 8+ hours daily',
            'water_needs': 'High watering - keep soil consistently moist',
            'stock_quantity': 45
        },
        {
            'name': 'Spinach Seeds',
            'category': categories['Seeds'],
            'price': 414.00,  # ~$4.99 in INR
            'sku': 'SES-001',
            'description': 'Nutrient-rich spinach seeds for growing tender, dark green leaves. Perfect for salads, smoothies, and cooking. Sow in early spring or fall for best results. Harvest in 40-50 days. Cold-tolerant and great for beginners.',
            'plant_type': 'vegetable',
            'care_level': 'easy',
            'light_requirements': 'Partial shade to full sun - 4-6 hours daily',
            'water_needs': 'Moderate watering - keep soil evenly moist',
            'stock_quantity': 60
        },
        {
            'name': 'Radish Seeds',
            'category': categories['Seeds'],
            'price': 331.00,  # ~$3.99 in INR
            'sku': 'SER-001',
            'description': 'Fast-growing radish seeds perfect for quick harvests. Crisp, peppery roots ready in just 20-30 days. Great for succession planting throughout the growing season. Perfect for beginners and kids to learn gardening.',
            'plant_type': 'vegetable',
            'care_level': 'easy',
            'light_requirements': 'Full sun - 6+ hours daily',
            'water_needs': 'Moderate watering - keep soil evenly moist',
            'stock_quantity': 70
        },
        {
            'name': 'Green Bean Seeds',
            'category': categories['Seeds'],
            'price': 580.00,  # ~$6.99 in INR
            'sku': 'SEG-001',
            'description': 'Bush bean seeds producing tender, stringless pods. Perfect for fresh eating, freezing, and canning. Plant after last frost when soil is warm. Harvest in 50-65 days. Great for small gardens and containers.',
            'plant_type': 'vegetable',
            'care_level': 'easy',
            'light_requirements': 'Full sun - 8+ hours daily',
            'water_needs': 'Moderate watering - keep soil evenly moist',
            'stock_quantity': 55
        },
        
        # Fertilizers - 6 products
        {
            'name': 'NPK Balanced Fertilizer',
            'category': categories['Fertilizers'],
            'price': 2074.00,  # ~$24.99 in INR
            'sale_price': None,
            'sku': 'FER-001',
            'description': 'Complete 10-10-10 NPK fertilizer for balanced plant nutrition. Promotes healthy root development, lush foliage, and abundant blooms. Suitable for all types of plants including vegetables, flowers, and houseplants.',
            'plant_type': 'fertilizer',
            'care_level': 'easy',
            'light_requirements': 'N/A',
            'water_needs': 'N/A',
            'stock_quantity': 100
        },
        {
            'name': 'Organic Fish Emulsion',
            'category': categories['Fertilizers'],
            'price': 1659.00,  # ~$19.99 in INR
            'sale_price': None,
            'sku': 'FER-002',
            'description': 'Natural fish-based fertilizer rich in nitrogen and trace minerals. Promotes vigorous growth and dark green foliage. Safe for organic gardening and won\'t burn plants. Great for vegetables, herbs, and flowering plants.',
            'plant_type': 'fertilizer',
            'care_level': 'easy',
            'light_requirements': 'N/A',
            'water_needs': 'N/A',
            'stock_quantity': 80
        },
        {
            'name': 'Liquid Seaweed Extract',
            'category': categories['Fertilizers'],
            'price': 1411.00,  # ~$16.99 in INR
            'sku': 'FER-003',
            'description': 'Concentrated seaweed extract with natural growth hormones and micronutrients. Improves plant stress tolerance and root development. Perfect for seedlings, transplants, and established plants. Organic and environmentally friendly.',
            'plant_type': 'fertilizer',
            'care_level': 'easy',
            'light_requirements': 'N/A',
            'water_needs': 'N/A',
            'stock_quantity': 90
        },
        {
            'name': 'Slow-Release Granules',
            'category': categories['Fertilizers'],
            'price': 1908.00,  # ~$22.99 in INR
            'sku': 'FER-004',
            'description': 'Coated fertilizer granules that release nutrients gradually over 3-6 months. Perfect for busy gardeners and container plants. Prevents over-fertilization and provides consistent nutrition. Great for trees, shrubs, and perennials.',
            'plant_type': 'fertilizer',
            'care_level': 'easy',
            'light_requirements': 'N/A',
            'water_needs': 'N/A',
            'stock_quantity': 75
        },
        {
            'name': 'Micronutrient Mix',
            'category': categories['Fertilizers'],
            'price': 1577.00,  # ~$18.99 in INR
            'sku': 'FER-005',
            'description': 'Essential micronutrient blend including iron, zinc, manganese, and copper. Corrects nutrient deficiencies and promotes healthy plant development. Perfect for plants showing yellowing leaves or stunted growth.',
            'plant_type': 'fertilizer',
            'care_level': 'easy',
            'light_requirements': 'N/A',
            'water_needs': 'N/A',
            'stock_quantity': 85
        },
        {
            'name': 'Compost Tea Concentrate',
            'category': categories['Fertilizers'],
            'price': 1244.00,  # ~$14.99 in INR
            'sku': 'FER-006',
            'description': 'Rich compost tea concentrate that improves soil health and plant vitality. Contains beneficial microorganisms and organic matter. Perfect for organic gardening and improving soil structure. Safe for all plants and won\'t burn roots.',
            'plant_type': 'fertilizer',
            'care_level': 'easy',
            'light_requirements': 'N/A',
            'water_needs': 'N/A',
            'stock_quantity': 95
        },
    ]
    
    for product_data in products_data:
        # Add default values for required fields
        product_data.update({
            'description': f"Beautiful {product_data['name'].lower()} - perfect for your home.",
            'plant_type': 'indoor',
            'care_level': 'easy',
            'light_requirements': 'Bright indirect light',
            'water_needs': 'Moderate watering',
            'stock_quantity': 20,
            'is_featured': False,
        })
        
        product, created = Product.objects.get_or_create(
            sku=product_data['sku'],
            defaults=product_data
        )
        if created:
            print(f"✅ Created: {product.name}")
        else:
            print(f"ℹ️  Exists: {product.name}")
    
    return len(products_data)

def main():
    """Main function to populate the database"""
    print("🌱 Starting to populate Plant Store database...")
    print("=" * 50)
    
    # Create categories
    print("\n📂 Creating categories...")
    categories = create_categories()
    
    # Create products
    print("\n🛍️  Creating products...")
    product_count = create_products(categories)
    
    print("\n" + "=" * 50)
    print(f"🎉 Database population complete!")
    print(f"📊 Created {len(categories)} categories and {product_count} products")
    print("=" * 50)

if __name__ == '__main__':
    main()
