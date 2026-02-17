import { VISA_BASE_URL } from '../../env';
import { ToastService } from '../../lib/toast/ToastService';
import { VisaRequirementsParams, VisaRequirementsResponse } from '../../types';
import { get } from './executor';

const VISA_REQUIREMENTS_ENDPOINT = `${VISA_BASE_URL}/v2/visa/`;

export const getVisaCategory = async (params: VisaRequirementsParams): Promise<VisaRequirementsResponse> => {
  try {
    const { fromCountryCode, toCountryCode, fromDate, toDate } = params;

    // Build query string from parameters
    const queryParams = new URLSearchParams({
      fromCountryCode,
      toCountryCode,
      fromDate,
      toDate,
    });

    const apiUrl = `${VISA_REQUIREMENTS_ENDPOINT}?${queryParams.toString()}`;

    const response = await get<VisaRequirementsResponse>(apiUrl);

    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch visa requirements');
    }

    if (!response.data) {
      throw new Error('No data received from visa requirements API');
    }

    // Show success notification
    ToastService.showSuccess('Visa categories loaded successfully!');

    return response.data;
  } catch (error) {
    // Error already handled by executor's handleApiError
    throw error;
  }
};
