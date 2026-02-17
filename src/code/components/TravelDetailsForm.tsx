import * as React from 'react';
import { connect } from 'react-redux';
import { getAirportCountryInfo } from '../lib/utils/airportCountry';

import { ALL_COUNTRIES } from '../lib/utils/allCountry';
import { getAlpha3Code, getCountryName } from '../lib/utils/alpha3Country';
import { setTripDetails } from '../store/actions';
import { StoreStateType } from '../store/store';
import { PnrData, TravelFormData, VisaDetailsPayload } from '../types';

interface OwnProps {
  isLoading: boolean;
  onGetGuidelines: (payload: VisaDetailsPayload) => void;
}

interface StateProps {
  pnrData: PnrData | null;
}

interface DispatchProps {
  setTripDetails: (tripDetails: TravelFormData | null) => void;
}

type TravelDetailsFormProps = OwnProps & StateProps & DispatchProps;

const TravelDetailsFormComponent: React.FC<TravelDetailsFormProps> = ({
  isLoading,
  onGetGuidelines,
  pnrData,
  setTripDetails,
}) => {
  console.log('PNR Details from Redux from Travel Details', pnrData);
  const [formData, setFormData] = React.useState<TravelFormData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    sex: '',
    passportIssueCountry: '',
    passportExpiryDate: '',
    nationality: '',
    departureAirportCode: '',
    departureDateTime: '',
    arrivalAirportCode: '',
    arrivalDateTime: '',
    returnDate: '',
    fromCountry: '',
    toCountry: '',
  });
  const [errors, setErrors] = React.useState<Partial<Record<keyof TravelFormData, string>>>({});

  const populateFormData = async () => {
    if (pnrData && pnrData.segments.length > 0) {
      const firstSeg = pnrData.segments[0];
      const lastSeg = pnrData.segments[pnrData.segments.length - 1];
      const firstPax = pnrData.pax[0] || { firstName: '', lastName: '', phone: '' };
      const departureAirportCode = lastSeg.origin || firstSeg.origin;
      const arrivalAirportCode = lastSeg.destination || firstSeg.destination;

      const departureCountry = (await getAirportCountryInfo(departureAirportCode)).country;
      const arrivalCountry = (await getAirportCountryInfo(arrivalAirportCode)).country;

      let formattedDepDate = '';
      if (firstSeg.depDate) {
        const datePart = firstSeg.depDate.split('T')[0]; // "2026-07-25"
        const [year, month, day] = datePart.split('-');
        formattedDepDate = `${day}/${month}/${year}`;
      }

      setFormData((prev) => ({
        ...prev,
        firstName: firstPax.firstName || '',
        lastName: firstPax.lastName || '',
        phone: firstPax.phone || '',
        departureAirportCode: firstSeg.origin,
        arrivalAirportCode: lastSeg.destination,
        departureDateTime: formattedDepDate,
        fromCountry: getCountryName(departureCountry) || '',
        toCountry: getCountryName(arrivalCountry) || '',
      }));
    }
  };

  // Auto-populate form fields from PNR data in Redux
  React.useEffect(() => {
    populateFormData();
  }, [pnrData]);

  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper function to get minimum arrival date (departure date or today, whichever is earlier)
  const getMinArrivalDate = () => {
    if (formData.departureDateTime) {
      // Convert DD/MM/YYYY to YYYY-MM-DD
      let depDate = formData.departureDateTime;
      if (depDate.includes('/')) {
        const [day, month, year] = depDate.split('/');
        depDate = `${year}-${month}-${day}`;
      }
      return depDate;
    }
    return getTodayDate();
  };

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
    } else if (formData.returnDate < getTodayDate()) {
      newErrors.returnDate = 'Must be a future date';
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
    } else if (formData.passportExpiryDate < getTodayDate()) {
      newErrors.passportExpiryDate = 'Must be a future date';
      isValid = false;
    }

    // Passport Nationality
    if (!formData.nationality) {
      newErrors.nationality = 'Required *';
      isValid = false;
    } else if (!validateTextOnly(formData.nationality)) {
      newErrors.nationality = 'Only letters allowed';
      isValid = false;
    }

    // Arrival Date & Time
    if (!formData.arrivalDateTime) {
      newErrors.arrivalDateTime = 'Required *';
      isValid = false;
    } else if (formData.departureDateTime && formData.arrivalDateTime) {
      // Convert DD/MM/YYYY to YYYY-MM-DD for comparison
      let depDate = formData.departureDateTime;
      if (depDate.includes('/')) {
        const [day, month, year] = depDate.split('/');
        depDate = `${year}-${month}-${day}`;
      }
      if (formData.arrivalDateTime < depDate) {
        newErrors.arrivalDateTime = 'Must be on or after departure date';
        isValid = false;
      }
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

  const handleSubmit = async () => {
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

      // Format the API payload
      const fromCountryCode = (await getAirportCountryInfo(enhancedData.departureAirportCode)).country;
      const toCountryCode = (await getAirportCountryInfo(enhancedData.arrivalAirportCode)).country;

      const apiPayload: VisaDetailsPayload = {
        visaStatusPayload: {
          fromCountryCode: getAlpha3Code(fromCountryCode),
          toCountryCode: getAlpha3Code(toCountryCode),
          nationality: enhancedData.nationality,
          departureAirportCode: enhancedData.departureAirportCode,
          arrivalAirportCode: enhancedData.arrivalAirportCode,
          departureDate: enhancedData.departureDateTime
            ? enhancedData.departureDateTime.split('/').reverse().join('-')
            : '',
          arrivalDate: enhancedData.arrivalDateTime,
          returnDate: enhancedData.returnDate,
          passportIssueCountry: enhancedData.passportIssueCountry,
          passportExpiryDate: enhancedData.passportExpiryDate,
        },
        visaCategoryPayload: {
          fromCountryCode: getAlpha3Code(fromCountryCode),
          toCountryCode: getAlpha3Code(toCountryCode),
          fromDate: enhancedData.departureDateTime ? enhancedData.departureDateTime.split('/').reverse().join('-') : '',
          toDate: enhancedData.returnDate ? enhancedData.returnDate : '',
        },
      };

      // Store trip details in Redux
      setTripDetails(enhancedData);
      console.log('SABRE-IV Trip Details stored in Redux:', enhancedData);
      onGetGuidelines(apiPayload);
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

        {/* Row 4: Passport Info */}
        <div className='form-group'>
          <label className='form-label'>
            Nationality <span className='required'>*</span>
          </label>
          <select
            className={`form-input ${errors.nationality ? 'error' : ''}`}
            value={formData.nationality}
            onChange={(e) => handleChange('nationality', e.target.value)}
          >
            <option value=''>Select Nationality</option>
            {ALL_COUNTRIES.map((country) => (
              <option
                key={country.value}
                value={country.value}
              >
                {country.label}
              </option>
            ))}
          </select>
          {errors.nationality && <span className='error-text'>{errors.nationality}</span>}
        </div>

        <div className='form-group'>
          <label className='form-label'>
            Passport Issue Country <span className='required'>*</span>
          </label>
          <select
            className={`form-input ${errors.passportIssueCountry ? 'error' : ''}`}
            value={formData.passportIssueCountry}
            onChange={(e) => handleChange('passportIssueCountry', e.target.value)}
          >
            <option value=''>Select Country</option>
            {ALL_COUNTRIES.map((country) => (
              <option
                key={country.value}
                value={country.value}
              >
                {country.label}
              </option>
            ))}
          </select>
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
            min={getTodayDate()}
          />
          {errors.passportExpiryDate && <span className='error-text'>{errors.passportExpiryDate}</span>}
        </div>

        {/* Row 6: Trip - Departure */}
        <div className='form-group'>
          <label className='form-label'>
            Departure Airport Code <span className='required'>*</span>
          </label>
          <input
            type='text'
            className='form-input disabled'
            value={formData.departureAirportCode}
            disabled
          />
        </div>

        <div className='form-group'>
          <label className='form-label'>
            From Country <span className='required'>*</span>
          </label>
          <input
            type='text'
            className='form-input disabled'
            value={formData.fromCountry}
            disabled
          />
        </div>

        <div className='form-group'>
          <label className='form-label'>
            Arrival Airport Code <span className='required'>*</span>
          </label>
          <input
            type='text'
            className='form-input disabled'
            value={formData.arrivalAirportCode}
            disabled
          />
        </div>

        <div className='form-group'>
          <label className='form-label'>
            To Country <span className='required'>*</span>
          </label>
          <input
            type='text'
            className='form-input disabled'
            value={formData.toCountry}
            disabled
          />
        </div>

        {/* Row 7: Trip - Arrival */}
        <div className='form-group'>
          <label className='form-label'>
            Departure Date <span className='required'>*</span>
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
            Arrival Date <span className='required'>*</span>
          </label>
          <input
            type='date'
            className={`form-input ${errors.arrivalDateTime ? 'error' : ''}`}
            value={formData.arrivalDateTime}
            onChange={(e) => handleChange('arrivalDateTime', e.target.value)}
            min={getMinArrivalDate()}
          />
          {errors.arrivalDateTime && <span className='error-text'>{errors.arrivalDateTime}</span>}
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
            min={getTodayDate()}
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

const mapStateToProps = (state: StoreStateType): StateProps => ({
  pnrData: state.pnrData,
});

const mapDispatchToProps = {
  setTripDetails,
};

export const TravelDetailsForm = connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(TravelDetailsFormComponent);
