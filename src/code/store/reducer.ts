import { TPA_API_KEY } from '../env';
import { PnrData, TokenData, TravelFormData } from '../types';

export type AgentDetails = {
  agentId: string;
  country: string;
  pcc: string;
  username: string;
};

export type PnrDetails = {
  response: string;
  isReservationLoading: boolean;
  reservationError: string | null;
  agentDetails: AgentDetails | null;
  xApiKey: string | null;
  authToken: TokenData | null;
  pnrData: PnrData | null;
  tripDetails: TravelFormData | null;
};

const initialState: PnrDetails = {
  response: '',
  isReservationLoading: false,
  reservationError: null,
  agentDetails: null,
  xApiKey: TPA_API_KEY,
  authToken: null,
  pnrData: null,
  tripDetails: null,
};

export const soapReducer = (state = initialState, action: { type: string; payload?: any }): PnrDetails => {
  switch (action.type) {
    case 'RESPONSE_UPDATE':
      return { ...state, response: action.payload, isReservationLoading: false };
    case 'SET_RESERVATION_LOADING':
      return { ...state, isReservationLoading: action.payload, reservationError: null };
    case 'SET_RESERVATION_ERROR':
      return { ...state, reservationError: action.payload, isReservationLoading: false };
    case 'SET_AGENT_DETAILS':
      return { ...state, agentDetails: action.payload };
    case 'SET_AUTH_TOKEN':
      return { ...state, authToken: action.payload };
    case 'SET_PNR_DATA':
      return { ...state, pnrData: action.payload };
    case 'SET_TRIP_DETAILS':
      return { ...state, tripDetails: action.payload };
    case 'RESET_STORE_STATE':
      return initialState;
    default:
      return state;
  }
};
