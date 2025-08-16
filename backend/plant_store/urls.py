from django.urls import path
from . import views

app_name = 'plant_store'

urlpatterns = [
    # User Authentication
    path('api/register/', views.UserRegistrationView.as_view(), name='user_register'),
    path('api/login/', views.UserLoginView.as_view(), name='user_login'),
    path('api/logout/', views.UserLogoutView.as_view(), name='user_logout'),
    
    # Product Catalog
    path('api/categories/', views.CategoryListView.as_view(), name='category_list'),
    path('api/products/', views.ProductListView.as_view(), name='product_list'),
    path('api/products/<int:pk>/', views.ProductDetailView.as_view(), name='product_detail'),
    
    # Shopping Cart
    path('api/cart/', views.CartView.as_view(), name='cart'),
    path('api/cart/items/<int:item_id>/', views.CartItemUpdateView.as_view(), name='cart_item_update'),
    
    # Orders
    path('api/orders/', views.OrderListView.as_view(), name='order_list'),
    path('api/orders/create/', views.OrderCreateView.as_view(), name='order_create'),
    path('api/orders/<int:pk>/', views.OrderDetailView.as_view(), name='order_detail'),
    
    # Test endpoint
    path('api/test/', views.api_test, name='api_test'),
]



