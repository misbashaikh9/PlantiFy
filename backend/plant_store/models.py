from django.db import models
from django.contrib.auth.models import User as DjangoUser

# Create your models here.

class UserProfile(models.Model):
	"""Extended user profile for plant store customers"""
	
	# Link to Django's built-in User model
	user = models.OneToOneField(DjangoUser, on_delete=models.CASCADE, related_name='profile')
	
	# Personal Information
	phone = models.CharField(max_length=15, blank=True, null=True)
	date_of_birth = models.DateField(blank=True, null=True)
	
	# Plant Experience
	PLANT_EXPERIENCE_CHOICES = [
		('beginner', 'Beginner'),
		('intermediate', 'Intermediate'),
		('expert', 'Expert'),
	]
	plant_experience = models.CharField(
		max_length=20, 
		choices=PLANT_EXPERIENCE_CHOICES, 
		default='beginner'
	)
	
	# Preferences
	preferred_plant_types = models.JSONField(default=list, blank=True)  # ['succulents', 'tropical', etc.]
	newsletter_subscription = models.BooleanField(default=True)
	
	# Address Information (Legacy - keeping for backward compatibility)
	address = models.TextField(blank=True, null=True)
	city = models.CharField(max_length=100, blank=True, null=True)
	state = models.CharField(max_length=100, blank=True, null=True)
	zip_code = models.CharField(max_length=20, blank=True, null=True)
	country = models.CharField(max_length=100, default='India')
	
	# Account Details
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
	
	def __str__(self):
		return f"{self.user.username}'s Profile"
	
	class Meta:
		verbose_name = "User Profile"
		verbose_name_plural = "User Profiles"


class UserAddress(models.Model):
	"""Multiple addresses for users"""
	
	ADDRESS_TYPE_CHOICES = [
		('home', 'Home'),
		('work', 'Work'),
		('shipping', 'Shipping'),
		('other', 'Other'),
	]
	
	user = models.ForeignKey(DjangoUser, on_delete=models.CASCADE, related_name='addresses')
	address_type = models.CharField(max_length=20, choices=ADDRESS_TYPE_CHOICES, default='home')
	full_name = models.CharField(max_length=200)
	phone = models.CharField(max_length=15)
	address_line1 = models.CharField(max_length=200)
	address_line2 = models.CharField(max_length=200, blank=True, null=True)
	city = models.CharField(max_length=100)
	state = models.CharField(max_length=100)
	zip_code = models.CharField(max_length=20)
	country = models.CharField(max_length=100, default='India')
	is_default = models.BooleanField(default=False)
	is_active = models.BooleanField(default=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
	
	def __str__(self):
		return f"{self.user.username} - {self.address_type} - {self.city}"
	
	def save(self, *args, **kwargs):
		# Ensure only one default address per user
		if self.is_default:
			UserAddress.objects.filter(user=self.user, is_default=True).update(is_default=False)
		super().save(*args, **kwargs)
	
	class Meta:
		verbose_name = "User Address"
		verbose_name_plural = "User Addresses"
		ordering = ['-is_default', '-created_at']


class Category(models.Model):
	"""Product categories for plants and accessories"""
	
	name = models.CharField(max_length=100, unique=True)
	description = models.TextField(blank=True)
	image = models.ImageField(upload_to='categories/', blank=True, null=True)
	created_at = models.DateTimeField(auto_now_add=True)
	
	def __str__(self):
		return self.name
	
	class Meta:
		verbose_name = "Category"
		verbose_name_plural = "Categories"


class Product(models.Model):
	"""Products in the plant store (plants, accessories, etc.)"""
	
	# Basic Information
	name = models.CharField(max_length=200)
	description = models.TextField()
	category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
	
	# Plant-Specific Information
	plant_type = models.CharField(max_length=100, blank=True)  # succulent, tropical, etc.
	care_level = models.CharField(
		max_length=20,
		choices=[
			('easy', 'Easy'),
			('moderate', 'Moderate'),
			('difficult', 'Difficult'),
		],
		default='easy'
	)
	light_requirements = models.CharField(max_length=100, blank=True)  # bright indirect, low light, etc.
	water_needs = models.CharField(max_length=100, blank=True)  # low, moderate, high
	
	# Product Details
	price = models.DecimalField(max_digits=10, decimal_places=2)
	sale_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
	stock_quantity = models.PositiveIntegerField(default=0)
	sku = models.CharField(max_length=50, unique=True)
	
	# Images
	main_image = models.ImageField(upload_to='products/', blank=True, null=True)
	additional_images = models.JSONField(default=list, blank=True)  # List of image URLs
	
	# Status
	is_active = models.BooleanField(default=True)
	is_featured = models.BooleanField(default=False)
	
	# Timestamps
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
	
	def __str__(self):
		return self.name
	
	class Meta:
		verbose_name = "Product"
		verbose_name_plural = "Products"


class Cart(models.Model):
	"""Shopping cart for users"""
	
	user = models.ForeignKey(DjangoUser, on_delete=models.CASCADE, related_name='carts')
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
	
	def __str__(self):
		return f"{self.user.username}'s Cart"
	
	def get_total_price(self):
		"""Calculate total price of all items in cart"""
		return sum(item.get_total_price() for item in self.items.all())
	
	class Meta:
		verbose_name = "Cart"
		verbose_name_plural = "Carts"


class CartItem(models.Model):
	"""Individual items in shopping cart"""
	
	cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
	product = models.ForeignKey(Product, on_delete=models.CASCADE)
	quantity = models.PositiveIntegerField(default=1)
	added_at = models.DateTimeField(auto_now_add=True)
	
	def __str__(self):
		return f"{self.quantity}x {self.product.name} in {self.cart.user.username}'s cart"
	
	def get_total_price(self):
		"""Calculate total price for this item (price × quantity)"""
		price = self.product.sale_price if self.product.sale_price else self.product.price
		return price * self.quantity
	
	class Meta:
		verbose_name = "Cart Item"
		verbose_name_plural = "Cart Items"


class Order(models.Model):
	"""Complete orders placed by users"""
	
	ORDER_STATUS_CHOICES = [
		('pending', 'Pending'),
		('processing', 'Processing'),
		('shipped', 'Shipped'),
		('delivered', 'Delivered'),
		('cancelled', 'Cancelled'),
	]
	
	PAYMENT_STATUS_CHOICES = [
		('pending', 'Pending'),
		('paid', 'Paid'),
		('failed', 'Failed'),
		('refunded', 'Refunded'),
	]
	
	# Order Information
	user = models.ForeignKey(DjangoUser, on_delete=models.CASCADE, related_name='orders')
	order_number = models.CharField(max_length=20, unique=True)
	status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default='pending')
	payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
	
	# Pricing
	subtotal = models.DecimalField(max_digits=10, decimal_places=2)
	tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
	shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
	total_amount = models.DecimalField(max_digits=10, decimal_places=2)
	
	# Shipping Information
	shipping_address = models.TextField()
	shipping_city = models.CharField(max_length=100)
	shipping_state = models.CharField(max_length=100)
	shipping_zip = models.CharField(max_length=20)
	shipping_country = models.CharField(max_length=100)
	
	# Contact Information
	contact_phone = models.CharField(max_length=15)
	
	# Timestamps
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
	
	def __str__(self):
		return f"Order {self.order_number} by {self.user.username}"
	
	def save(self, *args, **kwargs):
		"""Auto-generate order number if not provided"""
		if not self.order_number:
			import datetime
			import time
			
			# Use timestamp with microseconds to ensure uniqueness
			timestamp = datetime.datetime.now().strftime('%Y%m%d%H%M%S%f')[:-3]  # Include milliseconds
			self.order_number = f"ORD-{timestamp}"
		super().save(*args, **kwargs)
	
	class Meta:
		verbose_name = "Order"
		verbose_name_plural = "Orders"


class OrderItem(models.Model):
	"""Individual items in an order"""
	
	order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
	product = models.ForeignKey(Product, on_delete=models.CASCADE)
	product_name = models.CharField(max_length=200)  # Store product name at time of order
	quantity = models.PositiveIntegerField()
	unit_price = models.DecimalField(max_digits=10, decimal_places=2)  # Price at time of order
	total_price = models.DecimalField(max_digits=10, decimal_places=2)
	
	def __str__(self):
		return f"{self.quantity}x {self.product_name} in Order {self.order.order_number}"
	
	def save(self, *args, **kwargs):
		"""Auto-calculate total price"""
		self.total_price = self.unit_price * self.quantity
		super().save(*args, **kwargs)
	
	class Meta:
		verbose_name = "Order Item"
		verbose_name_plural = "Order Items"


class ContactMessage(models.Model):
	SUBJECT_CHOICES = [
		('order_inquiry', 'Order Inquiry'),
		('product_support', 'Product Support'),
		('plant_care', 'Plant Care Advice'),
		('general', 'General Question'),
		('complaint', 'Complaint'),
		('partnership', 'Partnership Inquiry'),
	]
	
	name = models.CharField(max_length=100)
	email = models.EmailField()
	subject = models.CharField(max_length=50, choices=SUBJECT_CHOICES)
	message = models.TextField()
	created_at = models.DateTimeField(auto_now_add=True)
	is_read = models.BooleanField(default=False)
	status = models.CharField(max_length=20, choices=[
		('new', 'New'),
		('in_progress', 'In Progress'),
		('resolved', 'Resolved'),
		('closed', 'Closed')
	], default='new')
	
	class Meta:
		ordering = ['-created_at']
		verbose_name = 'Contact Message'
		verbose_name_plural = 'Contact Messages'
	
	def __str__(self):
		return f"{self.name} - {self.subject} ({self.created_at.strftime('%Y-%m-%d')})"


class CustomerSuggestion(models.Model):
	"""Suggestions/opinions shared by customers on magazine page"""
	user = models.ForeignKey(DjangoUser, on_delete=models.CASCADE, related_name='suggestions')
	content = models.TextField()
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
	is_public = models.BooleanField(default=True)
	
	def __str__(self):
		return f"Suggestion by {self.user.username} on {self.created_at.strftime('%Y-%m-%d')}"
	
	class Meta:
		ordering = ['-created_at']
		verbose_name = 'Customer Suggestion'
		verbose_name_plural = 'Customer Suggestions'
