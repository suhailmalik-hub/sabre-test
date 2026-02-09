import * as React from 'react';
import { useToast } from './useToast';

/**
 * Global Toast Container that subscribes to ToastService
 * Place this component once in your app (e.g., in Main.tsx or root component)
 */
export const GlobalToastContainer: React.FC = () => {
  const { currentToast, hideToast } = useToast();
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (currentToast) {
      // Trigger animation
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [currentToast]);

  if (!currentToast) return null;

  const getIcon = () => {
    switch (currentToast.type) {
      case 'success':
        return (
          <svg
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <circle
              cx='12'
              cy='12'
              r='10'
            />
            <polyline points='20 6 9 17 4 12' />
          </svg>
        );
      case 'warning':
        return (
          <svg
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <circle
              cx='12'
              cy='12'
              r='10'
            />
            <line
              x1='12'
              y1='8'
              x2='12'
              y2='12'
            />
            <line
              x1='12'
              y1='16'
              x2='12.01'
              y2='16'
            />
          </svg>
        );
      case 'error':
      default:
        return (
          <svg
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <circle
              cx='12'
              cy='12'
              r='10'
            />
            <line
              x1='15'
              y1='9'
              x2='9'
              y2='15'
            />
            <line
              x1='9'
              y1='9'
              x2='15'
              y2='15'
            />
          </svg>
        );
    }
  };

  const getTitle = () => {
    switch (currentToast.type) {
      case 'success':
        return 'Success';
      case 'warning':
        return 'Warning';
      case 'error':
        return 'Error';
      default:
        return '';
    }
  };

  return (
    <div className={`global-toast-container ${isVisible ? 'visible' : ''}`}>
      <div className={`toast-container toast-${currentToast.type}`}>
        <div className='toast-icon-wrapper'>{getIcon()}</div>
        <div className='toast-content'>
          <div className='toast-title'>{getTitle()}</div>
          <div className='toast-message'>{currentToast.message}</div>
        </div>
        <button
          className='toast-close-btn'
          onClick={hideToast}
          aria-label='Close'
        >
          ×
        </button>
      </div>
    </div>
  );
};
