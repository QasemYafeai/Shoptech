'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../CartContext';
import { useRouter } from 'next/navigation';
import { useAuth } from '../AuthContext'; // Make sure to import useAuth

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const { user, isAuthenticated } = useAuth(); // Add this line to get auth state
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Handle Checkout with Stripe
  async function handleCheckout() {
    if (cartItems.length === 0) return;
    
    setIsLoading(true);
    
    try {
      // Format items for Stripe checkout
      const items = cartItems.map(item => ({
        _id: item._id,
        name: item.name,
        amount: Math.round(item.price * 100), // Convert to cents for Stripe
        quantity: item.quantity,
        image: item.image || ''
      }));
      
      console.log("Preparing checkout with items:", items);
      
      // Get auth token if user is logged in
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:3001/api/checkout/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add auth token to request if available
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          items,
          // Pass user ID if authenticated
          userId: isAuthenticated && user ? user._id : undefined
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Checkout failed: ${errorData}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.url) {
        // Store cart in localStorage before redirect to keep items after payment
        localStorage.setItem('lastCart', JSON.stringify(cartItems));
        
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        throw new Error('Invalid response from checkout API');
      }
    } catch (err) {
      // Fix the error typing issue
      const error = err as Error;
      console.error('Checkout error:', error);
      alert(error.message || 'Failed to process checkout. Please try again.');
      setIsLoading(false);
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Navigation */}
      <nav className="bg-gray-900 shadow-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-green-500 hover:text-green-400 transition">
                ShopTech
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-green-600 text-white relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center text-sm text-gray-400">
          <Link href="/" className="hover:text-green-400 transition">Home</Link>
          <svg className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-300">Cart</span>
        </div>

        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-8 text-center border border-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">Looks like you haven't added any products to your cart yet.</p>
            <Link href="/" className="inline-block px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 mb-6">
                <ul className="divide-y divide-gray-700">
                  {cartItems.map((item) => (
                    <li key={item._id} className="p-6">
                      <div className="flex flex-col sm:flex-row items-start">
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-full sm:w-24 h-24 bg-white rounded-lg overflow-hidden mb-4 sm:mb-0 sm:mr-6 flex items-center justify-center">
                          <div className="w-full h-full bg-white flex items-center justify-center">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="max-h-full max-w-full object-contain" 
                            />
                          </div>
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <h3 className="text-lg font-medium text-white">{item.name}</h3>
                            <span className="text-lg font-bold text-green-400">
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                          
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <button 
                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white hover:bg-gray-600 transition"
                              >
                                -
                              </button>
                              <span className="mx-3 w-8 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white hover:bg-gray-600 transition"
                              >
                                +
                              </button>
                            </div>
                            
                            <button 
                              onClick={() => removeFromCart(item._id)}
                              className="text-gray-400 hover:text-red-500 transition"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex justify-between items-center">
                <Link 
                  href="/"
                  className="flex items-center text-green-400 hover:text-green-300 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Continue Shopping
                </Link>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Discount</span>
                    <span className="text-green-400">-$0.00</span>
                  </div>
                  
                  <div className="border-t border-gray-700 pt-3 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-xl">${getCartTotal().toFixed(2)}</span>
                  </div>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  disabled={isLoading || cartItems.length === 0}
                  className={`w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow transition flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Proceed to Checkout'
                  )}
                </button>
                
                <div className="mt-4 text-xs text-gray-400 text-center">
                  <p>Secure checkout powered by Stripe</p>
                  <p className="mt-1">All transactions are encrypted and secure</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
<footer className="mt-16 py-8 border-t border-gray-700">
  <div className="flex flex-col md:flex-row justify-between items-center">
    <div className="mb-4 md:mb-0">
      <span className="text-xl font-bold text-green-500">ShopTech</span>
      <p className="text-sm text-gray-400 mt-1">
        Antivirus and Software at very low price
      </p>
    </div>
    <div className="flex space-x-6">
      {/* GitHub Link */}
      <a
        href="https://github.com/QasemYafeai"
        className="text-gray-400 hover:text-green-500 transition"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="sr-only">GitHub</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303
          3.438 9.8 8.205 11.385.6.113.82-.258.82-.577
          0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.416-4.042-1.416-.546-1.385-1.333-1.754-1.333-1.754-1.087-.744.084-.729.084-.729
          1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.809
          1.305 3.495.998.108-.776.418-1.305.762-1.605-2.665-.3-5.466-1.335-5.466-5.93
          0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3
          1.23a11.49 11.49 0 013-.405c1.02.005 2.045.138 3
          .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12
          3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475
          5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015
          3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24
          12.297c0-6.627-5.373-12-12-12"/>
        </svg>
      </a>
      {/* LinkedIn Link */}
      <a
        href="https://www.linkedin.com/in/qasem-yafeai-69440b233/"
        className="text-gray-400 hover:text-green-500 transition"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="sr-only">LinkedIn</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 
          2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11.75 
          20h-3v-11h3v11zm-1.5-12.28c-.966 0-1.75-.784-1.75-1.75s.784-1.75 
          1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.25 
          12.28h-3v-5.5c0-1.314-.026-3-1.833-3-1.835 0-2.118 1.431-2.118 2.91v5.59h-3v-11h2.881v1.5h.041c.402-.762 
          1.384-1.563 2.848-1.563 3.041 0 3.604 2.001 3.604 4.602v6.461z"/>
        </svg>
      </a>
    </div>
  </div>
</footer>

      </main>
    </div>
  );
}