'use client'; // Make this a client-side component

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from './CartContext';
import Navbar from './components/Navbar';
import { useToast } from './components/Toast';

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    // Fetch products from your Express server
    fetch('http://localhost:3001/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error fetching products:', err));
  }, []);

  // Filter products based on the searchTerm
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle quick add to cart
  const handleQuickAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Stop event from bubbling up
    addToCart(product, 1);
    
    // Show toast notification instead of alert
    showToast(`${product.name} added to cart!`, 'success', 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Navigation */}
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="mb-12 bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-700">
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                Protect Your Digital Life
              </h1>
              <p className="text-lg text-gray-300 mb-6">
                Premium antivirus and software solutions at unbeatable prices
              </p>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-5 py-3 rounded-full border-2 border-gray-700 focus:border-green-500 focus:outline-none bg-gray-700 text-white transition pr-12"
                />
                <div className="absolute right-4 top-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-12">
              <div className="rounded-xl bg-gradient-to-r from-green-500 to-blue-600 p-1">
                <div className="bg-gray-800 rounded-lg p-4 h-48 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product._id} className="group">
                <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden transition transform hover:-translate-y-1 hover:shadow-xl duration-300 border border-gray-700 h-full flex flex-col">
                  {/* Image Container */}
                  <Link href={`/products/${product._id}`} className="block relative bg-black h-64 p-4">
                    <div className="bg-white w-full h-full flex items-center justify-center p-2 rounded">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </Link>
                  
                  {/* Product Info */}
                  <div className="p-4 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-900 text-green-100">
                        {product.category}
                      </span>
                      <span className="font-bold text-xl text-green-400">
                        ${product.price}
                      </span>
                    </div>
                    
                    <Link href={`/products/${product._id}`} className="block">
                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <div className="mt-auto flex justify-between items-center">
                      <Link 
                        href={`/products/${product._id}`}
                        className="text-green-400 font-medium hover:text-green-300 transition"
                      >
                        View details
                      </Link>
                      <button
                        onClick={(e) => handleQuickAddToCart(e, product)}
                        className="rounded-full p-2 bg-gray-700 text-gray-300 group-hover:bg-green-700 group-hover:text-white transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

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