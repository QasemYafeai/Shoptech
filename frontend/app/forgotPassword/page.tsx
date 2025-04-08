'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/AuthContext';
import { useToast } from '@/app/components/Toast';
import Navbar from '@/app/components/Navbar';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { forgotPassword } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      showToast('Please enter your email address', 'error');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
      showToast('Password reset email sent!', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to send reset email', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <Navbar />
        <div className="flex items-center justify-center px-4 py-20">
          <div className="max-w-md w-full bg-gradient-to-br from-blue-800/30 to-blue-900/30 rounded-xl shadow-2xl overflow-hidden border border-blue-600 p-8">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mb-4 text-blue-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              
              <h1 className="text-2xl font-bold mb-2">Check Your Email</h1>
              <p className="text-lg mb-4 text-gray-300">
                We've sent a password reset link to:
              </p>
              <p className="text-xl font-medium text-green-400 mb-6">{email}</p>
              <p className="text-gray-400 mb-8">
                Please check your inbox and click the reset link to create a new password. The link will expire in 10 minutes.
              </p>
              
              <div className="flex flex-col gap-3 mt-6">
                <button 
                  onClick={() => router.push('/login')}
                  className="py-3 px-4 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition duration-300"
                >
                  Return to Login
                </button>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail('');
                  }}
                  className="py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition duration-300"
                >
                  Try Another Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl shadow-lg overflow-hidden border border-gray-700 p-8">
          <div className="text-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h1 className="text-2xl font-bold">Forgot Your Password?</h1>
            <p className="text-gray-400 mt-2">Enter your email address and we'll send you a link to reset your password</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-lg font-medium transition duration-300 ${
                  isSubmitting 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : 'Send Reset Link'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-green-400 hover:text-green-300">
              Remember your password? Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}