'use client';

import { useState, useCallback } from 'react';

interface ToastOptions {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

export function useToast() {
  const [toast, setToast] = useState<ToastOptions | null>(null);

  const showToast = useCallback((options: ToastOptions) => {
    setToast(options);
    
    // Auto-hide after duration
    setTimeout(() => {
      setToast(null);
    }, options.duration || 3000);
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
}