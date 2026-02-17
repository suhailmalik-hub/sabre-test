type ToastType = 'success' | 'warning' | 'error';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

type ToastListener = (toast: Toast | null) => void;

/**
 * Toast Service for displaying notifications throughout the application.
 * Can be used from components, API files, and services.
 * Does not rely on Redux store.
 */
class ToastServiceClass {
  private listeners: Set<ToastListener> = new Set();
  private currentToast: Toast | null = null;
  private hideTimeout: ReturnType<typeof setTimeout> | null = null;

  /**
   * Subscribe to toast updates
   */
  subscribe(listener: ToastListener): () => void {
    this.listeners.add(listener);
    // Immediately notify the new listener of the current state
    listener(this.currentToast);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of toast changes
   */
  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.currentToast);
      } catch (error) {
        console.error('Error in toast listener:', error);
      }
    });
  }

  /**
   * Show a toast notification
   */
  private show(message: string, type: ToastType, duration: number = 5000): void {
    try {
      // Clear any existing timeout
      if (this.hideTimeout) {
        clearTimeout(this.hideTimeout);
        this.hideTimeout = null;
      }

      // Create new toast
      this.currentToast = {
        id: `toast-${Date.now()}-${Math.random()}`,
        message,
        type,
        duration,
      };

      // Notify listeners
      this.notify();

      // Auto-hide after duration
      if (duration > 0) {
        this.hideTimeout = setTimeout(() => {
          this.hide();
        }, duration);
      }
    } catch (error) {
      console.error('Error showing toast:', error instanceof Error ? error.message : error);
    }
  }

  /**
   * Hide the current toast
   */
  hide(): void {
    try {
      if (this.hideTimeout) {
        clearTimeout(this.hideTimeout);
        this.hideTimeout = null;
      }

      this.currentToast = null;
      this.notify();
    } catch (error) {
      console.error('Error hiding toast:', error instanceof Error ? error.message : error);
    }
  }

  /**
   * Show a success toast
   */
  showSuccess(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  /**
   * Show a warning toast
   */
  showWarning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  /**
   * Show an error toast
   */
  showError(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  /**
   * Get the current toast (for testing or debugging)
   */
  getCurrentToast(): Toast | null {
    return this.currentToast;
  }
}

// Export singleton instance
export const ToastService = new ToastServiceClass();
