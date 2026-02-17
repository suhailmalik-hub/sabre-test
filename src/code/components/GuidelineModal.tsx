import * as React from 'react';
import { connect } from 'react-redux';
import { useVisa } from '../hooks/use-visa';

import { countryFlagIcon } from '../lib/utils/countryFlagIcon';
import { downloadGuidelinePDF } from '../lib/utils/guidelineDownload';
import { StoreStateType } from '../store/store';
import { TravelFormData, VisaApplicationReq, VisaRequirement } from '../types';

interface OwnProps {
  isOpen: boolean;
  onClose: () => void;
  visaRequirement: VisaRequirement | null;
}

interface StateProps {
  tripDetails: TravelFormData | null;
}

type GuidelineModalProps = OwnProps & StateProps;

const GuidelineModalComponent: React.FC<GuidelineModalProps> = ({ isOpen, onClose, visaRequirement, tripDetails }) => {
  console.log('SABRE-IV OBTAINED TRIP DETAILS FROM THE REDUX Store:', tripDetails);

  if (!isOpen || !visaRequirement) return null;

  const {
    visaCategory,
    visaType,
    fromCountryCode,
    toCountryCode,
    fromCountryName,
    toCountryName,
    visaMetaData,
    visaDocumentsGuidelines,
  } = visaRequirement as any;

  const fromFlag = countryFlagIcon(fromCountryCode);
  const toFlag = countryFlagIcon(toCountryCode);

  const feesText = visaMetaData?.visaFees?.map((f: any) => `${f.applicantType}: ${f.amount}`).join(', ') || 'N/A';

  // Separate Mandatory vs Supporting documents
  const requiredDocs = visaDocumentsGuidelines?.filter((g: any) => g.mandatory) || [];
  const supportingDocs = visaDocumentsGuidelines?.filter((g: any) => !g.mandatory) || [];

  const { isApplyVisaLoading, applyVisaResponse, applyVisaApplication } = useVisa();

  const handleDownload = () => {
    downloadGuidelinePDF(visaRequirement);
  };

  const handleApply = async () => {
    const payload = {
      applicant: {
        firstName: tripDetails.firstName,
        lastName: tripDetails.lastName,
        email: tripDetails.email,
        phone: tripDetails.phone,
        sex: tripDetails.sex,
        applicantType: 'D2C',
        address: {
          country: tripDetails.nationality,
          state: '',
          city: '',
          pin: '',
        },
      },
      visaApplication: {
        visaFrom: fromCountryName,
        visaTo: toCountryName,
        visaType: visaType,
        fromDate: tripDetails.returnDate.split('/').reverse().join('-'),
        toDate: tripDetails.returnDate,
        nationality: tripDetails.nationality,
      },
    };
    applyVisaApplication(payload as VisaApplicationReq);
  };

  return (
    <div
      className='req-modal-overlay'
      onClick={onClose}
    >
      <div
        className='req-modal-content'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='req-static-header'>
          <div className='req-modal-header'>
            <h2 className='req-modal-title'>
              {visaCategory} <span className='subtitle'>{visaType}</span>
            </h2>
            <button
              className='close-btn'
              onClick={onClose}
              aria-label='Close'
            >
              &times;
            </button>
          </div>

          <div className='req-route-info'>
            <div className='country-block'>
              <span className='flag'>{fromFlag}</span>
              <span className='country-name'>{fromCountryName || fromCountryCode}</span>
            </div>
            <div className='route-arrow'>
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M5 12h14' />
                <path d='M12 5l7 7-7 7' />
              </svg>
            </div>
            <div className='country-block'>
              <span className='flag'>{toFlag}</span>
              <span className='country-name'>{toCountryName || toCountryCode}</span>
            </div>
          </div>
        </div>

        <div className='req-scroll-body'>
          <h2 className='req-about-title'>About</h2>
          <div className='req-meta-section'>
            <div className='meta-item'>
              <div className='meta-icon'>
                <svg
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='#fd5b00'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <circle
                    cx='12'
                    cy='12'
                    r='10'
                  />
                  <polyline points='12 6 12 12 16 14' />
                </svg>
              </div>
              <div className='meta-content'>
                <span className='label'>Duration</span>
                <span className='value'>{visaMetaData?.duration || 'N/A'}</span>
              </div>
            </div>
            <div className='meta-item'>
              <div className='meta-icon'>
                <svg
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='#fd5b00'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z' />
                  <line
                    x1='7'
                    y1='7'
                    x2='7.01'
                    y2='7'
                  />
                </svg>
              </div>
              <div className='meta-content'>
                <span className='label'>Fees</span>
                <span className='value'>{feesText}</span>
              </div>
            </div>
            <div className='meta-item'>
              <div className='meta-icon'>
                <svg
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='#fd5b00'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <rect
                    x='3'
                    y='4'
                    width='18'
                    height='18'
                    rx='2'
                    ry='2'
                  />
                  <line
                    x1='16'
                    y1='2'
                    x2='16'
                    y2='6'
                  />
                  <line
                    x1='8'
                    y1='2'
                    x2='8'
                    y2='6'
                  />
                  <line
                    x1='3'
                    y1='10'
                    x2='21'
                    y2='10'
                  />
                </svg>
              </div>
              <div className='meta-content'>
                <span className='label'>Processing Time</span>
                <span className='value'>{visaMetaData?.processingTime || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className='req-section'>
            <h3>Required Documents</h3>
            {requiredDocs.length > 0 ? (
              <ul className='doc-list'>
                {requiredDocs.map((cat: any, i: number) => (
                  <li
                    key={i}
                    className='doc-category-item'
                  >
                    <div className='category-title'>{cat.docCategory || 'General'}</div>
                    <ul className='sub-doc-list'>
                      {cat.documents?.map((doc: any, j: number) => (
                        <li key={j}>
                          <span className='doc-name'>{doc.documentName}</span>
                          {doc.requirements?.length > 0 && <p className='doc-reqs'>{doc.requirements.join(', ')}</p>}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='no-docs'>No required documents listed.</p>
            )}
          </div>

          {supportingDocs.length > 0 && (
            <div className='req-section'>
              <h3>Additional documents required in specific situations</h3>
              <ul className='doc-list'>
                {supportingDocs.map((cat: any, i: number) => (
                  <li
                    key={i}
                    className='doc-category-item'
                  >
                    {cat.docCategory && <div className='category-title'>{cat.docCategory}</div>}
                    {cat.conditions?.length > 0 && <p className='conditions'>Condition: {cat.conditions.join(', ')}</p>}
                    <ul className='sub-doc-list'>
                      {cat.documents?.map((doc: any, j: number) => (
                        <li key={j}>
                          <span className='doc-name'>{doc.documentName}</span>
                          {doc.requirements?.length > 0 && <p className='doc-reqs'>{doc.requirements.join(', ')}</p>}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className='req-modal-footer'>
          <button
            className='btn-secondary'
            onClick={handleDownload}
          >
            Download Guideline
          </button>
          <button
            className='btn-primary'
            onClick={handleApply}
            disabled={isApplyVisaLoading}
          >
            {isApplyVisaLoading ? 'Applying...' : 'Apply Visa'}
          </button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: StoreStateType): StateProps => ({
  tripDetails: state.tripDetails,
});

export const GuidelineModal = connect<StateProps, {}, OwnProps>(mapStateToProps)(GuidelineModalComponent);
