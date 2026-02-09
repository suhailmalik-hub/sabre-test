export interface TokenData {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at_epoch: number;
  scope: string;
  clientId: string;
}

export interface AuthTokenApiResponse {
  success: boolean;
  message: string;
  data: TokenData;
}
