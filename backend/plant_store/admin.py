from django.contrib import admin
from django.contrib.auth.models import User
from .models import UserProfile, Category, Product, Cart, CartItem, Order, OrderItem, UserAddress, ContactMessage, CustomerSuggestion

# Show UserProfile inside the Django User admin
class UserProfileInline(admin.StackedInline):
	model = UserProfile
	can_delete = False
	fk_name = 'user'
	extra = 0

class CustomUserAdmin(admin.ModelAdmin):
	inlines = [UserProfileInline]
	list_display = ['username', 'first_name', 'last_name', 'email', 'is_active', 'date_joined']
	list_filter = ['is_active', 'is_staff', 'date_joined', 'groups']
	search_fields = ['username', 'email', 'first_name', 'last_name']
	ordering = ['-date_joined']
	list_editable = ['is_active']

# Swap default User admin to include the inline
try:
	admin.site.unregister(User)
except admin.sites.NotRegistered:
	pass
admin.site.register(User, CustomUserAdmin)

# Register your models here.

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'get_first_name', 'get_last_name', 'get_email', 'phone', 'date_of_birth', 'plant_experience', 'preferred_plant_types', 'newsletter_subscription', 'country']
    list_filter = ['plant_experience', 'country', 'newsletter_subscription', 'date_of_birth', 'preferred_plant_types']
    search_fields = ['user__username', 'user__email', 'user__first_name', 'user__last_name', 'phone']
    readonly_fields = ['created_at', 'updated_at']
    list_per_page = 25  # Show more items per page
    
    def get_first_name(self, obj):
        return obj.user.first_name
    get_first_name.short_description = 'First Name'
    get_first_name.admin_order_field = 'user__first_name'
    
    def get_last_name(self, obj):
        return obj.user.last_name
    get_last_name.short_description = 'Last Name'
    get_last_name.admin_order_field = 'user__last_name'
    
    def get_email(self, obj):
        return obj.user.email
    get_email.short_description = 'Email'
    get_email.admin_order_field = 'user__email'
    
    fieldsets = (
        ('User Information', {
            'fields': ('user', 'phone', 'date_of_birth')
        }),
        ('Plant Preferences', {
            'fields': ('plant_experience', 'preferred_plant_types', 'newsletter_subscription')
        }),
        ('Address Information', {
            'fields': ('city', 'state', 'country', 'address'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )


@admin.register(UserAddress)
class UserAddressAdmin(admin.ModelAdmin):
    list_display = ['user', 'address_type', 'full_name', 'city', 'state', 'is_default', 'is_active']
    list_filter = ['address_type', 'is_default', 'is_active', 'country', 'state']
    search_fields = ['user__username', 'full_name', 'city', 'address_line1']
    readonly_fields = ['created_at', 'updated_at']
    list_editable = ['is_default', 'is_active']

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

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'status', 'is_read', 'created_at']
    list_filter = ['subject', 'status', 'is_read', 'created_at']
    search_fields = ['name', 'email', 'message']
    readonly_fields = ['created_at']
    list_editable = ['status', 'is_read']
    ordering = ['-created_at']
    
    def get_subject_display(self, obj):
        return obj.get_subject_display()
    get_subject_display.short_description = 'Subject'

@admin.register(CustomerSuggestion)
class CustomerSuggestionAdmin(admin.ModelAdmin):
    list_display = ['user', 'content_preview', 'is_public', 'created_at']
    list_filter = ['is_public', 'created_at']
    search_fields = ['user__username', 'user__email', 'content']
    readonly_fields = ['created_at', 'updated_at']
    list_editable = ['is_public']
    ordering = ['-created_at']
    
    def content_preview(self, obj):
        return obj.content[:100] + '...' if len(obj.content) > 100 else obj.content
    content_preview.short_description = 'Content Preview'
