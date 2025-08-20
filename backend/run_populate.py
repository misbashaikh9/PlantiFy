#!/usr/bin/env python
"""
Simple script to run the populate function
"""
import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'plantify_backend.settings')
django.setup()

from plant_store.models import Category, Product

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
            'price': 899.00,  # ~$10.99 in INR
            'sale_price': 749.00,  # ~$8.99 in INR
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
            'price': 399.00,  # ~$4.99 in INR
            'sale_price': 299.00,  # ~$3.99 in INR
            'sku': 'SNA-002',
            'description': 'The ultimate low-maintenance plant! Snake Plant is perfect for beginners and busy people. It purifies air, requires minimal care, and can survive in low light conditions. Features tall, upright leaves with distinctive patterns.',
            'plant_type': 'succulent',
            'care_level': 'easy',
            'light_requirements': 'Low to bright indirect light',
            'water_needs': 'Minimal watering - let soil dry completely between waterings',
            'stock_quantity': 25
        },
        {
            'name': 'Peace Lily',
            'category': categories['Indoor Plants'],
            'price': 599.00,  # ~$6.99 in INR
            'sale_price': 499.00,  # ~$5.99 in INR
            'sku': 'PEA-003',
            'description': 'Beautiful flowering plant that blooms elegant white flowers. Peace Lily is excellent for air purification and adds a touch of elegance to any room. Perfect for medium to low light areas.',
            'plant_type': 'flowering',
            'care_level': 'easy',
            'light_requirements': 'Medium to low indirect light',
            'water_needs': 'Keep soil consistently moist, not soggy',
            'stock_quantity': 20
        },
        {
            'name': 'ZZ Plant',
            'category': categories['Indoor Plants'],
            'price': 449.00,  # ~$5.49 in INR
            'sale_price': 349.00,  # ~$4.49 in INR
            'sku': 'ZZP-004',
            'description': 'The ZZ Plant is virtually indestructible! Perfect for beginners, it thrives in low light and requires minimal watering. Features glossy, dark green leaves that add a modern touch to any space.',
            'plant_type': 'tropical',
            'care_level': 'easy',
            'light_requirements': 'Low to bright indirect light',
            'water_needs': 'Minimal watering - let soil dry between waterings',
            'stock_quantity': 30
        },
        {
            'name': 'Pothos Golden',
            'category': categories['Indoor Plants'],
            'price': 299.00,  # ~$3.99 in INR
            'sale_price': 249.00,  # ~$2.99 in INR
            'sku': 'POT-005',
            'description': 'Beautiful trailing plant with heart-shaped leaves featuring golden variegation. Pothos is perfect for hanging baskets or climbing up moss poles. Very easy to care for and great for beginners.',
            'plant_type': 'trailing',
            'care_level': 'easy',
            'light_requirements': 'Low to bright indirect light',
            'water_needs': 'Let top inch of soil dry between waterings',
            'stock_quantity': 35
        },
        {
            'name': 'Philodendron Brasil',
            'category': categories['Indoor Plants'],
            'price': 549.00,  # ~$6.49 in INR
            'sale_price': 449.00,  # ~$5.49 in INR
            'sku': 'PHI-006',
            'description': 'Stunning variegated Philodendron with heart-shaped leaves featuring beautiful yellow and green patterns. Perfect for hanging baskets or climbing. Adds a tropical feel to any room.',
            'plant_type': 'trailing',
            'care_level': 'moderate',
            'light_requirements': 'Bright indirect light',
            'water_needs': 'Keep soil evenly moist, not soggy',
            'stock_quantity': 18
        },
        {
            'name': 'Chinese Evergreen',
            'category': categories['Indoor Plants'],
            'price': 399.00,  # ~$4.99 in INR
            'sale_price': 299.00,  # ~$3.99 in INR
            'sku': 'CHI-007',
            'description': 'Beautiful foliage plant with striking leaf patterns and colors. Chinese Evergreen is very low maintenance and perfect for low light areas. Great for offices and homes with limited natural light.',
            'plant_type': 'tropical',
            'care_level': 'easy',
            'light_requirements': 'Low to medium indirect light',
            'water_needs': 'Let top inch of soil dry between waterings',
            'stock_quantity': 22
        },
        {
            'name': 'Dracaena Marginata',
            'category': categories['Indoor Plants'],
            'price': 499.00,  # ~$5.99 in INR
            'sale_price': 399.00,  # ~$4.99 in INR
            'sku': 'DRA-008',
            'description': 'Elegant palm-like plant with thin, arching leaves with red margins. Perfect for adding height and drama to any room. Very low maintenance and great for modern interiors.',
            'plant_type': 'palm-like',
            'care_level': 'easy',
            'light_requirements': 'Medium to bright indirect light',
            'water_needs': 'Let top 2-3 inches dry between waterings',
            'stock_quantity': 16
        },
        {
            'name': 'Spider Plant',
            'category': categories['Indoor Plants'],
            'price': 249.00,  # ~$2.99 in INR
            'sale_price': 199.00,  # ~$2.49 in INR
            'sku': 'SPI-009',
            'description': 'Classic houseplant that produces baby plantlets on long stems. Spider Plant is excellent for air purification and very easy to care for. Perfect for hanging baskets or tabletop display.',
            'plant_type': 'grass-like',
            'care_level': 'easy',
            'light_requirements': 'Medium to bright indirect light',
            'water_needs': 'Keep soil evenly moist, not soggy',
            'stock_quantity': 28
        },
        
        # Herbs & Edibles - 6 products
        {
            'name': 'Fresh Herb Garden Kit',
            'category': categories['Herbs & Edibles'],
            'price': 599.00,  # ~$6.99 in INR
            'sale_price': 499.00,  # ~$5.99 in INR
            'sku': 'HER-001',
            'description': 'Complete herb growing kit with 6 different herb varieties. Includes organic soil, seeds, pots, and growing guide. Perfect for beginners who want to start their own herb garden. Grow fresh herbs for cooking!',
            'plant_type': 'herb',
            'care_level': 'easy',
            'light_requirements': 'Bright indirect light or partial sun',
            'water_needs': 'Keep soil evenly moist, not soggy',
            'stock_quantity': 12
        },
        {
            'name': 'Dwarf Tomato Plant',
            'category': categories['Herbs & Edibles'],
            'price': 399.00,  # ~$4.99 in INR
            'sale_price': 299.00,  # ~$3.99 in INR
            'sku': 'TOM-002',
            'description': 'Compact tomato plant perfect for small spaces and containers. Produces sweet, juicy tomatoes throughout the growing season. Great for balconies, patios, or indoor growing with proper light.',
            'plant_type': 'vegetable',
            'care_level': 'moderate',
            'light_requirements': 'Full sun or bright indirect light',
            'water_needs': 'Keep soil consistently moist, water when top inch feels dry',
            'stock_quantity': 18
        },
        {
            'name': 'Basil Plant',
            'category': categories['Herbs & Edibles'],
            'price': 199.00,  # ~$2.49 in INR
            'sale_price': 149.00,  # ~$1.99 in INR
            'sku': 'BAS-003',
            'description': 'Fresh basil plant ready for harvesting. Perfect for adding flavor to Italian dishes, pesto, and salads. Very easy to grow and maintain. Harvest leaves as needed for continuous growth.',
            'plant_type': 'herb',
            'care_level': 'easy',
            'light_requirements': 'Bright indirect light or partial sun',
            'water_needs': 'Keep soil evenly moist, not soggy',
            'stock_quantity': 25
        },
        {
            'name': 'Mint Plant',
            'category': categories['Herbs & Edibles'],
            'price': 179.00,  # ~$2.19 in INR
            'sale_price': 129.00,  # ~$1.59 in INR
            'sku': 'MIN-004',
            'description': 'Refreshing mint plant perfect for teas, cocktails, and garnishes. Very hardy and spreads easily. Great for beginners and perfect for growing in containers to control spread.',
            'plant_type': 'herb',
            'care_level': 'easy',
            'light_requirements': 'Partial sun to bright indirect light',
            'water_needs': 'Keep soil consistently moist, mint loves water',
            'stock_quantity': 30
        },
        {
            'name': 'Rosemary Plant',
            'category': categories['Herbs & Edibles'],
            'price': 249.00,  # ~$2.99 in INR
            'sale_price': 199.00,  # ~$2.49 in INR
            'sku': 'ROS-005',
            'description': 'Aromatic rosemary plant with needle-like leaves. Perfect for Mediterranean cooking, roasted meats, and herbal teas. Very drought-tolerant and low maintenance once established.',
            'plant_type': 'herb',
            'care_level': 'easy',
            'light_requirements': 'Full sun or bright indirect light',
            'water_needs': 'Let soil dry between waterings, drought tolerant',
            'stock_quantity': 20
        },
        {
            'name': 'Lavender Plant',
            'category': categories['Herbs & Edibles'],
            'price': 299.00,  # ~$3.59 in INR
            'sale_price': 249.00,  # ~$2.99 in INR
            'sku': 'LAV-006',
            'description': 'Beautiful lavender plant with fragrant purple flowers. Perfect for aromatherapy, teas, and garden borders. Very drought-tolerant and attracts pollinators. Great for beginners.',
            'plant_type': 'herb',
            'care_level': 'easy',
            'light_requirements': 'Full sun or bright indirect light',
            'water_needs': 'Let soil dry between waterings, drought tolerant',
            'stock_quantity': 15
        },
        
        # Seeds - 6 products
        {
            'name': 'Carrot Seeds',
            'category': categories['Seeds'],
            'price': 99.00,  # ~$1.19 in INR
            'sale_price': 79.00,  # ~$0.99 in INR
            'sku': 'CAR-001',
            'description': 'High-quality carrot seeds for growing sweet, crunchy carrots. Perfect for beginners and experienced gardeners. Plant in loose, well-draining soil for best results. Harvest in 60-80 days.',
            'plant_type': 'vegetable',
            'care_level': 'easy',
            'light_requirements': 'Full sun - 6+ hours daily',
            'water_needs': 'Keep soil consistently moist, not soggy',
            'stock_quantity': 50
        },
        {
            'name': 'Bell Pepper Seeds',
            'category': categories['Seeds'],
            'price': 129.00,  # ~$1.59 in INR
            'sale_price': 99.00,  # ~$1.19 in INR
            'sku': 'BEL-002',
            'description': 'Premium bell pepper seeds for growing colorful, sweet peppers. Great for containers or garden beds. Produces large, thick-walled peppers perfect for stuffing, salads, and cooking.',
            'plant_type': 'vegetable',
            'care_level': 'moderate',
            'light_requirements': 'Full sun - 8+ hours daily',
            'water_needs': 'Keep soil consistently moist, water when top inch feels dry',
            'stock_quantity': 40
        },
        {
            'name': 'Cucumber Seeds',
            'category': categories['Seeds'],
            'price': 89.00,  # ~$1.09 in INR
            'sale_price': 69.00,  # ~$0.89 in INR
            'sku': 'CUC-003',
            'description': 'Fresh cucumber seeds for growing crisp, refreshing cucumbers. Perfect for salads, pickling, or fresh eating. Great for trellising to save space. Harvest in 50-70 days.',
            'plant_type': 'vegetable',
            'care_level': 'easy',
            'light_requirements': 'Full sun - 6+ hours daily',
            'water_needs': 'Keep soil consistently moist, cucumbers need regular watering',
            'stock_quantity': 45
        },
        {
            'name': 'Spinach Seeds',
            'category': categories['Seeds'],
            'price': 79.00,  # ~$0.99 in INR
            'sale_price': 59.00,  # ~$0.79 in INR
            'sku': 'SPI-004',
            'description': 'Nutrient-rich spinach seeds for growing healthy, dark green leaves. Perfect for salads, smoothies, and cooking. Very fast growing and great for beginners. Harvest leaves as needed.',
            'plant_type': 'leafy green',
            'care_level': 'easy',
            'light_requirements': 'Partial sun to bright indirect light',
            'water_needs': 'Keep soil consistently moist, not soggy',
            'stock_quantity': 60
        },
        {
            'name': 'Radish Seeds',
            'category': categories['Seeds'],
            'price': 69.00,  # ~$0.89 in INR
            'sale_price': 49.00,  # ~$0.59 in INR
            'sku': 'RAD-005',
            'description': 'Fast-growing radish seeds perfect for quick harvests. Great for beginners and children. Produces crisp, peppery radishes in just 20-30 days. Perfect for containers and small spaces.',
            'plant_type': 'root vegetable',
            'care_level': 'easy',
            'light_requirements': 'Full sun to partial shade',
            'water_needs': 'Keep soil consistently moist, not soggy',
            'stock_quantity': 55
        },
        {
            'name': 'Green Bean Seeds',
            'category': categories['Seeds'],
            'price': 109.00,  # ~$1.29 in INR
            'sale_price': 89.00,  # ~$1.09 in INR
            'sku': 'GRE-006',
            'description': 'Bush bean seeds for growing tender, stringless green beans. Perfect for small gardens and containers. Produces abundant harvests throughout the growing season. Great for freezing and canning.',
            'plant_type': 'vegetable',
            'care_level': 'easy',
            'light_requirements': 'Full sun - 6+ hours daily',
            'water_needs': 'Keep soil consistently moist, water when top inch feels dry',
            'stock_quantity': 35
        },
        
        # Fertilizers - 6 products
        {
            'name': 'NPK Balanced Fertilizer',
            'category': categories['Fertilizers'],
            'price': 299.00,  # ~$3.59 in INR
            'sale_price': 249.00,  # ~$2.99 in INR
            'sku': 'NPK-001',
            'description': 'Complete balanced fertilizer with Nitrogen (N), Phosphorus (P), and Potassium (K). Perfect for all types of plants and vegetables. Promotes healthy growth, strong roots, and abundant flowering. Easy to use granular formula.',
            'plant_type': 'fertilizer',
            'care_level': 'easy',
            'light_requirements': 'Not applicable',
            'water_needs': 'Apply to moist soil and water thoroughly',
            'stock_quantity': 40
        },
        {
            'name': 'Organic Fish Emulsion',
            'category': categories['Fertilizers'],
            'price': 199.00,  # ~$2.39 in INR
            'sale_price': 149.00,  # ~$1.79 in INR
            'sku': 'FIS-002',
            'description': 'Natural organic fertilizer made from fish waste. Rich in nitrogen and micronutrients. Perfect for leafy plants and vegetables. Gentle on plants and safe for organic gardening. Dilute with water before application.',
            'plant_type': 'fertilizer',
            'care_level': 'easy',
            'light_requirements': 'Not applicable',
            'water_needs': 'Dilute with water and apply to soil',
            'stock_quantity': 35
        },
        {
            'name': 'Liquid Seaweed Extract',
            'category': categories['Fertilizers'],
            'price': 249.00,  # ~$2.99 in INR
            'sale_price': 199.00,  # ~$2.39 in INR
            'sku': 'SEA-003',
            'description': 'Premium liquid fertilizer made from natural seaweed. Contains growth hormones, vitamins, and minerals. Promotes root development, flowering, and stress resistance. Perfect for all plants and safe for regular use.',
            'plant_type': 'fertilizer',
            'care_level': 'easy',
            'light_requirements': 'Not applicable',
            'water_needs': 'Dilute with water and apply to soil or foliage',
            'stock_quantity': 30
        },
        {
            'name': 'Slow-Release Granules',
            'category': categories['Fertilizers'],
            'price': 399.00,  # ~$4.79 in INR
            'sale_price': 349.00,  # ~$4.19 in INR
            'sku': 'SLO-004',
            'description': 'Long-lasting slow-release fertilizer granules. Feeds plants for up to 6 months with one application. Perfect for busy gardeners and container plants. Balanced formula suitable for all plant types.',
            'plant_type': 'fertilizer',
            'care_level': 'easy',
            'light_requirements': 'Not applicable',
            'water_needs': 'Apply to soil surface and water normally',
            'stock_quantity': 25
        },
        {
            'name': 'Micronutrient Mix',
            'category': categories['Fertilizers'],
            'price': 179.00,  # ~$2.19 in INR
            'sale_price': 129.00,  # ~$1.59 in INR
            'sku': 'MIC-005',
            'description': 'Essential micronutrient supplement for plants. Contains iron, zinc, manganese, and other trace elements. Prevents nutrient deficiencies and promotes healthy plant development. Safe for all plants and soil types.',
            'plant_type': 'fertilizer',
            'care_level': 'easy',
            'light_requirements': 'Not applicable',
            'water_needs': 'Dilute with water and apply to soil or foliage',
            'stock_quantity': 45
        },
        {
            'name': 'Compost Tea Concentrate',
            'category': categories['Fertilizers'],
            'price': 159.00,  # ~$1.89 in INR
            'sale_price': 119.00,  # ~$1.39 in INR
            'sku': 'COM-006',
            'description': 'Rich organic fertilizer made from composted materials. Full of beneficial microbes and nutrients. Improves soil health and plant vitality. Perfect for organic gardening and soil conditioning.',
            'plant_type': 'fertilizer',
            'care_level': 'easy',
            'light_requirements': 'Not applicable',
            'water_needs': 'Dilute with water and apply to soil',
            'stock_quantity': 50
        }
    ]
    
    for product_data in products_data:
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
