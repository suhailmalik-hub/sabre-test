import * as React from 'react';

export interface VisaFee {
  applicantType: string;
  amount: string;
}

export interface VisaMetaData {
  visaName: string;
  visaFees: VisaFee[];
  processingTime: string;
  maxLengthOfStay?: string;
  duration?: string;
  entriesAllowed?: string;
}

export interface VisaRequirement {
  fromCountryCode: string;
  toCountryCode: string;
  fromCountryName?: string;
  toCountryName?: string;
  visaType: string;
  visaCategory: string;
  visaMetaData: VisaMetaData;
  // Add other fields as needed
}

interface VisaRequirementCardProps {
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

// Simple helper to convert country code to flag emoji
const getCountryFlagEmoji = (countryCode: string) => {
  if (!countryCode) return '';
  const codeMap: { [key: string]: string } = {
    GBR: 'GB',
    FRA: 'FR',
    USA: 'US',
    IND: 'IN',
    DEU: 'DE',
    ESP: 'ES',
    ITA: 'IT',
    CHN: 'CN',
    JPN: 'JP',
    AUS: 'AU',
    CAN: 'CA',
    BRA: 'BR',
    ZAF: 'ZA',
    RUS: 'RU',
  };

  let code = countryCode.toUpperCase();
  if (codeMap[code]) {
    code = codeMap[code];
  } else if (code.length === 3) {
    code = code.slice(0, 2);
  }

  const codePoints = code
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export const VisaRequirementCard: React.FC<VisaRequirementCardProps> = ({ visaRequirement, onApply }) => {
  const { visaType, visaCategory, toCountryCode, visaMetaData } = visaRequirement;
  const flag = getCountryFlagEmoji(toCountryCode);

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
