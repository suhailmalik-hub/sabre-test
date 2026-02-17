import * as React from 'react';
import { ToastService } from './ToastService';

type ToastType = 'success' | 'warning' | 'error';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

/**
 * Custom hook to subscribe to toast notifications
 * @returns Current toast state and method to hide toast
 */
export const useToast = () => {
  const [currentToast, setCurrentToast] = React.useState<Toast | null>(null);

  React.useEffect(() => {
    // Subscribe to toast service
    const unsubscribe = ToastService.subscribe((toast) => {
      setCurrentToast(toast);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  return {
    currentToast,
    hideToast: () => ToastService.hide(),
  };
};
