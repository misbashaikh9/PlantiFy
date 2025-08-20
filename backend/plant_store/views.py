from django.shortcuts import render
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db import transaction
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from decimal import Decimal
from django.contrib.contenttypes.models import ContentType
from .models import UserProfile, Category, Product, Cart, CartItem, Order, OrderItem, UserAddress, ContactMessage, CustomerSuggestion, Comment, UserVote
from .serializers import (
    UserSerializer, UserProfileSerializer, CategorySerializer, ProductSerializer,
    CartSerializer, CartItemSerializer, OrderSerializer, OrderItemSerializer,
    UserRegistrationSerializer, LoginSerializer, UserAddressSerializer, ContactMessageSerializer,
    CustomerSuggestionSerializer, CommentSerializer
)
from .email_service import send_order_confirmation, send_contact_notification_email, send_contact_confirmation_email

# Create your views here.

class UserRegistrationView(APIView):
    """User registration API endpoint"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Create user profile using Django ORM
            UserProfile.objects.create(
                user=user,
                plant_experience='beginner'
            )
            
            # Create shopping cart using Django ORM
            Cart.objects.create(user=user)
            
            return Response({
                'message': 'User registered successfully',
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    """User login API endpoint"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            
            user = authenticate(username=username, password=password)
            if user:
                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)
                refresh_token = str(refresh)
                
                # Also do session login for compatibility
                login(request, user)
                
                return Response({
                    'message': 'Login successful',
                    'user': UserSerializer(user).data,
                    'access_token': access_token,
                    'refresh_token': refresh_token
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Invalid credentials'
                }, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLogoutView(APIView):
    """User logout API endpoint"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        logout(request)
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)


class TokenRefreshView(APIView):
    """JWT token refresh endpoint"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if not refresh_token:
                return Response({'error': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            
            return Response({
                'access_token': access_token
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Invalid refresh token'}, status=status.HTTP_401_UNAUTHORIZED)


class CategoryListView(generics.ListAPIView):
    """List all product categories"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class ProductListView(generics.ListAPIView):
    """List all products with optional filtering"""
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None  # Disable pagination for this view
    
    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True)
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category__name=category)
        
        # Filter by plant type
        plant_type = self.request.query_params.get('plant_type', None)
        if plant_type:
            queryset = queryset.filter(plant_type=plant_type)
        
        # Filter by care level
        care_level = self.request.query_params.get('care_level', None)
        if care_level:
            queryset = queryset.filter(care_level=care_level)
        
        return queryset


class ProductDetailView(generics.RetrieveAPIView):
    """Get detailed product information"""
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]


class CartView(APIView):
    """Shopping cart operations"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Get user's cart with items"""
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    
    def post(self, request):
        """Add item to cart"""
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)
        
        try:
            product = Product.objects.get(id=product_id, is_active=True)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        
        cart, created = Cart.objects.get_or_create(user=request.user)
        print(f"CartView - Cart created: {created}, Cart ID: {cart.id}")  # Debug log
        
        # Check if item already in cart
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )
        
        if not created:
            cart_item.quantity += quantity
            cart_item.save()
        
        print(f"CartView - Cart item created: {created}, Item ID: {cart_item.id}, Product: {product.name}")  # Debug log
        
        # Verify cart has items
        cart.refresh_from_db()
        print(f"CartView - Final cart items count: {cart.items.count()}")  # Debug log
        
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    
    def delete(self, request):
        """Clear all items from cart"""
        try:
            cart = Cart.objects.get(user=request.user)
            cart.items.all().delete()
            print(f"CartView - Cart cleared for user {request.user.id}")  # Debug log
            return Response({'message': 'Cart cleared successfully'}, status=status.HTTP_200_OK)
        except Cart.DoesNotExist:
            return Response({'message': 'Cart is already empty'}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"CartView - Error clearing cart: {str(e)}")  # Debug log
            return Response({'error': 'Failed to clear cart'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CartItemUpdateView(APIView):
    """Update cart item quantity or remove item"""
    permission_classes = [permissions.IsAuthenticated]
    
    def put(self, request, item_id):
        """Update cart item quantity"""
        try:
            cart_item = CartItem.objects.get(id=item_id, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)
        
        quantity = request.data.get('quantity', 1)
        if quantity <= 0:
            cart_item.delete()
        else:
            cart_item.quantity = quantity
            cart_item.save()
        
        cart = Cart.objects.get(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    
    def delete(self, request, item_id):
        """Remove item from cart"""
        try:
            cart_item = CartItem.objects.get(id=item_id, cart__user=request.user)
            cart_item.delete()
        except CartItem.DoesNotExist:
            return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)
        
        cart = Cart.objects.get(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)


class CartSyncView(APIView):
    """Sync frontend cart with backend cart"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            print(f"Cart sync request data: {request.data}")  # Debug log
            
            # Get or create cart for the user
            cart, created = Cart.objects.get_or_create(user=request.user)
            print(f"Cart sync - Cart created: {created}, Cart ID: {cart.id}")  # Debug log
            
            # Get cart items from request
            frontend_cart_items = request.data.get('cart_items', [])
            print(f"Frontend cart items: {frontend_cart_items}")  # Debug log
            
            if not frontend_cart_items:
                return Response({'error': 'No cart items provided'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Clear existing cart items
            cart.items.all().delete()
            
            # Add new cart items
            for item_data in frontend_cart_items:
                try:
                    # Handle both 'id' and 'product_id' fields for compatibility
                    product_id = item_data.get('id') or item_data.get('product_id')
                    if not product_id:
                        print(f"No product ID found in item data: {item_data}")  # Debug log
                        continue
                        
                    product = Product.objects.get(id=product_id)
                    cart_item = CartItem.objects.create(
                        cart=cart,
                        product=product,
                        quantity=item_data['quantity']
                    )
                    print(f"Created cart item: {cart_item.id} for product {product.name}")  # Debug log
                except Product.DoesNotExist:
                    print(f"Product not found: {product_id}")  # Debug log
                    continue
            
            # Verify cart was created with items
            cart.refresh_from_db()
            print(f"Final cart items count: {cart.items.count()}")  # Debug log
            
            if not cart.items.exists():
                return Response({'error': 'Failed to create cart items'}, status=status.HTTP_400_BAD_REQUEST)
            
            serializer = CartSerializer(cart)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"Cart sync error: {str(e)}")  # Debug log
            return Response({'error': f'Cart sync failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class OrderCreateView(APIView):
    """Create new order from cart"""
    permission_classes = [permissions.IsAuthenticated]
    
    @transaction.atomic
    def post(self, request):
        try:
            print(f"Order creation request data: {request.data}")  # Debug log
            
            # Get or create cart for the user
            cart, created = Cart.objects.get_or_create(user=request.user)
            print(f"Cart created: {created}, Cart ID: {cart.id}")  # Debug log
            
            # Debug: Check all cart items for this user
            all_cart_items = CartItem.objects.filter(cart__user=request.user)
            print(f"All cart items for user {request.user.id}: {all_cart_items.count()}")
            for item in all_cart_items:
                print(f"  - Cart Item {item.id}: Product {item.product.name}, Quantity {item.quantity}")
            
            cart_items = cart.items.all()
            print(f"Cart items count: {cart_items.count()}")  # Debug log
            
            if not cart_items.exists():
                return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Calculate totals with GST
            subtotal = sum(item.get_total_price() for item in cart_items)
            gst_rate = Decimal('0.08')  # 8% GST
            gst_amount = subtotal * gst_rate
            shipping_cost = Decimal('0.00')  # Free shipping
            total_amount = subtotal + gst_amount + shipping_cost
            
            print(f"Subtotal: {subtotal}, GST (8%): {gst_amount}, Total: {total_amount}")  # Debug log
            
            print(f"Final Total: {total_amount}, Tax: {gst_amount}, Shipping: {shipping_cost}")  # Debug log
            
            # Validate required shipping data
            required_fields = ['shipping_address', 'shipping_city', 'shipping_state', 'shipping_zip', 'shipping_country', 'contact_phone']
            missing_fields = [field for field in required_fields if not request.data.get(field)]
            
            if missing_fields:
                return Response({
                    'error': f'Missing required fields: {", ".join(missing_fields)}'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Create order
            order = Order.objects.create(
                user=request.user,
                subtotal=subtotal,
                tax=gst_amount,  # Store GST amount
                shipping_cost=shipping_cost,
                total_amount=total_amount,
                shipping_address=request.data.get('shipping_address'),
                shipping_city=request.data.get('shipping_city'),
                shipping_state=request.data.get('shipping_state'),
                shipping_zip=request.data.get('shipping_zip'),
                shipping_country=request.data.get('shipping_country'),
                contact_phone=request.data.get('contact_phone'),
                customer_email=request.data.get('customer_email', ''),
                payment_method=request.data.get('payment_method', 'cod')
            )
            
            print(f"Order created with ID: {order.id}")  # Debug log
            
            # Create order items
            for cart_item in cart_items:
                try:
                    print(f"Creating order item for product: {cart_item.product.name}")  # Debug log
                    print(f"Product image: {cart_item.product.image}")  # Debug log
                    
                    OrderItem.objects.create(
                        order=order,
                        product=cart_item.product,
                        product_name=cart_item.product.name,
                        quantity=cart_item.quantity,
                        unit_price=cart_item.product.sale_price or cart_item.product.price,
                        total_price=cart_item.get_total_price()
                    )
                    print(f"Order item created successfully for {cart_item.product.name}")  # Debug log
                except Exception as e:
                    print(f"Error creating order item for {cart_item.product.name}: {str(e)}")  # Debug log
                    raise e
            
            print(f"Order items created: {order.items.count()}")  # Debug log
            
            # Clear cart
            cart.items.all().delete()
            
            # Send order confirmation email
            try:
                from .email_service import send_order_confirmation
                
                # Prepare order data for email
                order_data = {
                    'order_number': order.order_number,
                    'order_date': order.created_at.strftime('%B %d, %Y'),
                    'subtotal': f"₹{order.subtotal:,.2f}",
                    'gst_amount': f"₹{order.tax:,.2f}",
                    'total_amount': f"₹{order.total_amount:,.2f}",
                    'payment_method': request.data.get('payment_method', 'Online Payment'),
                    'shipping_address': f"{order.shipping_address}, {order.shipping_city}, {order.shipping_state} {order.shipping_zip}, {order.shipping_country}",
                    'items': [
                        {
                            'name': item.product_name,
                            'quantity': item.quantity,
                            'price': f"₹{item.unit_price:,.2f}",
                            'total': f"₹{item.total_price:,.2f}"
                        } for item in order.items.all()
                    ]
                }
                
                # Debug logging for email data
                print(f"📧 Email data prepared:")
                print(f"   Order: {order_data['order_number']}")
                print(f"   Items count: {len(order_data['items'])}")
                for i, item in enumerate(order_data['items']):
                    print(f"   Item {i+1}: {item['name']} x{item['quantity']} @ {item['price']} = {item['total']}")
                
                # Send email
                email_sent = send_order_confirmation(
                    order_data=order_data,
                    customer_email=request.user.email,
                    customer_name=request.user.get_full_name() or request.user.username
                )
                
                if email_sent:
                    print(f"✅ Order confirmation email sent successfully to {request.user.email}")
                else:
                    print(f"❌ Failed to send order confirmation email to {request.user.email}")
                    
            except Exception as email_error:
                print(f"⚠️ Email error (non-critical): {str(email_error)}")
                # Don't fail the order creation if email fails
            
            serializer = OrderSerializer(order)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Cart.DoesNotExist:
            return Response({'error': 'Cart not found'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Order creation error: {str(e)}")  # Debug log
            print(f"Error type: {type(e)}")  # Debug log
            import traceback
            print(f"Full traceback: {traceback.format_exc()}")  # Debug log
            return Response({'error': f'Order creation failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class OrderListView(generics.ListAPIView):
    """List user's orders"""
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')


class OrderDetailView(generics.RetrieveAPIView):
    """Get detailed order information"""
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class OrderEmailView(APIView):
    """Send order confirmation emails"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Send order confirmation email"""
        try:
            # Get order data from request
            order_data = request.data
            customer_email = order_data.get('customer_email')
            customer_name = order_data.get('customer_name')
            
            if not customer_email:
                return Response({'error': 'Customer email is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Import email service
            from .email_service import send_order_confirmation
            
            # Send email
            email_sent = send_order_confirmation(
                order_data=order_data,
                customer_email=customer_email,
                customer_name=customer_name
            )
            
            if email_sent:
                return Response({
                    'message': 'Order confirmation email sent successfully',
                    'email_sent': True
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Failed to send email',
                    'email_sent': False
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        except Exception as e:
            print(f"Error in OrderEmailView: {str(e)}")
            return Response({
                'error': 'Internal server error',
                'email_sent': False
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# API endpoints for testing
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def api_test(request):
    """Test API endpoint"""
    return Response({
        'message': 'Plant Store API is working!',
        'status': 'success'
    })


# Address Management Views
class UserAddressListView(APIView):
    """Get all addresses for the current user"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        addresses = UserAddress.objects.filter(user=request.user, is_active=True)
        serializer = UserAddressSerializer(addresses, many=True)
        return Response(serializer.data)


class UserAddressCreateView(APIView):
    """Create a new address for the current user"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = UserAddressSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserAddressUpdateView(APIView):
    """Update an existing address"""
    permission_classes = [IsAuthenticated]
    
    def put(self, request, address_id):
        try:
            address = UserAddress.objects.get(id=address_id, user=request.user)
            serializer = UserAddressSerializer(address, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except UserAddress.DoesNotExist:
            return Response({'error': 'Address not found'}, status=status.HTTP_404_NOT_FOUND)


class UserAddressDeleteView(APIView):
    """Delete an address (soft delete by setting is_active=False)"""
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, address_id):
        try:
            address = UserAddress.objects.get(id=address_id, user=request.user)
            address.is_active = False
            address.save()
            return Response({'message': 'Address deleted successfully'})
        except UserAddress.DoesNotExist:
            return Response({'error': 'Address not found'}, status=status.HTTP_404_NOT_FOUND)


class UserAddressSetDefaultView(APIView):
    """Set an address as default"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, address_id):
        try:
            address = UserAddress.objects.get(id=address_id, user=request.user)
            address.is_default = True
            address.save()  # This will automatically unset other addresses as default
            return Response({'message': 'Default address updated successfully'})
        except UserAddress.DoesNotExist:
            return Response({'error': 'Address not found'}, status=status.HTTP_404_NOT_FOUND)


class ContactFormView(APIView):
    permission_classes = []  # Allow anyone to submit contact form
    
    def post(self, request):
        try:
            serializer = ContactMessageSerializer(data=request.data)
            if serializer.is_valid():
                # Save contact message to database
                contact_message = serializer.save()
                
                # Debug: Print contact message details
                print(f"🔍 DEBUG: Contact message created with email: {contact_message.email}")
                print(f"🔍 DEBUG: Contact message name: {contact_message.name}")
                print(f"🔍 DEBUG: Contact message subject: {contact_message.subject}")
                
                # Send notification email to admin (you)
                admin_email = 'plantify.orders@gmail.com'  # Your email
                print(f"🔍 DEBUG: Sending admin notification to: {admin_email}")
                send_contact_notification_email(contact_message, admin_email)
                
                # Send confirmation email to customer
                print(f"🔍 DEBUG: About to send confirmation email to customer: {contact_message.email}")
                send_contact_confirmation_email(contact_message)
                
                return Response({
                    'success': True,
                    'message': 'Your message has been sent successfully! We will get back to you soon.',
                    'contact_id': contact_message.id
                }, status=status.HTTP_201_CREATED)
            else:
                return Response({
                    'success': False,
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            return Response({
                'success': False,
                'message': 'An error occurred while sending your message. Please try again.',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserOrderHistoryView(APIView):
    """Fetch user's order history for Buy Again section"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            from datetime import date
            
            user = request.user
            print(f"DEBUG: User {user.username} requesting order history")
            print(f"DEBUG: User ID: {user.id}")
            print(f"DEBUG: User is authenticated: {user.is_authenticated}")
            
            # Simple test first - just return basic info
            try:
                # Get all orders for the user, ordered by most recent first
                orders = Order.objects.filter(user=user).order_by('-created_at')
                print(f"DEBUG: Found {orders.count()} orders for user")
                
                # Also check all orders in the system
                all_orders = Order.objects.all()
                print(f"DEBUG: Total orders in system: {all_orders.count()}")
                
                buy_again_items = []
                
                if orders.count() > 0:
                    print(f"DEBUG: Processing {orders.count()} orders")
                    for order in orders:
                        print(f"DEBUG: Order {order.id} has {order.items.count()} items")
                        
                        for order_item in order.items.all():
                            try:
                                # Use the stored order data instead of trying to access the product
                                print(f"DEBUG: OrderItem: {order_item.product_name} - Price: {order_item.unit_price}")
                                
                                # Try to get the real product for image and category
                                try:
                                    real_product = order_item.product
                                    print(f"DEBUG: Real product found: {real_product.name}")
                                    image_url = real_product.image.url if real_product.image else '🌱'
                                    category_name = real_product.category.name if real_product.category else 'General'
                                except Exception as product_error:
                                    print(f"DEBUG: Could not access real product: {product_error}")
                                    image_url = '🌱'
                                    category_name = 'General'
                                
                                buy_again_items.append({
                                    'id': order_item.id,  # Use order item ID to avoid duplicates
                                    'name': order_item.product_name,  # Use stored name
                                    'image': image_url,  # Use real product image if available
                                    'price': float(order_item.unit_price),  # Use stored price
                                    'last_ordered': 'Recently',
                                    'order_count': 1,
                                    'category': category_name
                                })
                                
                                if len(buy_again_items) >= 3:  # Limit to 3 for testing
                                    break
                                    
                            except Exception as product_error:
                                print(f"ERROR processing product: {product_error}")
                                continue
                        
                        if len(buy_again_items) >= 3:
                            break
                
                print(f"DEBUG: Final result - {len(buy_again_items)} items to return")
                return Response({
                    'success': True,
                    'buy_again_items': buy_again_items
                }, status=status.HTTP_200_OK)
                
            except Exception as order_error:
                print(f"ERROR processing orders: {order_error}")
                return Response({
                    'success': False,
                    'error': f"Order processing error: {str(order_error)}"
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        except Exception as e:
            print(f"ERROR in UserOrderHistoryView: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        except Exception as e:
            print(f"ERROR in UserOrderHistoryView: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ProfileUpdateView(APIView):
    """Update user profile information"""
    permission_classes = [IsAuthenticated]
    
    def put(self, request):
        try:
            user = request.user
            profile, created = UserProfile.objects.get_or_create(user=user)
            
            # Update user fields
            if 'first_name' in request.data:
                user.first_name = request.data['first_name']
            if 'last_name' in request.data:
                user.last_name = request.data['last_name']
            if 'email' in request.data:
                user.email = request.data['email']
            
            user.save()
            
            # Update profile fields
            if 'phone' in request.data:
                profile.phone = request.data['phone']
            if 'date_of_birth' in request.data and request.data['date_of_birth']:
                # Only update if date is not empty
                profile.date_of_birth = request.data['date_of_birth']
            if 'plant_experience' in request.data:
                profile.plant_experience = request.data['plant_experience']
            if 'preferred_plant_types' in request.data:
                profile.preferred_plant_types = request.data['preferred_plant_types']
            if 'newsletter_subscription' in request.data:
                profile.newsletter_subscription = request.data['newsletter_subscription']
            
            profile.save()
            
            # Return updated user data
            serializer = UserSerializer(user)
            return Response({
                'message': 'Profile updated successfully',
                'user': serializer.data
            })
            
        except Exception as e:
            print(f"Profile update error: {e}")
            return Response(
                {'error': 'Failed to update profile'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ProfileChangePasswordView(APIView):
    """Change user password"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            user = request.user
            current_password = request.data.get('current_password')
            new_password = request.data.get('new_password')
            
            if not current_password or not new_password:
                return Response(
                    {'error': 'Current password and new password are required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Verify current password
            if not user.check_password(current_password):
                return Response(
                    {'error': 'Current password is incorrect'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Set new password
            user.set_password(new_password)
            user.save()
            
            return Response({'message': 'Password changed successfully'})
            
        except Exception as e:
            print(f"Password change error: {e}")
            return Response(
                {'error': 'Failed to change password'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ProfileDetailView(APIView):
    """Get user profile details"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            user = request.user
            profile, created = UserProfile.objects.get_or_create(user=user)
            
            serializer = UserSerializer(user)
            profile_serializer = UserProfileSerializer(profile)
            
            return Response({
                'user': serializer.data,
                'profile': profile_serializer.data
            })
            
        except Exception as e:
            print(f"Profile fetch error: {e}")
            return Response(
                {'error': 'Failed to fetch profile'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CustomerSuggestionListCreateView(APIView):
    """List all public suggestions; authenticated users can create suggestions"""
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        qs = CustomerSuggestion.objects.filter(is_public=True).select_related('user').order_by('-created_at')
        serializer = CustomerSuggestionSerializer(qs, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        if not request.user or not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        content = request.data.get('content', '')
        if not content or len(content.strip()) < 3:
            return Response({'error': 'Please write a longer suggestion.'}, status=status.HTTP_400_BAD_REQUEST)
        
        suggestion = CustomerSuggestion.objects.create(
            user=request.user,
            content=content.strip(),
            is_public=True
        )
        serializer = CustomerSuggestionSerializer(suggestion)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SuggestionLikeDislikeView(APIView):
	"""Like or dislike a suggestion with toggle functionality"""
	permission_classes = [IsAuthenticated]
	
	def post(self, request, suggestion_id):
		try:
			suggestion = CustomerSuggestion.objects.get(id=suggestion_id, is_public=True)
			action = request.data.get('action')  # 'like' or 'dislike'
			
			if action not in ['like', 'dislike']:
				return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)
			
			# Check if user already voted
			existing_vote = UserVote.objects.filter(
				user=request.user,
				content_type=ContentType.objects.get_for_model(CustomerSuggestion),
				object_id=suggestion_id
			).first()
			
			if existing_vote:
				if existing_vote.vote_type == action:
					# User is clicking the same button - remove the vote
					if action == 'like':
						suggestion.likes = max(0, suggestion.likes - 1)
					else:
						suggestion.dislikes = max(0, suggestion.dislikes - 1)
					existing_vote.delete()
					message = f'Removed {action}'
				else:
					# User is changing their vote - update counts
					if existing_vote.vote_type == 'like':
						suggestion.likes = max(0, suggestion.likes - 1)
					else:
						suggestion.dislikes = max(0, suggestion.dislikes - 1)
					
					if action == 'like':
						suggestion.likes += 1
					else:
						suggestion.dislikes += 1
					
					existing_vote.vote_type = action
					existing_vote.save()
					message = f'Changed to {action}'
			else:
				# User is voting for the first time
				if action == 'like':
					suggestion.likes += 1
				else:
					suggestion.dislikes += 1
				
				UserVote.objects.create(
					user=request.user,
					content_type=ContentType.objects.get_for_model(CustomerSuggestion),
					object_id=suggestion_id,
					vote_type=action
				)
				message = f'{action.capitalize()}d successfully'
			
			suggestion.save()
			
			return Response({
				'message': message,
				'likes': suggestion.likes,
				'dislikes': suggestion.dislikes,
				'user_vote': action if existing_vote and existing_vote.vote_type == action else None
			})
				
		except CustomerSuggestion.DoesNotExist:
			return Response({'error': 'Suggestion not found'}, status=status.HTTP_404_NOT_FOUND)
		except Exception as e:
			return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CommentLikeDislikeView(APIView):
	"""Like or dislike a comment with toggle functionality"""
	permission_classes = [IsAuthenticated]
	
	def post(self, request, comment_id):
		try:
			comment = Comment.objects.get(id=comment_id)
			action = request.data.get('action')  # 'like' or 'dislike'
			
			if action not in ['like', 'dislike']:
				return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)
			
			# Check if user already voted
			existing_vote = UserVote.objects.filter(
				user=request.user,
				content_type=ContentType.objects.get_for_model(Comment),
				object_id=comment_id
			).first()
			
			if existing_vote:
				if existing_vote.vote_type == action:
					# User is clicking the same button - remove the vote
					if action == 'like':
						comment.likes = max(0, comment.likes - 1)
					else:
						comment.dislikes = max(0, comment.dislikes - 1)
					existing_vote.delete()
					message = f'Removed {action}'
				else:
					# User is changing their vote - update counts
					if existing_vote.vote_type == 'like':
						comment.likes = max(0, comment.likes - 1)
					else:
						comment.dislikes = max(0, comment.dislikes - 1)
					
					if action == 'like':
						comment.likes += 1
					else:
						comment.dislikes += 1
					
					existing_vote.vote_type = action
					existing_vote.save()
					message = f'Changed to {action}'
			else:
				# User is voting for the first time
				if action == 'like':
					comment.likes += 1
				else:
					comment.dislikes += 1
				
				UserVote.objects.create(
					user=request.user,
					content_type=ContentType.objects.get_for_model(Comment),
					object_id=comment_id,
					vote_type=action
				)
				message = f'{action.capitalize()}d successfully'
			
			comment.save()
			
			return Response({
				'message': message,
				'likes': comment.likes,
				'dislikes': comment.dislikes,
				'user_vote': action if existing_vote and existing_vote.vote_type == action else None
			})
				
		except Comment.DoesNotExist:
			return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)
		except Exception as e:
			return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CommentCreateView(APIView):
    """Create a comment on a suggestion or reply to a comment"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, suggestion_id=None, comment_id=None):
        try:
            content = request.data.get('content', '')
            
            if not content or len(content.strip()) < 3:
                return Response({'error': 'Please write a longer comment.'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Determine if this is a reply to a comment or a new comment on a suggestion
            if comment_id:
                # This is a reply to a comment
                try:
                    parent_comment = Comment.objects.get(id=comment_id)
                    suggestion = parent_comment.suggestion
                except Comment.DoesNotExist:
                    return Response({'error': 'Parent comment not found'}, status=status.HTTP_404_NOT_FOUND)
            elif suggestion_id:
                # This is a new comment on a suggestion
                try:
                    suggestion = CustomerSuggestion.objects.get(id=suggestion_id, is_public=True)
                    parent_comment = None
                except CustomerSuggestion.DoesNotExist:
                    return Response({'error': 'Suggestion not found'}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({'error': 'Either suggestion_id or comment_id is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            comment = Comment.objects.create(
                user=request.user,
                suggestion=suggestion,
                content=content.strip(),
                parent_comment=parent_comment
            )
            
            # Return comment data
            return Response({
                'id': comment.id,
                'content': comment.content,
                'user': {
                    'first_name': comment.user.first_name,
                    'username': comment.user.username
                },
                'created_at': comment.created_at,
                'likes': comment.likes,
                'dislikes': comment.dislikes,
                'parent_comment_id': parent_comment.id if parent_comment else None
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
