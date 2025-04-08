// utils/emailService.js
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// Create nodemailer transport
const createTransporter = () => {
  // For development/testing, you can use nodemailer's ethereal email service
  // to avoid setting up a real email account
  if (process.env.NODE_ENV !== 'production') {
    if (!process.env.EMAIL_USER && !process.env.EMAIL_TEST_ACCOUNT) {
      console.warn('Email credentials not found. Using ethereal email for testing.');
      return nodemailer.createTestAccount().then(account => {
        console.log('Ethereal Email Account:', {
          user: account.user,
          pass: account.pass,
          web: nodemailer.getTestMessageUrl({})
        });
        
        return nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: account.user,
            pass: account.pass
          }
        });
      });
    }
  }
  
  // Return configured transporter (production or configured development)
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send verification email
const sendVerificationEmail = async (user, token) => {
  const transporter = createTransporter();
  
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: `"ShopTech" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'Verify Your ShopTech Account',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; background-color: #1a1a1a; color: #ffffff; border-radius: 8px; border: 1px solid #333;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #22c55e;">ShopTech</h1>
        </div>
        <p>Hello ${user.name},</p>
        <p>Thank you for creating an account with ShopTech. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #22c55e; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Verify Email</a>
        </div>
        <p>This verification link will expire in 24 hours.</p>
        <p>If you did not create an account, please ignore this email.</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #333; text-align: center; font-size: 12px; color: #999;">
          <p>© ${new Date().getFullYear()} ShopTech. All rights reserved.</p>
        </div>
      </div>
    `
  };
  
  await transporter.sendMail(mailOptions);
};

// Send password reset email
const sendPasswordResetEmail = async (user, token) => {
  const transporter = createTransporter();
  
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: `"ShopTech" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'Reset Your ShopTech Password',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; background-color: #1a1a1a; color: #ffffff; border-radius: 8px; border: 1px solid #333;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #22c55e;">ShopTech</h1>
        </div>
        <p>Hello ${user.name},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #22c55e; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p>This password reset link will expire in 1 hour.</p>
        <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #333; text-align: center; font-size: 12px; color: #999;">
          <p>© ${new Date().getFullYear()} ShopTech. All rights reserved.</p>
        </div>
      </div>
    `
  };
  
  await transporter.sendMail(mailOptions);
};

/**
 * Send an order confirmation email to the customer
 */
const sendOrderConfirmationEmail = async (user, order) => {
  const transporter = createTransporter();
  
  // Format order items for email
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #333;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #333; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #333; text-align: right;">$${(item.price).toFixed(2)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #333; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');
  
  // Format order number to be shorter and more readable
  const orderNumber = order._id.toString().slice(-8).toUpperCase();
  
  // Format date
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const orderUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/order/${order._id}`;
  
  const mailOptions = {
    from: `"ShopTech" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `ShopTech Order Confirmation #${orderNumber}`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; background-color: #1a1a1a; color: #ffffff; border-radius: 8px; border: 1px solid #333;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #22c55e;">ShopTech</h1>
        </div>
        <h2 style="color: #22c55e; margin-bottom: 20px;">Order Confirmation</h2>
        <p>Hello ${user.name},</p>
        <p>Thank you for your purchase! We've received your order and it's being processed.</p>
        
        <div style="background-color: #222; border-radius: 6px; padding: 15px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Order Number:</strong> #${orderNumber}</p>
          <p style="margin: 8px 0 0;"><strong>Date:</strong> ${orderDate}</p>
        </div>
        
        <h3 style="border-bottom: 1px solid #333; padding-bottom: 10px; margin: 25px 0 15px;">Order Summary</h3>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="border-bottom: 2px solid #333;">
              <th style="padding: 12px; text-align: left;">Product</th>
              <th style="padding: 12px; text-align: center;">Qty</th>
              <th style="padding: 12px; text-align: right;">Price</th>
              <th style="padding: 12px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 12px; text-align: right; font-weight: bold;">Total:</td>
              <td style="padding: 12px; text-align: right; font-weight: bold;">$${order.totalAmount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${orderUrl}" style="background-color: #22c55e; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">View Order Details</a>
        </div>
        
        <p>If you have any questions about your order, please contact our customer support team.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #333; text-align: center; font-size: 12px; color: #999;">
          <p>© ${new Date().getFullYear()} ShopTech. All rights reserved.</p>
        </div>
      </div>
    `
  };
  
  await transporter.sendMail(mailOptions);
};

// Export service functions AFTER they are defined
module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail
};