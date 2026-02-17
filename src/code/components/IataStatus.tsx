import * as React from 'react';
import { VisaStatusResponse } from '../types';

interface IataStatusProps {
  visaStatus: VisaStatusResponse;
}

export const IataStatus: React.FC<IataStatusProps> = ({ visaStatus }) => {
  return (
    <div className='visa-status-section'>
      <div className='section-title'>Visa Status</div>
      <div className='visa-status-card'>
        <div className='visa-status-row'>
          <span className='status-label'>Visa Requirement:</span>
          <span className='status-value'>
            <span className={`status-badge ${visaStatus.isRequired ? 'badge-required' : 'badge-not-required'}`}>
              {visaStatus.isRequired ? '✓ Required' : '✗ Not Required'}
            </span>
          </span>
        </div>

        <div className='visa-status-row'>
          <span className='status-label'>Support Status:</span>
          <span className='status-value'>
            <span className={`status-badge ${visaStatus.isSupported ? 'badge-supported' : 'badge-not-supported'}`}>
              {visaStatus.isSupported ? '✓ Supported by Intellivisa' : '✗ Not Supported by Intellivisa'}
            </span>
          </span>
        </div>

        {visaStatus.description && (
          <div className='visa-status-row'>
            <span className='status-label'>Description:</span>
            <span className='status-value status-description'>{visaStatus.description}</span>
          </div>
        )}
      </div>
    </div>
  );
};
