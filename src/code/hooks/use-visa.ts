import * as React from 'react';
import { ApplyVisa } from '../api/rest/applyVisa';
import { getVisaCategory } from '../api/rest/getVisaCategory';
import { getVisaStatus } from '../api/rest/getVisaStatus';
import {
  ApplyVisaResponse,
  VisaApplicationReq,
  VisaRequirementsParams,
  VisaRequirementsResponse,
  VisaStatusParams,
  VisaStatusResponse,
} from '../types';

export interface VisaDetails {
  visaStatus: VisaStatusResponse;
  visaCategory: VisaRequirementsResponse | null;
}

export const useVisa = () => {
  // Apply Visa
  const [isApplyVisaLoading, setIsApplyVisaLoading] = React.useState<boolean>(false);
  const [applyVisaResponse, setApplyVisaResponse] = React.useState<ApplyVisaResponse | null>(null);

  const applyVisaApplication = async (params: VisaApplicationReq) => {
    setIsApplyVisaLoading(true);
    try {
      const response = await ApplyVisa(params);
      setApplyVisaResponse(response as unknown as ApplyVisaResponse);
      setIsApplyVisaLoading(false);
    } catch (error) {
      console.error(error);
      setIsApplyVisaLoading(false);
    }
  };

  // Fetch Visa Details
  const [isVisaDetailsLoading, setIsVisaDetailsLoading] = React.useState<boolean>(false);
  const [visaDetails, setVisaDetails] = React.useState<VisaDetails | null>(null);

  const fetchVisaDetails = async ({
    visaStatusPayload,
    visaCategoryPayload,
  }: {
    visaStatusPayload: VisaStatusParams;
    visaCategoryPayload: VisaRequirementsParams;
  }) => {
    setIsVisaDetailsLoading(true);
    try {
      const visaStatusResponse = await getVisaStatus(visaStatusPayload);
      if (visaStatusResponse && visaStatusResponse.success && visaStatusResponse.isSupported) {
        const visaCategoryResponse = await getVisaCategory(visaCategoryPayload);
        setVisaDetails({ visaStatus: visaStatusResponse, visaCategory: visaCategoryResponse });
      }
      setIsVisaDetailsLoading(false);
    } catch (error) {
      console.error(error);
      setIsVisaDetailsLoading(false);
    }
  };

  return {
    // Apply Visa
    isApplyVisaLoading,
    applyVisaResponse,
    applyVisaApplication,

    // Fetch Visa Details
    isVisaDetailsLoading,
    visaDetails,
    fetchVisaDetails,
  };
};
