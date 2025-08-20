from django.urls import path
from . import views

app_name = 'plant_store'

urlpatterns = [
	# User Authentication
	path('api/register/', views.UserRegistrationView.as_view(), name='user_register'),
	path('api/login/', views.UserLoginView.as_view(), name='user_login'),
	path('api/logout/', views.UserLogoutView.as_view(), name='user_logout'),
	path('api/token/refresh/', views.TokenRefreshView.as_view(), name='token_refresh'),
	
	# Product Catalog
	path('api/categories/', views.CategoryListView.as_view(), name='category_list'),
	path('api/products/', views.ProductListView.as_view(), name='product_list'),
	path('api/products/<int:pk>/', views.ProductDetailView.as_view(), name='product_detail'),
	
	# Shopping Cart
	path('api/cart/', views.CartView.as_view(), name='cart'),
	path('api/cart/items/<int:item_id>/', views.CartItemUpdateView.as_view(), name='cart_item_update'),
	path('api/cart/sync/', views.CartSyncView.as_view(), name='cart_sync'),
	
	# Orders
	path('api/orders/', views.OrderListView.as_view(), name='order_list'),
	path('api/orders/create/', views.OrderCreateView.as_view(), name='order_create'),
	path('api/orders/<int:pk>/', views.OrderDetailView.as_view(), name='order_detail'),
	path('api/orders/send-confirmation-email/', views.OrderEmailView.as_view(), name='order_email'),
	path('api/contact/', views.ContactFormView.as_view(), name='contact_form'),
	
	# Customer Suggestions
	path('api/suggestions/', views.CustomerSuggestionListCreateView.as_view(), name='suggestions_list_create'),
	path('api/suggestions/<int:suggestion_id>/like/', views.SuggestionLikeDislikeView.as_view(), name='suggestion_like_dislike'),
	path('api/suggestions/<int:suggestion_id>/comments/', views.CommentCreateView.as_view(), name='comment_create'),
	
	# Comments
	path('api/comments/<int:comment_id>/like/', views.CommentLikeDislikeView.as_view(), name='comment_like_dislike'),
	path('api/comments/<int:comment_id>/replies/', views.CommentCreateView.as_view(), name='comment_reply'),

	# User Addresses
	path('api/addresses/', views.UserAddressListView.as_view(), name='address_list'),
	path('api/addresses/create/', views.UserAddressCreateView.as_view(), name='address_create'),
	path('api/addresses/<int:address_id>/', views.UserAddressUpdateView.as_view(), name='address_update'),
	path('api/addresses/<int:address_id>/delete/', views.UserAddressDeleteView.as_view(), name='address_delete'),
	path('api/addresses/<int:address_id>/set-default/', views.UserAddressSetDefaultView.as_view(), name='address_set_default'),
	
	# User Profile
	path('api/profile/', views.ProfileDetailView.as_view(), name='profile_detail'),
	path('api/profile/update/', views.ProfileUpdateView.as_view(), name='profile_update'),
	path('api/profile/change-password/', views.ProfileChangePasswordView.as_view(), name='profile_change_password'),
	
	# Test endpoint
	path('api/test/', views.api_test, name='api_test'),
]



