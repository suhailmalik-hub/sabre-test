import { AUTH_TOKEN_KEY } from '../../env';
import { handleApiError } from '../../lib/utils/apiErrorHandler';
import { getStoreData } from '../../store/store';
import { TokenData } from '../../types';

import { getAuthToken } from './getAuthToken';

export interface ExecutorOptions {
  method: 'GET' | 'POST';
  url: string;
  body?: any;
  headers?: Record<string, string>;
  requireAuth?: boolean;
}

export interface ExecutorResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  status: number;
}

/**
 * Retrieves authentication token from localStorage
 * @returns Parsed auth token object or null if not found
 */
const getAuthTokenFromStorage = (): TokenData | null => {
  try {
    const authTokenString = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!authTokenString) {
      return null;
    }
    return JSON.parse(authTokenString);
  } catch (error) {
    handleApiError(error, 'getAuthTokenFromStorage');
    return null;
  }
};

/**
 * Validates if the token is expired based on expires_at_epoch
 * @param token - Token data object
 * @returns true if token is expired, false otherwise
 */
const isTokenExpired = (token: TokenData | null): boolean => {
  if (!token || !token.expires_at_epoch) {
    return true;
  }

  const currentEpoch = Math.floor(Date.now() / 1000); // Current time in seconds
  const bufferTime = 60; // 60 seconds buffer before actual expiration

  return currentEpoch >= token.expires_at_epoch - bufferTime;
};

/**
 * Ensures a valid token exists, refreshing if necessary
 * @returns Valid token data
 * @throws Error if unable to get valid token
 */
const ensureValidToken = async (): Promise<TokenData> => {
  try {
    // Check if token exists in localStorage
    let token = getAuthTokenFromStorage();

    // If no token or token is expired, get a new one
    if (!token || isTokenExpired(token)) {
      console.log('SABRE-IV: Token missing or expired, fetching new token...');

      // Get credentials from Redux store
      const storeData = getStoreData();
      const agentId = storeData?.agentDetails?.pcc;
      const xApiKey = storeData?.xApiKey;

      if (!agentId) {
        throw new Error('Agent ID not found in store. Please log in again.');
      }

      if (!xApiKey) {
        throw new Error('X-API-Key not found in store. Please log in again.');
      }

      // Get new token
      const authResponse = await getAuthToken(agentId, xApiKey);

      if (!authResponse.data) {
        throw new Error('Failed to get authentication token');
      }

      // Save the new token to localStorage
      token = authResponse.data;
      localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(token));
      console.log('SABRE-IV: New token saved to localStorage');
    }

    return token;
  } catch (error) {
    console.error('SABRE-IV: Failed to ensure valid token:', error);
    throw error;
  }
};

/**
 * Generic API executor for GET and POST requests
 * @param options - Configuration options for the API request
 * @returns Promise resolving to the API response
 * @throws Error if request fails or authentication is required but not available
 */
export const executeApiRequest = async <T = any>(options: ExecutorOptions): Promise<ExecutorResponse<T>> => {
  const { method, url, body, headers = {}, requireAuth = true } = options;

  try {
    // Validate method
    if (method !== 'GET' && method !== 'POST') {
      throw new Error(`Unsupported HTTP method: ${method}`);
    }

    // Validate URL
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid URL provided');
    }

    // Prepare default headers
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers,
    };

    // Add authentication headers if required
    if (requireAuth) {
      // Ensure we have a valid token (will refresh if expired)
      const authToken = await ensureValidToken();

      defaultHeaders['realm-client-id'] = authToken.clientId;
      defaultHeaders['Authorization'] = `Bearer ${authToken.access_token}`;
    }

    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method,
      headers: defaultHeaders,
    };

    // Add body for POST requests
    if (method === 'POST') {
      if (body !== undefined) {
        fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
      }
    }

    // Execute request
    const response = await fetch(url, fetchOptions);

    console.log('SABRE-IV:', response);

    // Handle non-OK responses
    if (!response.ok) {
      const errorMessage = `API request failed: ${response.status} ${response.statusText}`;

      // Try to parse error response body
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        // Ignore if response body is not JSON
      }

      const errorInfo = {
        message: errorData?.message || errorMessage,
        status: response.status,
        data: errorData,
      };

      // Use centralized error handler
      handleApiError(errorInfo, `${method} ${url}`);

      return {
        success: false,
        message: errorInfo.message,
        status: response.status,
        data: errorData,
      };
    }

    // Parse successful response
    const data = await response.json();
    console.log(`SABRE-IV: ${method} ${url} - Success:`, data);

    return {
      success: true,
      data,
      status: response.status,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    // Use centralized error handler
    handleApiError(
      {
        message: errorMessage,
        details: error,
      },
      `${method} ${url}`
    );

    throw new Error(`API ${method} request failed: ${errorMessage}`);
  }
};

/**
 * Convenience method for GET requests
 * @param url - The endpoint URL
 * @param headers - Optional custom headers
 * @param requireAuth - Whether authentication is required (default: true)
 * @returns Promise resolving to the API response
 */
export const get = async <T = any>(
  url: string,
  headers?: Record<string, string>,
  requireAuth: boolean = true
): Promise<ExecutorResponse<T>> => {
  return executeApiRequest<T>({
    method: 'GET',
    url,
    headers,
    requireAuth,
  });
};

/**
 * Convenience method for POST requests
 * @param url - The endpoint URL
 * @param body - Request payload
 * @param headers - Optional custom headers
 * @param requireAuth - Whether authentication is required (default: true)
 * @returns Promise resolving to the API response
 */
export const post = async <T = any>(
  url: string,
  body?: any,
  headers?: Record<string, string>,
  requireAuth: boolean = true
): Promise<ExecutorResponse<T>> => {
  return executeApiRequest<T>({
    method: 'POST',
    url,
    body,
    headers,
    requireAuth,
  });
};
