import * as React from 'react';
import { VisaRequirement } from '../types';
import { VisaCard } from './VisaCard';

interface VisaCategoryListProps {
  visaCategories: VisaRequirement[];
  onSelectVisa: (visa: VisaRequirement) => void;
}

export const VisaCategoryList: React.FC<VisaCategoryListProps> = ({ visaCategories, onSelectVisa }) => {
  return (
    <div className='travel-details-form-container'>
      <div className='form-hint'>Please select the visa category to proceed</div>
      <div className='visa-card-container'>
        {visaCategories.map((req, index) => (
          <VisaCard
            key={`${req.visaType}-${index}`}
            visaRequirement={req}
            onApply={onSelectVisa}
          />
        ))}
      </div>
    </div>
  );
};
