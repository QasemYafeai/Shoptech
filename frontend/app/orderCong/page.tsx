'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/app/CartContext';
import { useAuth } from '@/app/AuthContext';
import Navbar from '@/app/components/Navbar';

export default function OrderSuccessPage() {
  const { clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const orderId = searchParams.get('order_id');
  
  // Clear cart on successful order
  useEffect(() => {
    if (orderId) {
      clearCart();
    }
  }, [orderId, clearCart]);
  
  // Redirect if no order ID
  useEffect(() => {
    if (!orderId) {
      router.push('/');
    }
  }, [orderId, router]);
  
  if (!orderId) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar />
      
      <div className="flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl w-full bg-gradient-to-br from-green-800/30 to-green-900/30 rounded-xl shadow-2xl overflow-hidden border border-green-600 p-8">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto mb-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            
            <h1 className="text-3xl font-bold mb-3">Order Successful!</h1>
            <p className="text-xl mb-8 text-gray-300">Thank you for your purchase</p>
            
            <div className="bg-gray-800/50 rounded-lg p-6 mb-8 text-left">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Order Information</h2>
                <span className="text-sm bg-green-900 text-green-300 px-3 py-1 rounded-full">
                  Completed
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Order ID</p>
                  <p className="font-mono text-green-400">{orderId}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Date</p>
                  <p>{new Date().toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-700 my-4 pt-4">
                <p className="text-gray-400 text-sm mb-1">Email Confirmation</p>
                <p>A receipt has been sent to your email address.</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 mt-8">
              {isAuthenticated ? (
                <Link 
                  href="/account/orders" 
                  className="py-3 px-6 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition duration-300 text-center"
                >
                  View Order Details
                </Link>
              ) : (
                <Link 
                  href="/login?redirect=/account/orders" 
                  className="py-3 px-6 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition duration-300 text-center"
                >
                  Login to View Order Details
                </Link>
              )}
              
              <Link 
                href="/" 
                className="py-3 px-6 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition duration-300 text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}