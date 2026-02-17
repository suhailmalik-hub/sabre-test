import React from 'react';
import { getAuthToken } from '../api/rest/getAuthToken';
import { AuthTokenApiResponse } from '../types';

export const useAuthToken = () => {
  // Fetch Auth Token
  const [isAuthTokenLoading, setIsAuthTokenLoading] = React.useState<boolean>(false);
  const [authTokenResponse, setAuthTokenResponse] = React.useState<AuthTokenApiResponse | null>(null);

  const fetchAuthToken = async (agentId: string, xApiKey: string) => {
    setIsAuthTokenLoading(true);
    try {
      const response = await getAuthToken(agentId, xApiKey);
      setAuthTokenResponse(response as unknown as AuthTokenApiResponse);
      setIsAuthTokenLoading(false);
    } catch (error) {
      console.error(error);
      setIsAuthTokenLoading(false);
    }
  };

  return {
    // Fetch Auth Token
    isAuthTokenLoading,
    authTokenResponse,
    fetchAuthToken,
  };
};
