import { TokenData } from '../types';
import {
  ACTION_UPDATE,
  PAYLOAD_UPDATE,
  RESET_STORE_STATE,
  RESPONSE_UPDATE,
  SET_AGENT_DETAILS,
  SET_AUTH_TOKEN,
  SET_RESERVATION_ERROR,
  SET_RESERVATION_LOADING,
  TIMEOUT_UPDATE,
} from './actionTypes';

type PayloadAction = {
  type: typeof PAYLOAD_UPDATE;
  payload?: string;
};

type ActionUpdateAction = {
  type: typeof ACTION_UPDATE;
  payload?: string;
};

type TimeoutAction = {
  type: typeof TIMEOUT_UPDATE;
  payload?: number;
};

type ResponseAction = {
  type: typeof RESPONSE_UPDATE;
  payload?: string;
};

type ResetStoreStateAction = {
  type: typeof RESET_STORE_STATE;
};

type SetReservationLoadingAction = {
  type: typeof SET_RESERVATION_LOADING;
  payload: boolean;
};

type SetReservationErrorAction = {
  type: typeof SET_RESERVATION_ERROR;
  payload: string | null;
};

export type AgentDetails = {
  agentId: string;
  country: string;
  pcc: string;
  username: string;
};

type SetAgentDetailsAction = {
  type: typeof SET_AGENT_DETAILS;
  payload: AgentDetails;
};

type SetAuthTokenAction = {
  type: typeof SET_AUTH_TOKEN;
  payload: TokenData;
};

export type SoapActionTypes =
  | ResponseAction
  | ResetStoreStateAction
  | PayloadAction
  | ActionUpdateAction
  | TimeoutAction
  | SetReservationLoadingAction
  | SetReservationErrorAction
  | SetAgentDetailsAction
  | SetAuthTokenAction;

export const updatePayload = (payload: string) => ({
  type: PAYLOAD_UPDATE,
  payload,
});

export const updateAction = (action: string) => ({
  type: ACTION_UPDATE,
  payload: action,
});

export const updateTimeout = (timeout: number) => ({
  type: TIMEOUT_UPDATE,
  payload: timeout,
});

export const updateResponse = (response: string) => ({
  type: RESPONSE_UPDATE,
  payload: response,
});

export const resetStoreState = () => ({ type: RESET_STORE_STATE });

export const setReservationLoading = (isLoading: boolean) => ({
  type: SET_RESERVATION_LOADING,
  payload: isLoading,
});

export const setReservationError = (error: string | null) => ({
  type: SET_RESERVATION_ERROR,
  payload: error,
});

export const setAgentDetails = (details: AgentDetails) => ({
  type: SET_AGENT_DETAILS,
  payload: details,
});

export const setAuthToken = (tokenData: TokenData) => ({
  type: SET_AUTH_TOKEN,
  payload: tokenData,
});
