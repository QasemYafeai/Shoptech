'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/app/AuthContext';
import { useToast } from '@/app/components/Toast';
import Navbar from '@/app/components/Navbar';

export default function VerifyEmailPage() {
  const [isVerifying, setIsVerifying] = useState(true);
  const { verifyEmail } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  useEffect(() => {
    const verifyUserEmail = async () => {
      if (!token) {
        showToast('Invalid verification link', 'error');
        setIsVerifying(false);
        return;
      }

      try {
        await verifyEmail(token);
        
        // Redirect to success page
        router.push(`/success?type=verification&title=Email%20Verified!&message=Your%20email%20has%20been%20successfully%20verified.%20You%20can%20now%20enjoy%20all%20the%20features%20of%20your%20ShopTech%20account.&redirect=/&time=5000`);
      } catch (error: any) {
        showToast(error.message || 'Verification failed', 'error');
        setIsVerifying(false);
      }
    };

    verifyUserEmail();
  }, [token, verifyEmail, showToast, router]);

  if (!isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <Navbar />
        <div className="flex items-center justify-center px-4 py-20">
          <div className="max-w-md w-full bg-gradient-to-br from-red-800/30 to-red-900/30 rounded-xl shadow-2xl overflow-hidden border border-red-600 p-8">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mb-4 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              
              <h1 className="text-3xl font-bold mb-2">Verification Failed</h1>
              <p className="text-lg mb-8 text-gray-300">The verification link may be invalid or expired.</p>
              
              <div className="flex flex-col gap-3 mt-6">
                <button 
                  onClick={() => router.push('/login')}
                  className="py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition duration-300"
                >
                  Return to Login
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
          <div className="text-center">
            <div className="mb-4">
              <div className="w-16 h-16 border-t-4 border-green-500 border-solid rounded-full animate-spin mx-auto"></div>
            </div>
            <h1 className="text-2xl font-bold mb-2">Verifying Your Email</h1>
            <p className="text-gray-400">Please wait while we verify your email address...</p>
          </div>
        </div>
      </div>
    </div>
  );
}