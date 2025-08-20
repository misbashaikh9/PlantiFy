"""
Email service for PlantiFy plant store
Handles sending order confirmation emails and other notifications
"""

import os
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from datetime import datetime


class EmailService:
    """Service class for sending emails"""
    
    @staticmethod
    def send_order_confirmation_email(order_data, customer_email, customer_name):
        """
        Send order confirmation email to customer
        
        Args:
            order_data (dict): Order information
            customer_email (str): Customer's email address
            customer_name (str): Customer's name
        """
        try:
            # Prepare email context
            context = {
                'customer_name': customer_name,
                'order_number': order_data.get('order_number', 'N/A'),
                'order_date': datetime.now().strftime('%B %d, %Y'),
                'total_amount': order_data.get('total_amount', 'N/A'),
                'payment_method': order_data.get('payment_method', 'N/A'),
                'shipping_address': order_data.get('shipping_address', 'N/A'),
                'items': order_data.get('items', []),
                
                # Company information
                'company_address': '123 Garden Street, Green City, GC 12345',
                'company_email': 'plantify.orders@gmail.com',
                'company_phone': '+91 98765 43210',
                'website_url': 'http://localhost:3000',
                'support_url': 'http://localhost:3000/support',
                'privacy_url': 'http://localhost:3000/privacy',
                'order_tracking_url': f"http://localhost:3000/orders/{order_data.get('order_number', '')}",
                'store_url': 'http://localhost:3000/store',
            }
            
            # Render HTML email template
            html_content = render_to_string('emails/order_confirmation.html', context)
            
            # Create plain text version
            text_content = strip_tags(html_content)
            
            # Create email message
            subject = f'Order Confirmation - #{order_data.get("order_number", "N/A")} - PlantiFy'
            
            email = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[customer_email]
            )
            
            # Attach HTML version
            email.attach_alternative(html_content, "text/html")
            
            # Send email
            email.send()
            
            print(f"✅ Order confirmation email sent successfully to {customer_email}")
            return True
            
        except Exception as e:
            print(f"❌ Error sending order confirmation email: {str(e)}")
            return False
    
    @staticmethod
    def send_welcome_email(customer_email, customer_name):
        """
        Send welcome email to new customers
        
        Args:
            customer_email (str): Customer's email address
            customer_name (str): Customer's name
        """
        try:
            subject = f'Welcome to PlantiFy, {customer_name}! 🌱'
            
            # Simple welcome message for now
            message = f"""
            Hi {customer_name},
            
            Welcome to PlantiFy! We're excited to have you join our plant-loving community.
            
            Start exploring our collection of beautiful plants and gardening accessories.
            
            Happy planting!
            The PlantiFy Team
            """
            
            email = EmailMultiAlternatives(
                subject=subject,
                body=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[customer_email]
            )
            
            email.send()
            
            print(f"✅ Welcome email sent successfully to {customer_email}")
            return True
            
        except Exception as e:
            print(f"❌ Error sending welcome email: {str(e)}")
            return False
    
    @staticmethod
    def send_password_reset_email(customer_email, reset_url):
        """
        Send password reset email
        
        Args:
            customer_email (str): Customer's email address
            reset_url (str): Password reset URL
        """
        try:
            subject = 'Password Reset Request - PlantiFy'
            
            message = f"""
            Hi there,
            
            You requested a password reset for your PlantiFy account.
            
            Click the link below to reset your password:
            {reset_url}
            
            If you didn't request this, please ignore this email.
            
            Best regards,
            The PlantiFy Team
            """
            
            email = EmailMultiAlternatives(
                subject=subject,
                body=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[customer_email]
            )
            
            email.send()
            
            print(f"✅ Password reset email sent successfully to {customer_email}")
            return True
            
        except Exception as e:
            print(f"❌ Error sending password reset email: {str(e)}")
            return False
    
    @staticmethod
    def send_contact_notification_email(contact_message, admin_email):
        """Send notification email to admin when contact form is submitted"""
        try:
            subject = f"New Contact Message: {contact_message.get_subject_display()} - PlantiFy"
            
            # Render HTML template
            html_content = render_to_string('emails/contact_notification.html', {
                'contact_message': contact_message
            })
            
            # Create plain text version
            text_content = strip_tags(html_content)
            
            # Create email
            email = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[admin_email]
            )
            
            email.attach_alternative(html_content, "text/html")
            email.send()
            
            print(f"✅ Contact notification email sent to admin: {admin_email}")
            return True
            
        except Exception as e:
            print(f"❌ Error sending contact notification email: {str(e)}")
            return False

    @staticmethod
    def send_contact_confirmation_email(contact_message):
        """Send confirmation email to customer when contact form is submitted"""
        try:
            subject = f"Message Received - PlantiFy"
            
            # Debug: Print the email address being used
            customer_email = contact_message.email
            print(f"🔍 DEBUG: Sending confirmation email to customer: {customer_email}")
            print(f"🔍 DEBUG: Contact message object: {contact_message}")
            print(f"🔍 DEBUG: Contact message email field: {contact_message.email}")
            
            # Render HTML template
            html_content = render_to_string('emails/contact_confirmation.html', {
                'contact_message': contact_message
            })
            
            # Create plain text version
            text_content = strip_tags(html_content)
            
            # Create email
            email = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[customer_email]
            )
            
            # Debug: Print email details
            print(f"🔍 DEBUG: Email 'to' field: {email.to}")
            print(f"🔍 DEBUG: Email 'from' field: {email.from_email}")
            
            email.attach_alternative(html_content, "text/html")
            email.send()
            
            print(f"✅ Contact confirmation email sent to customer: {customer_email}")
            return True
            
        except Exception as e:
            print(f"❌ Error sending contact confirmation email: {str(e)}")
            return False
    
    @staticmethod
    def test_email_connection():
        """
        Test if email configuration is working
        """
        try:
            # Try to send a test email to ourselves
            test_email = EmailMultiAlternatives(
                subject='Test Email - PlantiFy Email System',
                body='This is a test email to verify the email system is working correctly.',
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[settings.DEFAULT_FROM_EMAIL]
            )
            
            test_email.send()
            print("✅ Email system test successful! Configuration is working.")
            return True
            
        except Exception as e:
            print(f"❌ Email system test failed: {str(e)}")
            print("Please check your email configuration in settings.py")
            return False


# Convenience functions
def send_order_confirmation(order_data, customer_email, customer_name):
    """Convenience function to send order confirmation"""
    return EmailService.send_order_confirmation_email(order_data, customer_email, customer_name)


def send_welcome_email_to_customer(customer_email, customer_name):
    """Convenience function to send welcome email"""
    return EmailService.send_welcome_email(customer_email, customer_name)


def test_email_system():
    """Convenience function to test email system"""
    return EmailService.test_email_connection()


def send_contact_notification_email(contact_message, admin_email):
    return EmailService.send_contact_notification_email(contact_message, admin_email)

def send_contact_confirmation_email(contact_message):
    return EmailService.send_contact_confirmation_email(contact_message)

