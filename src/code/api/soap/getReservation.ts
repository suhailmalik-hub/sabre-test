import { ISoapApiService } from 'sabre-ngv-communication/interfaces/ISoapApiService';
import { getService } from '../../Context';
import { setReservationLoading } from '../../store/actions';
import { store } from '../../store/store';
import { parseXml2Js } from '../../lib/utils/xmlParser';

export const getReservation = async (): Promise<string> => {
  store.dispatch(setReservationLoading(true));
  const payload = `
    <GetReservationRQ Version="1.19.10" xmlns="http://webservices.sabre.com/pnrbuilder/v1_19">
      <RequestType>Stateful</RequestType>
      <ReturnOptions>
        <ViewName>Full</ViewName>
      </ReturnOptions>
    </GetReservationRQ>`;

  try {
    const soap: ISoapApiService = getService(ISoapApiService);
    const response: any = await soap.callSws({
      action: 'GetReservationRQ',
      payload: payload,
      authTokenType: 'SESSION',
      timeout: 5000,
    } as any);

    const responseValue: any = response.errorCode ? response : await parseXml2Js(response.value);
    console.log('SABRE-IV Parsed Response:', responseValue);
    store.dispatch(setReservationLoading(false));
    return JSON.stringify(responseValue);
  } catch (error) {
    console.error('API Call failed:', error);
    store.dispatch(setReservationLoading(false));
    throw error;
  }
};
