import { TPA_BASE_URL } from '../../env';
import { ToastService } from '../../lib/toast/ToastService';
import { ApplyVisaResponse, VisaApplicationReq } from '../../types';

import { post } from './executor';
const TPA_APPLY_VISA_ENDPOINT = `${TPA_BASE_URL}/v1/tpa/applyVisa`;

export const ApplyVisa = async (payload: VisaApplicationReq) => {
  try {
    const response = await post<ApplyVisaResponse>(TPA_APPLY_VISA_ENDPOINT, payload);

    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch visa requirements');
    }

    if (!response.data) {
      throw new Error('No data received from visa requirements API');
    }

    // Show success notification
    ToastService.showSuccess('Visa application initiated successfully! Please check your email for further details.');
    return response.data;
  } catch (error) {
    // Error already handled by executor's handleApiError
    throw error;
  }
};
