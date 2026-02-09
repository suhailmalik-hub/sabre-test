/**
 * Toast Library - Centralized exports
 * 
 * Export all toast-related functionality from a single entry point.
 * This allows for cleaner imports throughout the application.
 * 
 * Usage:
 * import { ToastService, GlobalToastContainer, useToast } from '../lib/toast';
 */

export { ToastService } from './ToastService';
export { useToast } from './useToast';
export { GlobalToastContainer } from './GlobalToastContainer';

// Re-export types for convenience
export type ToastType = 'success' | 'warning' | 'error';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}
