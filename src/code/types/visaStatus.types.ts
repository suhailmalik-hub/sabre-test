import { VisaRequirementsParams, VisaRequirementsResponse } from './visaCategory.types';

export interface VisaStatusParams {
  fromCountryCode: string;
  toCountryCode: string;
  nationality: string;
  departureAirportCode: string;
  arrivalAirportCode: string;
  departureDate: string;
  arrivalDate: string;
  returnDate: string;
  passportIssueCountry: string;
  passportExpiryDate: string;
}

export interface VisaStatusResponse {
  success: boolean;
  isRequired: boolean;
  description: string;
  isSupported: boolean;
}

export interface VisaDetails {
  visaStatus: VisaStatusResponse;
  visaCategory: VisaRequirementsResponse | null;
}

export interface VisaDetailsPayload {
  visaStatusPayload: VisaStatusParams;
  visaCategoryPayload: VisaRequirementsParams;
}
