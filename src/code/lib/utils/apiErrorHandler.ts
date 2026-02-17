/**
 * API Error Handler
 * Centralized error handling for all API calls
 */

import { ToastService } from '../toast/ToastService';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

/**
 * Error types for different HTTP status codes
 */
export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Determines error type based on status code
 */
const getErrorType = (status?: number): ErrorType => {
  if (!status) return ErrorType.NETWORK_ERROR;
  if (status === 401) return ErrorType.AUTHENTICATION_ERROR;
  if (status === 403) return ErrorType.AUTHORIZATION_ERROR;
  if (status === 404) return ErrorType.NOT_FOUND;
  if (status >= 400 && status < 500) return ErrorType.VALIDATION_ERROR;
  if (status >= 500) return ErrorType.SERVER_ERROR;
  if (status === 408) return ErrorType.TIMEOUT_ERROR;

  return ErrorType.UNKNOWN_ERROR;
};

/**
 * Gets user-friendly error message based on error type
 */
const getUserFriendlyMessage = (errorType: ErrorType, originalMessage?: string): string => {
  switch (errorType) {
    case ErrorType.NETWORK_ERROR:
      return 'Something went wrong. Please try again.';
    case ErrorType.AUTHENTICATION_ERROR:
      return 'Authentication failed.';
    case ErrorType.AUTHORIZATION_ERROR:
      return 'You do not have permission to perform this action.';
    case ErrorType.NOT_FOUND:
      return 'The requested resource was not found.';
    case ErrorType.VALIDATION_ERROR:
      return originalMessage || 'Invalid request. Please check your input.';
    case ErrorType.SERVER_ERROR:
      return 'Server error. Please try again later.';
    case ErrorType.TIMEOUT_ERROR:
      return 'Request timed out. Please try again.';
    case ErrorType.UNKNOWN_ERROR:
    default:
      return originalMessage || 'An unexpected error occurred. Please try again.';
  }
};

/**
 * Main error handler function
 * Processes API errors and displays appropriate messages
 *
 * @param error - The error object from API call
 * @param context - Optional context about where the error occurred
 */
export const handleApiError = (error: any, context?: string): void => {
  try {
    const apiError: ApiError = {
      message: error?.message || 'Unknown error',
      status: error?.status || error?.response?.status,
      code: error?.code,
      details: error?.response?.data || error?.data,
    };

    const errorType = getErrorType(apiError.status);
    const userMessage = getUserFriendlyMessage(errorType, apiError.message);

    // Context for debugging
    const errorContext = context ? `[${context}]` : '[API Error]';

    // Show user-friendly error toast
    ToastService.showError(userMessage);

    console.error(`${errorContext}`, {
      type: errorType,
      status: apiError.status,
      originalMessage: apiError.message,
      details: apiError.details,
      userMessage: userMessage,
    });
    console.error('Full error details:', error);
  } catch (handlerError) {
    // Fallback if error handler itself fails
    console.error('Error in error handler:', handlerError);
    console.error('Original error:', error);
  }
};

/**
 * Extracts error message from various error formats
 */
export const extractErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.data?.message) return error.data.message;
  return 'An unexpected error occurred';
};

/**
 * Checks if error is a network error
 */
export const isNetworkError = (error: any): boolean => {
  return !error?.status && !error?.response?.status;
};

/**
 * Checks if error is an authentication error
 */
export const isAuthenticationError = (error: any): boolean => {
  const status = error?.status || error?.response?.status;
  return status === 401;
};
