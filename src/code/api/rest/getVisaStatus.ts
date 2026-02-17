import { VISA_BASE_URL } from '../../env';
import { ToastService } from '../../lib/toast/ToastService';
import { VisaStatusParams, VisaStatusResponse } from '../../types';

import { get } from './executor';

const VISA_REQUIREMENTS_ENDPOINT = `${VISA_BASE_URL}/v2/visa/visa-status`;

export const getVisaStatus = async (params: VisaStatusParams): Promise<VisaStatusResponse> => {
  try {
    const {
      fromCountryCode,
      toCountryCode,
      nationality,
      departureAirportCode,
      arrivalAirportCode,
      departureDate,
      arrivalDate,
      returnDate,
      passportIssueCountry,
      passportExpiryDate,
    } = params;

    // Build query string from parameters
    const queryParams = new URLSearchParams({
      fromCountryCode,
      toCountryCode,
      nationality,
      departureAirportCode,
      arrivalAirportCode,
      departureDate,
      arrivalDate,
      returnDate,
      passportIssueCountry,
      passportExpiryDate,
    });

    const apiUrl = `${VISA_REQUIREMENTS_ENDPOINT}?${queryParams.toString()}`;

    const response = await get<VisaStatusResponse>(apiUrl);

    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch visa Status');
    }

    if (!response.data) {
      throw new Error('No data received from visa Status API');
    }

    // Show success notification
    ToastService.showSuccess('Visa Status loaded successfully!');

    return response.data;
  } catch (error) {
    // Error already handled by executor's handleApiError
    throw error;
  }
};
