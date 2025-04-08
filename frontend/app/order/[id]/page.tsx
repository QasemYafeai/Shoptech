'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/AuthContext';
import { useToast } from '@/app/components/Toast';
import Navbar from '@/app/components/Navbar';

// Order interfaces
interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  createdAt: string;
  isPaid: boolean;
  isDelivered: boolean;
  shippingAddress?: {
    name: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentInfo?: {
    method: string;
    cardLast4?: string;
  };
}

export default function OrderDetailPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  
  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (authLoading) return;
      if (!isAuthenticated) {
        router.push('/login?redirect=' + encodeURIComponent(`/order/${orderId}`));
        return;
      }
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Not authenticated');
        }
        
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
        const response = await fetch(`${API_URL}/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }
        
        const data = await response.json();
        setOrder(data.data);
      } catch (error) {
        console.error('Error fetching order details:', error);
        showToast('Failed to load order details', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId, isAuthenticated, authLoading, router, showToast]);
  
  // Format date for display
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  
  // Get status badge color based on order status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-900/50 text-yellow-300 border-yellow-600';
      case 'processing':
        return 'bg-blue-900/50 text-blue-300 border-blue-600';
      case 'shipped':
        return 'bg-indigo-900/50 text-indigo-300 border-indigo-600';
      case 'delivered':
        return 'bg-green-900/50 text-green-300 border-green-600';
      case 'cancelled':
        return 'bg-red-900/50 text-red-300 border-red-600';
      default:
        return 'bg-gray-900/50 text-gray-300 border-gray-600';
    }
  };
  
  // Get tracking UI based on order status
  const getTrackingUI = (status: string) => {
    const steps = [
      { name: 'Order Placed', completed: true },
      { name: 'Payment Confirmed', completed: status !== 'pending' },
      { name: 'Processing', completed: ['processing', 'shipped', 'delivered'].includes(status) },
      { name: 'Shipped', completed: ['shipped', 'delivered'].includes(status) },
      { name: 'Delivered', completed: status === 'delivered' }
    ];
    return (
      <div className="flex items-center justify-between w-full mb-8">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                step.completed ? 'bg-green-600' : 'bg-gray-700'
              }`}
            >
              {step.completed ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="text-xs text-white">{index + 1}</span>
              )}
            </div>
            <span className={`text-xs ${step.completed ? 'text-green-500' : 'text-gray-400'}`}>
              {step.name}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (authLoading || (isLoading && isAuthenticated)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <Navbar />
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-t-4 border-green-500 border-solid rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-lg text-gray-300">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Redirecting to login in useEffect
  }
  
  if (!order && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <Navbar />
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto mb-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold mb-2">Order Not Found</h2>
            <p className="text-gray-400 mb-6">The order you're looking for doesn't exist or you don't have permission to view it.</p>
            <Link
              href="/account?tab=orders"
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition inline-block"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (!order) return null; // Safety check
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link href="/account?tab=orders" className="text-gray-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </Link>
                <h1 className="text-2xl font-bold">Order #{orderId.slice(-8)}</h1>
                <span className={`ml-2 px-3 py-1 text-xs rounded-full border ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <p className="text-gray-400">Placed on {formatDate(order.createdAt)}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Receipt
              </button>
            </div>
          </div>
        </div>
        
        {/* Order Tracking */}
        {order.status !== 'cancelled' && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-6">
            <h2 className="text-lg font-bold mb-6">Order Status</h2>
            {getTrackingUI(order.status)}
            {order.status === 'shipped' && (
              <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                <div>
                  <span className="font-medium text-blue-400">Your order is on the way!</span>
                  <p className="text-sm text-gray-300">Tracking number: <span className="font-mono">TN{Math.floor(Math.random() * 10000000)}</span></p>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Order Details */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Order Details</h2>
          <div className="divide-y divide-gray-700">
            {order.items.map((item, index) => (
              <div key={index} className="py-4 flex items-center">
                <div className="bg-white h-16 w-16 flex items-center justify-center rounded-md mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{item.name}</h3>
                  <div className="text-gray-400 text-sm">Qty: {item.quantity}</div>
                  {order.status !== 'pending' && (
                    <div className="mt-2">
                      <button className="text-green-500 hover:text-green-400 text-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                        Download Software
                      </button>
                    </div>
                  )}
                </div>
                <div className="font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-700 mt-4 pt-4">
            <div className="flex justify-between py-2">
              <span className="text-gray-400">Subtotal</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-400">Shipping</span>
              <span className="text-green-500">Free</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-400">Tax</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between py-2 font-bold text-lg">
              <span>Total</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {/* Shipping and Payment Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-lg font-bold mb-4">Payment Information</h2>
            <div className="flex items-center mb-4">
              <div className="bg-blue-900/30 w-10 h-6 rounded flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v10a3 3 0 003 3h1" />
                </svg>
              </div>
              <span>{order.paymentInfo?.method || 'Credit Card'}</span>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Payment Status</p>
              <p className={order.isPaid ? "text-green-500" : "text-yellow-500"}>
                {order.isPaid ? 'Paid' : 'Pending'}
              </p>
            </div>
            {order.shippingAddress && (
              <div className="mt-4">
                <p className="text-gray-400 text-sm">Billing address</p>
                <p>{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            )}
          </div>
          
          {/* Shipping Information */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-lg font-bold mb-4">Delivery Information</h2>
            <div className="flex items-center mb-4">
              <div className="bg-green-900/30 w-10 h-6 rounded flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span>Email Delivery</span>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Delivery Status</p>
              <p className={order.isDelivered ? "text-green-500" : "text-yellow-500"}>
                {order.isDelivered ? 'Delivered' : 'Pending'}
              </p>
            </div>
            {order.shippingAddress && (
              <div className="mt-4">
                <p className="text-gray-400 text-sm">Shipping address</p>
                <p>{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Customer Support */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h2 className="text-lg font-bold mb-4">Need Help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>FAQ</span>
            </button>
            <button className="p-4 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Email Support</span>
            </button>
            <button className="p-4 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Live Chat</span>
            </button>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex justify-between mt-8">
          <Link
            href="/account?tab=orders"
            className="px-6 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition"
          >
            Back to Orders
          </Link>
          <Link
            href="/"
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
