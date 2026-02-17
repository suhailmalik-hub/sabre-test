import * as React from 'react';

import { countryFlagIcon } from '../lib/utils/countryFlagIcon';
import { VisaRequirement } from '../types';

interface VisaCardProps {
  visaRequirement: VisaRequirement;
  onApply: (visaRequirement: VisaRequirement) => void;
}

// ReadMore Component helper
const ReadMore: React.FC<{ text: string; limit?: number }> = ({ text, limit = 50 }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  if (!text) return null;
  if (text.length <= limit) return <span>{text}</span>;

  return (
    <span>
      {isExpanded ? text : `${text.substring(0, limit)}...`}{' '}
      <span
        className='read-more-link'
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        style={{ color: '#FF5722', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}
      >
        {isExpanded ? 'show less' : 'show more'}
      </span>
    </span>
  );
};

export const VisaCard: React.FC<VisaCardProps> = ({ visaRequirement, onApply }) => {
  const { visaType, visaCategory, toCountryCode, visaMetaData } = visaRequirement;
  const flag = countryFlagIcon(toCountryCode);

  const feesText = visaMetaData.visaFees?.map((f) => `${f.applicantType}: ${f.amount}`).join(', ') || 'N/A';

  return (
    <div className='visa-card'>
      <div className='visa-card-header'>
        <span className='visa-flag'>{flag}</span>
        <span className='visa-title'>{visaType}</span>
      </div>

      <div className='visa-card-body'>
        <div className='visa-row'>
          <span className='visa-label'>Visa Category:</span>
          <span className='visa-value'>{visaCategory}</span>
        </div>

        <div className='visa-row'>
          <span className='visa-label'>Visa Fees:</span>
          <div className='visa-value'>
            <ReadMore
              text={feesText}
              limit={40}
            />
          </div>
        </div>

        <div className='visa-row'>
          <span className='visa-label'>Processing Time:</span>
          <div className='visa-value'>
            <ReadMore
              text={visaMetaData.processingTime}
              limit={40}
            />
          </div>
        </div>
      </div>

      <div className='visa-card-footer'>
        <button
          className='btn-apply'
          onClick={() => onApply(visaRequirement)}
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};
