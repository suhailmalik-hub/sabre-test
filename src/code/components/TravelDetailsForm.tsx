import * as React from 'react';
import { TravelFormData } from '../types';

interface TravelDetailsFormProps {
  tripDetails: {
    fromCountry: string;
    toCountry: string;
    fromDate: string;
    toDate: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  isLoading: boolean;
  onGetGuidelines: (formData: TravelFormData) => void;
}

export const TravelDetailsForm: React.FC<TravelDetailsFormProps> = ({ tripDetails, isLoading, onGetGuidelines }) => {
  const [formData, setFormData] = React.useState<TravelFormData>({
    firstName: tripDetails.firstName,
    lastName: tripDetails.lastName,
    phone: tripDetails.phone,
    email: '',
    sex: '',
    passportIssueCountry: '',
    passportExpiryDate: '',
    passportNationality: '',
    birthDate: '',
    departurePoint: tripDetails.fromCountry,
    departureType: 'AIRPORT',
    departureDateTime: tripDetails.fromDate,
    arrivalPoint: tripDetails.toCountry,
    arrivalType: 'AIRPORT',
    arrivalDateTime: '',
    returnDate: '',
  });

  const [errors, setErrors] = React.useState<Partial<Record<keyof TravelFormData, string>>>({});

  // ... (useEffect remains same) ...
  React.useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      departurePoint: tripDetails.fromCountry,
      departureDateTime: tripDetails.fromDate,
      arrivalPoint: tripDetails.toCountry,
      firstName: tripDetails.firstName,
      lastName: tripDetails.lastName,
      phone: tripDetails.phone,
    }));
  }, [tripDetails]);

  const validateTextOnly = (text: string) => /^[a-zA-Z\s]+$/.test(text);
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TravelFormData, string>> = {};
    let isValid = true;

    // Email
    if (!formData.email) {
      newErrors.email = 'Required *';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid Email';
      isValid = false;
    }

    // Sex
    if (!formData.sex) {
      newErrors.sex = 'Required *';
      isValid = false;
    }

    // Return Date
    if (!formData.returnDate) {
      newErrors.returnDate = 'Required *';
      isValid = false;
    }

    // Passport Issue Country
    if (!formData.passportIssueCountry) {
      newErrors.passportIssueCountry = 'Required *';
      isValid = false;
    } else if (!validateTextOnly(formData.passportIssueCountry)) {
      newErrors.passportIssueCountry = 'Only letters allowed';
      isValid = false;
    }

    // Passport Expiry Date
    if (!formData.passportExpiryDate) {
      newErrors.passportExpiryDate = 'Required *';
      isValid = false;
    }

    // Passport Nationality
    if (!formData.passportNationality) {
      newErrors.passportNationality = 'Required *';
      isValid = false;
    } else if (!validateTextOnly(formData.passportNationality)) {
      newErrors.passportNationality = 'Only letters allowed';
      isValid = false;
    }

    // Birth Date
    if (!formData.birthDate) {
      newErrors.birthDate = 'Required *';
      isValid = false;
    }

    // Arrival Date & Time
    if (!formData.arrivalDateTime) {
      newErrors.arrivalDateTime = 'Required *';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (field: keyof TravelFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = () => {
    // ... (submit logic mostly same, just no deleted fields) ...
    if (validate()) {
      const enhancedData = { ...formData };

      const ensureISO = (dateStr: string) => {
        if (!dateStr) return dateStr;
        if (dateStr.length === 16 && dateStr.includes('T')) {
          const offset = -new Date().getTimezoneOffset();
          const sign = offset >= 0 ? '+' : '-';
          const pad = (num: number) => String(Math.floor(Math.abs(num))).padStart(2, '0');
          const hours = pad(offset / 60);
          const minutes = pad(offset % 60);
          return `${dateStr}:00${sign}${hours}:${minutes}`;
        }
        return dateStr;
      };

      enhancedData.arrivalDateTime = ensureISO(enhancedData.arrivalDateTime);
      if (enhancedData.departureDateTime.includes(' ')) {
        enhancedData.departureDateTime = enhancedData.departureDateTime.replace(' ', 'T');
      }
      if (enhancedData.departureDateTime.includes(' (Local')) {
        enhancedData.departureDateTime = enhancedData.departureDateTime.split(' (')[0];
      }

      onGetGuidelines(enhancedData);
    }
  };

  return (
    <div className='travel-details-form-container'>
      <div className='form-hint'>To proceed with the Travel, please confirm your Details</div>

      <div className='form-grid'>
        {/* Row 1: Names */}
        <div className='form-group'>
          <label className='form-label'>First Name</label>
          <input
            type='text'
            className='form-input disabled'
            value={formData.firstName}
            disabled
          />
        </div>
        <div className='form-group'>
          <label className='form-label'>Last Name</label>
          <input
            type='text'
            className='form-input disabled'
            value={formData.lastName}
            disabled
          />
        </div>

        {/* Row 2: Mobile & Email */}
        <div className='form-group'>
          <label className='form-label'>Mobile Number</label>
          <input
            type='text'
            className='form-input disabled'
            value={formData.phone}
            disabled
          />
        </div>
        <div className='form-group'>
          <label className='form-label'>
            Email Id <span className='required'>*</span>
          </label>
          <input
            type='email'
            className={`form-input ${errors.email ? 'error' : ''}`}
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder='name@example.com'
          />
          {errors.email && <span className='error-text'>{errors.email}</span>}
        </div>

        {/* Row 3: Sex & Birth Date */}
        <div className='form-group'>
          <label className='form-label'>
            Sex <span className='required'>*</span>
          </label>
          <select
            className={`form-select ${errors.sex ? 'error' : ''}`}
            value={formData.sex}
            onChange={(e) => handleChange('sex', e.target.value as any)}
          >
            <option
              value=''
              disabled
            >
              Select Sex
            </option>
            <option value='Male'>Male</option>
            <option value='Female'>Female</option>
            <option value='Unspecified'>Unspecified</option>
          </select>
          {errors.sex && <span className='error-text'>{errors.sex}</span>}
        </div>

        <div className='form-group'>
          <label className='form-label'>
            Birth Date <span className='required'>*</span>
          </label>
          <input
            type='date'
            className={`form-input ${errors.birthDate ? 'error' : ''}`}
            value={formData.birthDate}
            onChange={(e) => handleChange('birthDate', e.target.value)}
          />
          {errors.birthDate && <span className='error-text'>{errors.birthDate}</span>}
        </div>

        {/* Row 4: Passport Info */}
        <div className='form-group'>
          <label className='form-label'>
            Passport Issue Country <span className='required'>*</span>
          </label>
          <input
            type='text'
            className={`form-input ${errors.passportIssueCountry ? 'error' : ''}`}
            value={formData.passportIssueCountry}
            onChange={(e) => handleChange('passportIssueCountry', e.target.value)}
            placeholder='e.g. NL'
          />
          {errors.passportIssueCountry && <span className='error-text'>{errors.passportIssueCountry}</span>}
        </div>

        <div className='form-group'>
          <label className='form-label'>
            Passport Expiry Date <span className='required'>*</span>
          </label>
          <input
            type='date'
            className={`form-input ${errors.passportExpiryDate ? 'error' : ''}`}
            value={formData.passportExpiryDate}
            onChange={(e) => handleChange('passportExpiryDate', e.target.value)}
          />
          {errors.passportExpiryDate && <span className='error-text'>{errors.passportExpiryDate}</span>}
        </div>

        {/* Row 5: Nationalities & Passport Nationality */}
        <div className='form-group'>
          <label className='form-label'>
            Passport Nationality <span className='required'>*</span>
          </label>
          <input
            type='text'
            className={`form-input ${errors.passportNationality ? 'error' : ''}`}
            value={formData.passportNationality}
            onChange={(e) => handleChange('passportNationality', e.target.value)}
            placeholder='e.g. NL'
          />
          {errors.passportNationality && <span className='error-text'>{errors.passportNationality}</span>}
        </div>

        {/* Row 6: Trip - Departure */}
        <div className='form-group'>
          <label className='form-label'>
            Departure Point <span className='required'>*</span>
          </label>
          <input
            type='text'
            className='form-input disabled'
            value={formData.departurePoint}
            disabled
          />
        </div>

        <div className='form-group'>
          <label className='form-label'>
            Flight Departure Date & Time <span className='required'>*</span>
          </label>
          <input
            type='text'
            className='form-input disabled'
            value={formData.departureDateTime}
            disabled
          />
        </div>

        <div className='form-group'>
          <label className='form-label'>
            Departure Type <span className='required'>*</span>
          </label>
          <input
            type='text'
            className='form-input disabled'
            value='AIRPORT'
            disabled
          />
        </div>

        {/* Row 7: Trip - Arrival */}
        <div className='form-group'>
          <label className='form-label'>
            Arrival Point <span className='required'>*</span>
          </label>
          <input
            type='text'
            className='form-input disabled'
            value={formData.arrivalPoint}
            disabled
          />
        </div>

        <div className='form-group'>
          <label className='form-label'>
            Flight Arrival Date & Time <span className='required'>*</span>
          </label>
          <input
            type='datetime-local'
            className={`form-input ${errors.arrivalDateTime ? 'error' : ''}`}
            value={formData.arrivalDateTime}
            onChange={(e) => handleChange('arrivalDateTime', e.target.value)}
          />
          {errors.arrivalDateTime && <span className='error-text'>{errors.arrivalDateTime}</span>}
        </div>

        <div className='form-group'>
          <label className='form-label'>
            Arrival Type <span className='required'>*</span>
          </label>
          <input
            type='text'
            className='form-input disabled'
            value='AIRPORT'
            disabled
          />
        </div>

        {/* Row 8: Return Date */}
        <div className='form-group'>
          <label className='form-label'>
            Return Date <span className='required'>*</span>
          </label>
          <input
            type='date'
            className={`form-input ${errors.returnDate ? 'error' : ''}`}
            value={formData.returnDate}
            onChange={(e) => handleChange('returnDate', e.target.value)}
          />
          {errors.returnDate && <span className='error-text'>{errors.returnDate}</span>}
        </div>
      </div>

      <div className='form-actions'>
        <button
          className='btn-get-guidelines'
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Get Guidelines'}
        </button>
      </div>
    </div>
  );
};
