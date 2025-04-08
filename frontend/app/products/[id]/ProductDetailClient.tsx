'use client'; // Must declare to use client-side features

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/app/CartContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/Toast';
import Navbar from '@/app/components/Navbar';

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  image: string;
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const router = useRouter();

  // Handle Add to Cart
  const handleAddToCart = () => {
    addToCart(product, quantity);
    // Show toast notification instead of alert
    showToast(`${product.name} added to cart!`, 'success', 3000);
  };

  // Handle Buy Now - Add to cart and go to checkout
  const handleBuyNow = async () => {
    addToCart(product, quantity);
    showToast(`${product.name} added to cart! Redirecting to checkout...`, 'info', 1500);
    
    // Add a small delay before redirecting to allow the toast to be seen
    setTimeout(() => {
      router.push('/cart');
    }, 1000);
  };

  // Quantity handlers
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Navigation */}
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center text-sm text-gray-400">
          <Link href="/" className="hover:text-green-400 transition">Home</Link>
          <svg className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-300">{product.category}</span>
          <svg className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-300 truncate">{product.name}</span>
        </div>

        {/* Product Detail Container */}
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
          <div className="md:flex">
            {/* Product Image Section */}
            <div className="md:w-1/2 p-6">
              <div 
                className="bg-white rounded-lg h-96 flex items-center justify-center p-4 cursor-pointer shadow-md"
                onClick={() => setIsModalOpen(true)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="mt-3 text-sm text-center text-gray-400">
                Click image to enlarge
              </div>
            </div>

            {/* Product Info Section */}
            <div className="md:w-1/2 p-6 flex flex-col">
              <div className="mb-2">
                <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-green-900 text-green-100">
                  {product.category}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold mb-4 text-white">{product.name}</h1>
              
              <div className="mb-6">
                <span className="text-3xl font-bold text-green-400">${product.price}</span>
                <span className="ml-2 text-gray-400 line-through">${(product.price * 1.3).toFixed(2)}</span>
                <span className="ml-2 text-green-400 text-sm">30% off</span>
              </div>
              
              <div className="mb-6 text-gray-300">
                <p className="mb-4">
                  This product is an authentic license key for <span className="font-semibold text-white">{product.name}</span>.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Instant email delivery
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Seamless software installation
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Genuine lifetime license
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    24/7 technical support
                  </li>
                </ul>
              </div>
              
              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Quantity</label>
                <div className="flex items-center">
                  <button 
                    onClick={decrementQuantity}
                    className="w-10 h-10 rounded-l bg-gray-700 flex items-center justify-center text-white hover:bg-gray-600 transition"
                  >
                    -
                  </button>
                  <span className="w-16 h-10 flex items-center justify-center bg-gray-700 text-white">
                    {quantity}
                  </span>
                  <button 
                    onClick={incrementQuantity}
                    className="w-10 h-10 rounded-r bg-gray-700 flex items-center justify-center text-white hover:bg-gray-600 transition"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="mt-auto space-y-4">
                <button 
                  onClick={handleAddToCart}
                  className="w-full py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg shadow transition flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add to Cart
                </button>
                <button 
                  onClick={handleBuyNow}
                  className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow transition"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
          
          {/* Product Description */}
          <div className="p-6 border-t border-gray-700">
            <h2 className="text-xl font-bold mb-4">Product Description</h2>
            <p className="text-gray-300">
              Get the most out of your software with this genuine license key. This product provides you with full access to all features and future updates. Our keys are sourced directly from authorized distributors, ensuring 100% authenticity and lifetime validity.
            </p>
          </div>
        </div>
        
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

      {/* Image Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 bg-gray-800 hover:bg-gray-700 text-white rounded-full p-2 transition"
              onClick={() => setIsModalOpen(false)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img 
              src={product.image} 
              alt={product.name} 
              className="max-w-[90vw] max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}