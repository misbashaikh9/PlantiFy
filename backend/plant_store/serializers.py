from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Category, Product, Cart, CartItem, Order, OrderItem, UserAddress, ContactMessage, CustomerSuggestion


class UserProfileSerializer(serializers.ModelSerializer):
	"""Serializer for UserProfile model"""
	user = serializers.PrimaryKeyRelatedField(read_only=True)
	
	class Meta:
		model = UserProfile
		fields = '__all__'
		read_only_fields = ['created_at', 'updated_at']


class UserSerializer(serializers.ModelSerializer):
	"""Serializer for Django User model"""
	profile = UserProfileSerializer(read_only=True)
	
	class Meta:
		model = User
		fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined', 'profile']
		read_only_fields = ['id', 'date_joined']


class UserAddressSerializer(serializers.ModelSerializer):
	"""Serializer for UserAddress model"""
	user = UserSerializer(read_only=True)
	
	class Meta:
		model = UserAddress
		fields = '__all__'
		read_only_fields = ['created_at', 'updated_at']


class CategorySerializer(serializers.ModelSerializer):
	"""Serializer for Category model"""
	class Meta:
		model = Category
		fields = '__all__'
		read_only_fields = ['created_at']


class ProductSerializer(serializers.ModelSerializer):
	"""Serializer for Product model"""
	category = CategorySerializer(read_only=True)
	
	class Meta:
		model = Product
		fields = '__all__'
		read_only_fields = ['created_at', 'updated_at']


class CartItemSerializer(serializers.ModelSerializer):
	"""Serializer for CartItem model"""
	product = ProductSerializer(read_only=True)
	total_price = serializers.ReadOnlyField()
	
	class Meta:
		model = CartItem
		fields = '__all__'
		read_only_fields = ['added_at', 'total_price']


class CartSerializer(serializers.ModelSerializer):
	"""Serializer for Cart model"""
	items = CartItemSerializer(many=True, read_only=True)
	total_price = serializers.ReadOnlyField()
	
	class Meta:
		model = Cart
		fields = '__all__'
		read_only_fields = ['created_at', 'updated_at', 'total_price']


class OrderItemSerializer(serializers.ModelSerializer):
	"""Serializer for OrderItem model"""
	product = ProductSerializer(read_only=True)
	product_name = serializers.CharField(source='product.name', read_only=True)
	product_image = serializers.CharField(source='product.image.url', read_only=True)
	product_category = serializers.CharField(source='product.category.name', read_only=True)
	
	class Meta:
		model = OrderItem
		fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
	"""Serializer for Order model"""
	items = OrderItemSerializer(many=True, read_only=True)
	user = UserSerializer(read_only=True)
	
	class Meta:
		model = Order
		fields = '__all__'
		read_only_fields = ['order_number', 'created_at', 'updated_at']


# Registration and Login Serializers
class UserRegistrationSerializer(serializers.ModelSerializer):
	"""Serializer for user registration"""
	password = serializers.CharField(write_only=True)
	
	class Meta:
		model = User
		fields = ['username', 'email', 'password']
	
	def create(self, validated_data):
		user = User.objects.create_user(**validated_data)
		return user


class LoginSerializer(serializers.Serializer):
	"""Serializer for user login"""
	username = serializers.CharField()
	password = serializers.CharField()


class ContactMessageSerializer(serializers.ModelSerializer):
	class Meta:
		model = ContactMessage
		fields = ['name', 'email', 'subject', 'message']
	
	def validate_email(self, value):
		# Basic email validation
		if not value or '@' not in value:
			raise serializers.ValidationError("Please enter a valid email address.")
		return value
	
	def validate_message(self, value):
		# Ensure message is not too short
		if len(value.strip()) < 10:
			raise serializers.ValidationError("Message must be at least 10 characters long.")
		return value


class CustomerSuggestionSerializer(serializers.ModelSerializer):
	user = UserSerializer(read_only=True)
	
	class Meta:
		model = CustomerSuggestion
		fields = ['id', 'user', 'content', 'created_at', 'updated_at', 'is_public']
		read_only_fields = ['id', 'created_at', 'updated_at']

