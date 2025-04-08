'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../AuthContext';
import { useCart } from '../CartContext';

// Define success page type configurations with TypeScript interface
interface TypeConfig {
  [key: string]: {
    title: string;
    message: string;
    icon: React.ReactNode;
    redirectTo: string;
    buttonText: string;
  }
}

const typeConfig: TypeConfig = {
  order: {
    title: 'Order Complete',
    message: 'Thank you for your purchase! Your order has been received.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-green-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    redirectTo: '/account?tab=orders',
    buttonText: 'View Your Orders'
  },
  verification: {
    title: 'Email Verified',
    message: 'Your email has been successfully verified. You can now access all features of your account.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-green-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    redirectTo: '/account',
    buttonText: 'Go to Your Account'
  },
  password: {
    title: 'Password Reset',
    message: 'Your password has been successfully reset. You can now log in with your new password.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-green-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    redirectTo: '/login',
    buttonText: 'Log In'
  },
  default: {
    title: 'Success',
    message: 'Your action was completed successfully.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-green-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    redirectTo: '/',
    buttonText: 'Continue Shopping'
  }
};

export default function SuccessPage() {
  const router = useRouter();
  const { clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  
  // Get URL parameters
  const type = searchParams.get('type') || 'default';
  const title = searchParams.get('title');
  const message = searchParams.get('message');
  const redirectPath = searchParams.get('redirect');
  const redirectTime = parseInt(searchParams.get('time') || '5000');
  const orderId = searchParams.get('orderId');
  
  // Initialize local states
  const [timeLeft, setTimeLeft] = useState(redirectTime / 1000);
  const [updateOrderStatus, setUpdateOrderStatus] = useState(false);
  
  // Get configuration based on type
  const config = typeConfig[type] || typeConfig.default;
  
  // Clear cart on successful order
  useEffect(() => {
    if (type === 'order') {
      clearCart();
  
      // If there's an order ID and the user is authenticated, update the order status
      if (orderId && isAuthenticated) {
        setUpdateOrderStatus(true);
  
        (async () => {
          try {
            const token = localStorage.getItem('token');
            if (!token) return;
            
            const response = await fetch(`http://localhost:3001/api/checkout/success/${orderId}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            
            if (response.ok) {
              console.log('Order status updated successfully');
            }
          } catch (error) {
            console.error('Error updating order status:', error);
          } finally {
            setUpdateOrderStatus(false);
          }
        })();
      }
    }
  }, [type, clearCart, orderId, isAuthenticated]);
  
  // Handle automatic redirect
  useEffect(() => {
    const redirectTo = redirectPath || config.redirectTo;
    
    // Start countdown for redirect
    if (redirectTime > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            router.push(redirectTo);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, []);

  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-gray-800 rounded-xl border border-gray-700 p-8 shadow-xl">
        <div className="text-center">
          {config.icon}
          
          <h2 className="text-3xl font-bold text-white mb-2">
            {title || config.title}
          </h2>
          
          <p className="text-gray-300 mb-8">
            {message || config.message}
          </p>
          
          {/* Redirect timer */}
          {redirectTime > 0 && (
            <div className="mb-8">
              <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-green-500 h-full animate-countdown-bar" 
                  style={{
                    animationDuration: `${redirectTime / 1000}s`
                  }}
                ></div>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Redirecting in {timeLeft} seconds...
              </p>
            </div>
          )}
          
          {/* Action button */}
          <Link
            href={redirectPath || config.redirectTo}
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-medium transition hover:bg-green-700"
          >
            {config.buttonText}
          </Link>
          
          {/* Home link */}
          <div className="mt-6">
            <Link
              href="/"
              className="text-green-500 hover:text-green-400 transition"
            >
              Return to Home Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}