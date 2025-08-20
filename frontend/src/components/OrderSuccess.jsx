import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import { cartService } from '../services/cartService';
import '../styles/OrderSuccess.css';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const orderData = location.state?.orderData || JSON.parse(localStorage.getItem('lastOrder'));
    if (orderData) {
      setOrderDetails(orderData);
      localStorage.setItem('lastOrder', JSON.stringify(orderData)); // Store as backup
      
      // Send confirmation email
      sendOrderConfirmationEmail(orderData);
    } else {
      // Try to fetch the latest order from the database
      fetchLatestOrder();
    }
  }, [navigate, location]);

  const fetchLatestOrder = async () => {
    try {
      const response = await fetch('http://localhost:8000/plant_store/api/orders/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const orders = await response.json();
        if (orders && orders.length > 0) {
          const latestOrder = orders[0]; // Orders are sorted by created_at desc
          setOrderDetails({
            order_number: latestOrder.order_number,
            total_amount: latestOrder.total_amount,
            payment_method: latestOrder.payment_method,
            items: latestOrder.items || [],
            shipping_address: {
              address_line1: latestOrder.shipping_address,
              city: latestOrder.shipping_city,
              state: latestOrder.shipping_state,
              zip_code: latestOrder.shipping_zip,
              country: latestOrder.shipping_country
            }
          });
        } else {
          navigate('/store');
        }
      } else {
        navigate('/store');
      }
    } catch (error) {
      console.error('Error fetching latest order:', error);
      navigate('/store');
    }
  };

  const sendOrderConfirmationEmail = async (orderData) => {
    try {
      // Get user info from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.email) {
        console.log('No user email found, skipping email');
        return;
      }

      // Prepare items for email (name, qty, price, total)
      const itemsForEmail = (orderData.items || []).map((item) => {
        const unit = Number(item.sale_price ?? item.price ?? item.unit_price ?? 0);
        const qty = Number(item.quantity ?? 1);
        const priceStr = `₹${unit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        const totalStr = `₹${(unit * qty).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        return {
          name: item.name || item.product_name || 'Product',
          quantity: qty,
          price: priceStr,
          total: totalStr,
        };
      });

      // Prepare email data
      const emailData = {
        order_number: orderData.order_number || 'ORDER-' + Date.now(),
        order_date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
        total_amount: orderData.total_amount || orderData.total || 'N/A',
        payment_method: orderData.payment_method || 'Online Payment',
        shipping_address: orderData.shipping_address || 'Address on file',
        items: itemsForEmail,
        customer_name: user.first_name || user.username || 'Valued Customer',
        customer_email: user.email
      };

      // Call backend API to send email
      const response = await fetch('http://localhost:8000/plant_store/api/orders/send-confirmation-email/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(emailData)
      });

      if (response.ok) {
        setEmailSent(true);
        console.log('Order confirmation email sent successfully!');
      } else {
        console.log('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const calculateDeliveryDate = () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 5); // 5 business days
    
    return deliveryDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleViewOrders = () => {
    navigate('/orders');
  };

  const handleContinueShopping = () => {
    navigate('/store');
  };

  const handleDownloadInvoice = () => {
    // Generate and download invoice (placeholder for now)
    const invoiceContent = `
      INVOICE
      
      Order #: ${orderDetails?.order_number || 'N/A'}
      Date: ${new Date().toLocaleDateString()}
      Amount: ₹${orderDetails?.total_amount || 'N/A'}
      
      Thank you for your order!
    `;
    
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${orderDetails?.order_number || 'order'}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!orderDetails) {
    return (
      <div className="order-success-page">
        <Header />
        <div className="loading-message">Loading order details...</div>
      </div>
    );
  }

  return (
    <div className="order-success-page">
      <Header />
      
      <div className="success-container">
        <div className="success-content">
          {/* Success Animation */}
          <div className="success-animation">
            {/* Success Message - Moved to top */}
            <div className="success-message">
              <h1>Order Placed Successfully!</h1>
              <p>Thank you for your purchase. Your order has been confirmed and is being processed.</p>
              {emailSent && (
                <div className="email-sent-notification">
                  Confirmation email sent to your registered email address!
                </div>
              )}
            </div>
            
            {/* Checkmark Icon - Moved to bottom */}
            <div className="checkmark-circle">
              <span className="material-icons checkmark">check</span>
            </div>
          </div>

          {/* Order Details */}
          <div className="order-details-card">
            <h2>
              <span className="material-icons">receipt</span>
              Order Details
            </h2>
            
            {/* Simplified Order Summary */}
            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-info">
                <div className="summary-item">
                  <span className="summary-label">Items:</span>
                  <span className="summary-value">{orderDetails.items?.length || 0} products</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Status:</span>
                  <span className="summary-value status-pending">Processing</span>
                </div>
              </div>
            </div>
            
            <div className="order-info-grid">
              <div className="order-info-item">
                <span className="info-label">Order Number:</span>
                <span className="info-value">#{orderDetails.order_number || 'N/A'}</span>
              </div>
              
              <div className="order-info-item">
                <span className="info-label">Order Date:</span>
                <span className="info-value">{new Date().toLocaleDateString('en-IN')}</span>
              </div>
              
              <div className="order-info-item">
                <span className="info-label">Total Amount:</span>
                <span className="info-value amount">₹{orderDetails.total_amount?.toLocaleString('en-IN') || 'N/A'}</span>
              </div>
              
              <div className="order-info-item">
                <span className="info-label">Payment Method:</span>
                <span className="info-value">{orderDetails.payment_method || 'N/A'}</span>
              </div>

              <div className="order-info-item">
                <span className="info-label">Expected Delivery:</span>
                <span className="info-value delivery-date">{calculateDeliveryDate()}</span>
              </div>
            </div>
          </div>

          {/* What Happens Next */}
          <div className="next-steps-card">
            <h3>
              <span className="material-icons">schedule</span>
              What Happens Next?
            </h3>
            
            <div className="steps-timeline">
              <div className="step">
                <div className="step-icon">
                  <span className="material-icons">email</span>
                </div>
                <div className="step-content">
                  <h4>Order Confirmation</h4>
                  <p>You'll receive an email confirmation with order details</p>
                </div>
              </div>
              
              <div className="step">
                <div className="step-icon">
                  <span className="material-icons">inventory</span>
                </div>
                <div className="step-content">
                  <h4>Processing</h4>
                  <p>We'll prepare your plants and accessories for shipping</p>
                </div>
              </div>
              
              <div className="step">
                <div className="step-icon">
                  <span className="material-icons">local_shipping</span>
                </div>
                <div className="step-content">
                  <h4>Shipping</h4>
                  <p>Your order will be shipped within 2-3 business days</p>
                </div>
              </div>
              
              <div className="step">
                <div className="step-icon">
                  <span className="material-icons">home</span>
                </div>
                <div className="step-content">
                  <h4>Delivery</h4>
                  <p>Expected delivery by <strong>{calculateDeliveryDate()}</strong></p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="order-actions">
            <button
              onClick={() => navigate('/orders')}
              className="btn btn-primary"
            >
              View My Orders
            </button>
            <button
              onClick={() => navigate('/store')}
              className="btn btn-outline"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
