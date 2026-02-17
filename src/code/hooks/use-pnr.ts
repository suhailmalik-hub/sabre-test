import * as React from 'react';
import { getReservation } from '../api/soap/getReservation';
import { ISabreResponse } from '../types';

export const usePnr = () => {
  const [isPnrLoading, setIsPnrLoading] = React.useState<boolean>(false);
  const [pnrDetails, setPnrDetails] = React.useState<ISabreResponse | null>(null);

  const fetchPnrDetails = async () => {
    setIsPnrLoading(true);
    try {
      const data = await getReservation();
      console.log('SABRE-IV: Fetched Reservation Data:', JSON.parse(data));
      setPnrDetails(JSON.parse(data));
      setIsPnrLoading(false);
    } catch (error) {
      console.error('Failed to fetch PNR details:', error);
      setIsPnrLoading(false);
    }
  };

  return {
    fetchPnrDetails,
    pnrDetails,
    isPnrLoading,
  };
};
