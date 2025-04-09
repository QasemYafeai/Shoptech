
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const emailService = require('../utils/emailService');

// Helper to extract user from token
const getUserFromToken = async (req) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return await User.findById(decoded.id).select('_id');
    }
    return null;
  } catch (error) {
    console.log('Token extraction error:', error.message);
    return null;
  }
};

// @route POST /api/checkout/create-checkout-session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { items, userId } = req.body;
    
    if (!items || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'No items in cart'
      });
    }

    // Try to get user from token if userId wasn't provided
    let authenticatedUserId = userId;
    if (!authenticatedUserId && req.headers.authorization) {
      const user = await getUserFromToken(req);
      if (user) {
        authenticatedUserId = user._id;
      }
    }
    
    console.log("Processing checkout for user:", authenticatedUserId || 'Guest');
    
    // Create line items for Stripe
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.name },
        unit_amount: item.amount // item.amount is already in cents
      },
      quantity: item.quantity
    }));
    
    // Calculate total in cents
    const orderTotal = items.reduce((total, item) => total + (item.amount * item.quantity), 0);
    
    // Create new Order in MongoDB
    // Notice we set 'product: item._id' for each item so that the required `product` field is satisfied.
    const order = new Order({
      user: authenticatedUserId || undefined,
      items: items.map(item => ({
        product: item._id, // <--- IMPORTANT
        name: item.name,
        price: item.amount / 100, // convert cents to dollars
        quantity: item.quantity
      })),
      totalAmount: orderTotal / 100, // convert cents to dollars
      status: 'pending',
      shippingAddress: {
        name: 'Pending',
        street: 'Pending',
        city: 'Pending',
        state: 'Pending',
        postalCode: 'Pending',
        country: 'Pending'
      }
    });
    
    await order.save();
    console.log("Order created with ID:", order._id);
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/success?type=order&title=Order%20Complete&message=Thank%20you%20for%20your%20purchase!&orderId=${order._id}&redirect=/account?tab=orders&time=5000`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/cart`,
      metadata: {
        orderId: order._id.toString()
      }
    });
    
    // Return the session URL
    res.status(200).json({
      success: true,
      url: session.url
    });
  } catch (error) {
    console.error('Checkout session error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating checkout session'
    });
  }
});

// @route POST /api/checkout/webhook
// @desc Stripe webhook for payment events
// @access Public
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
  
  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata.orderId;
    
    try {
      // Update order status
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error(`Order not found: ${orderId}`);
      }
      
      order.status = 'processing';
      order.isPaid = true;
      order.paymentInfo = {
        ...order.paymentInfo,
        paymentId: session.payment_intent,
        paymentStatus: 'completed',
        paidAt: new Date()
      };
      
      await order.save();
      console.log(`Order ${orderId} marked as paid and processing`);
      
      // Send confirmation email if order is associated with a user
      if (order.user) {
        const user = await User.findById(order.user);
        if (user && user.email) {
          await emailService.sendOrderConfirmationEmail(user, order);
        }
      }
      
    } catch (error) {
      console.error('Order processing error:', error);
    }
  }
  
  res.status(200).json({ received: true });
});

// @route GET /api/checkout/success/:orderId
// @desc Update order after successful payment (backup for webhook)
// @access Public
router.get('/success/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Only update if not already paid
    if (!order.isPaid) {
      order.status = 'processing';
      order.isPaid = true;
      order.paymentInfo = {
        ...order.paymentInfo,
        paymentStatus: 'completed',
        paidAt: new Date()
      };
      
      await order.save();
      
      // Send confirmation email if order is associated with a user
      if (order.user) {
        const user = await User.findById(order.user);
        if (user && user.email) {
          await emailService.sendOrderConfirmationEmail(user, order);
        }
      }
    }
    
    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      order
    });
  } catch (error) {
    console.error('Order success update error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating order'
    });
  }
});

module.exports = router;