import { TPA_BASE_URL } from '../../env';
import { handleApiError } from '../../lib/utils/apiErrorHandler';
import { AuthTokenApiResponse } from '../../types';

import { post } from './executor';

const TPA_TOKEN_ENDPOINT = `${TPA_BASE_URL}/v1/tpa/token`;

export const getAuthToken = async (agentId: string, xApiKey: string): Promise<AuthTokenApiResponse> => {
  try {
    if (!xApiKey) {
      throw new Error('X-API-Key not found in store');
    }

    const response = await post<AuthTokenApiResponse>(
      TPA_TOKEN_ENDPOINT,
      {},
      {
        'x-api-key': xApiKey,
        'tpa-id': agentId,
      },
      false // Don't require auth since this function gets the token
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch auth token');
    }
    return response.data;
  } catch (error) {
    handleApiError(error, 'getAuthToken');
    throw error;
  }
};
