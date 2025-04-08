'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/AuthContext';
import { useToast } from '@/app/components/Toast';
import Navbar from '@/app/components/Navbar';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);
  
  const { resetPassword } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;
  
  useEffect(() => {
    if (!token) {
      setIsTokenValid(false);
      showToast('Invalid reset link', 'error');
    }
  }, [token, showToast]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await resetPassword(token, password);
      
      // Redirect to success page
      router.push(`/success?type=password&title=Password%20Reset%20Complete&message=Your%20password%20has%20been%20successfully%20reset.%20You%20can%20now%20login%20with%20your%20new%20password.&redirect=/login&time=5000`);
    } catch (error: any) {
      showToast(error.message || 'Failed to reset password', 'error');
      setIsSubmitting(false);
    }
  };
  
  if (!isTokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <Navbar />
        <div className="flex items-center justify-center px-4 py-20">
          <div className="max-w-md w-full bg-gradient-to-br from-red-800/30 to-red-900/30 rounded-xl shadow-2xl overflow-hidden border border-red-600 p-8">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mb-4 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              
              <h1 className="text-3xl font-bold mb-2">Invalid Reset Link</h1>
              <p className="text-lg mb-8 text-gray-300">The password reset link is invalid or has expired.</p>
              
              <div className="flex flex-col gap-3 mt-6">
                <Link
                  href="/forgot-password"
                  className="py-3 px-4 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition duration-300 text-center"
                >
                  Request New Reset Link
                </Link>
                <Link
                  href="/login"
                  className="py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition duration-300 text-center"
                >
                  Return to Login
                </Link>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            <h1 className="text-2xl font-bold">Reset Your Password</h1>
            <p className="text-gray-400 mt-2">Create a new secure password for your account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter new password"
                required
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Confirm new password"
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
                    Processing...
                  </span>
                ) : 'Reset Password'}
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