from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import UserProfile, Category, Product, Cart, CartItem, Order, OrderItem

# Show UserProfile inside the Django User admin
class UserProfileInline(admin.StackedInline):
	model = UserProfile
	can_delete = False
	fk_name = 'user'
	extra = 0

class CustomUserAdmin(BaseUserAdmin):
	inlines = [UserProfileInline]
	list_display = ['username', 'email', 'first_name', 'last_name', 'is_active', 'date_joined']
	list_filter = ['is_active', 'is_staff', 'date_joined']
	search_fields = ['username', 'email', 'first_name', 'last_name']
	ordering = ['-date_joined']

# Swap default User admin to include the inline
try:
	admin.site.unregister(User)
except admin.sites.NotRegistered:
	pass
admin.site.register(User, CustomUserAdmin)

# Register your models here.

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
	list_display = ['user', 'plant_experience', 'city', 'country', 'created_at']
	list_filter = ['plant_experience', 'country', 'newsletter_subscription']
	search_fields = ['user__username', 'user__email', 'city', 'state']
	readonly_fields = ['created_at', 'updated_at']

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
	list_display = ['name', 'description', 'created_at']
	search_fields = ['name', 'description']
	readonly_fields = ['created_at']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
	list_display = ['name', 'category', 'plant_type', 'care_level', 'price', 'stock_quantity', 'is_active', 'is_featured']
	list_filter = ['category', 'plant_type', 'care_level', 'is_active', 'is_featured']
	search_fields = ['name', 'description', 'sku']
	readonly_fields = ['created_at', 'updated_at']
	list_editable = ['is_active', 'is_featured', 'stock_quantity']

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
	list_display = ['user', 'created_at', 'updated_at', 'get_total_price']
	list_filter = ['created_at']
	search_fields = ['user__username', 'user__email']
	readonly_fields = ['created_at', 'updated_at']

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
	list_display = ['cart', 'product', 'quantity', 'added_at', 'get_total_price']
	list_filter = ['added_at']
	search_fields = ['cart__user__username', 'product__name']
	readonly_fields = ['added_at']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
	list_display = ['order_number', 'user', 'status', 'payment_status', 'total_amount', 'created_at']
	list_filter = ['status', 'payment_status', 'created_at']
	search_fields = ['order_number', 'user__username', 'shipping_city']
	readonly_fields = ['order_number', 'created_at', 'updated_at']
	list_editable = ['status', 'payment_status']

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
	list_display = ['order', 'product_name', 'quantity', 'unit_price', 'total_price']
	list_filter = ['order__status']
	search_fields = ['order__order_number', 'product_name']
	readonly_fields = ['total_price']
