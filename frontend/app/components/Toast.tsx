'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

type ToastProps = {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: 'success' | 'error' | 'info';
  duration?: number;
};

export default function Toast({ 
  message, 
  isVisible, 
  onClose, 
  type = 'success',
  duration = 3000 
}: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-600 to-green-700';
      case 'error':
        return 'bg-gradient-to-r from-red-600 to-red-700';
      case 'info':
        return 'bg-gradient-to-r from-blue-600 to-blue-700';
      default:
        return 'bg-gradient-to-r from-green-600 to-green-700';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'info':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-start justify-center sm:justify-end pointer-events-none p-6">
      <div className={`${getBgColor()} rounded-lg shadow-lg p-4 flex items-center max-w-md pointer-events-auto border border-gray-700 animate-slide-in`}>
        <div className="flex-shrink-0 text-white mr-3">
          {getIcon()}
        </div>
        <div className="text-white font-medium">{message}</div>
        <button 
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Toast Context Types
type ToastContextType = {
  showToast: (message: string, type?: 'success' | 'error' | 'info', duration?: number) => void;
  hideToast: () => void;
};

// Create the context
const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
  hideToast: () => {},
});

// Export hook for using the toast
export const useToast = () => useContext(ToastContext);

// Toast Provider Component
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState({
    message: '',
    isVisible: false,
    type: 'success' as 'success' | 'error' | 'info',
    duration: 3000,
  });

  const showToast = (
    message: string,
    type: 'success' | 'error' | 'info' = 'success',
    duration: number = 3000
  ) => {
    setToast({
      message,
      isVisible: true,
      type,
      duration,
    });
  };

  const hideToast = () => {
    setToast((prev) => ({
      ...prev,
      isVisible: false,
    }));
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
        type={toast.type}
        duration={toast.duration}
      />
    </ToastContext.Provider>
  );
}