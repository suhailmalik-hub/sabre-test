import * as React from 'react';

interface NotSupportedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotSupportedModal: React.FC<NotSupportedModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className='req-modal-overlay'
      onClick={onClose}
    >
      <div
        className='not-supported-modal-content'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section - Similar to PNR Header */}
        <div className='not-supported-header'>
          <div className='header-left'>
            <div className='modal-icon'>
              <svg
                width='32'
                height='32'
                viewBox='0 0 24 24'
                fill='none'
                stroke='#ffffff'
                strokeWidth='2.5'
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
            </div>
            <div className='header-text'>
              <h2 className='modal-title'>Flight Bookings Only</h2>
            </div>
          </div>
          <button
            className='close-icon-btn'
            onClick={onClose}
          >
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='#ffffff'
              strokeWidth='2'
            >
              <line
                x1='18'
                y1='6'
                x2='6'
                y2='18'
              />
              <line
                x1='6'
                y1='6'
                x2='18'
                y2='18'
              />
            </svg>
          </button>
        </div>

        {/* Content Section */}
        <div className='not-supported-body'>
          <div className='info-section'>
            <div className='info-icon'>
              <svg
                width='36'
                height='36'
                viewBox='0 0 24 24'
                fill='none'
                stroke='#fd5b00'
                strokeWidth='2.5'
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
            </div>
            <h3 className='info-title'>Non-Flight Booking Detected</h3>
            <p className='info-message'>
              Your booking contains non-flight services such as hotels, cars, or other travel arrangements.
            </p>
            <p className='info-submessage'>
              Intellivisa supports <strong>flight bookings only</strong>. Please use a flight reservation to check visa
              requirements.
            </p>
          </div>

          {/* Supported Services Section */}
          <div className='supported-section'>
            <h4 className='section-heading'>What Intellivisa Supports</h4>
            <div className='features-grid'>
              <div className='feature-card'>
                <div className='feature-icon'>
                  <svg
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='#10b981'
                    strokeWidth='2'
                  >
                    <path d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' />
                    <polyline points='7.5 4.21 12 6.81 16.5 4.21' />
                    <polyline points='7.5 19.79 7.5 14.6 3 12' />
                    <polyline points='21 12 16.5 14.6 16.5 19.79' />
                    <polyline points='3.27 6.96 12 12.01 20.73 6.96' />
                    <line
                      x1='12'
                      y1='22.08'
                      x2='12'
                      y2='12'
                    />
                  </svg>
                </div>
                <div className='feature-content'>
                  <h5>Flight Visa Requirements</h5>
                  <p>Comprehensive visa information for international flights</p>
                </div>
              </div>

              {/* <div className='feature-card'>
                <div className='feature-icon'>
                  <svg
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='#10b981'
                    strokeWidth='2'
                  >
                    <circle
                      cx='12'
                      cy='12'
                      r='10'
                    />
                    <polyline points='12 6 12 12 16 14' />
                  </svg>
                </div>
                <div className='feature-content'>
                  <h5>Transit Visa Information</h5>
                  <p>Requirements for layovers and connecting flights</p>
                </div>
              </div> */}

              <div className='feature-card'>
                <div className='feature-icon'>
                  <svg
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='#10b981'
                    strokeWidth='2'
                  >
                    <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' />
                    <polyline points='14 2 14 8 20 8' />
                    <line
                      x1='16'
                      y1='13'
                      x2='8'
                      y2='13'
                    />
                    <line
                      x1='16'
                      y1='17'
                      x2='8'
                      y2='17'
                    />
                    <polyline points='10 9 9 9 8 9' />
                  </svg>
                </div>
                <div className='feature-content'>
                  <h5>Document Guidelines</h5>
                  <p>Required documents and application procedures</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className='modal-actions'>
            <button
              className='btn-primary-action'
              onClick={onClose}
            >
              Got it, Thanks!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
