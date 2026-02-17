import * as React from 'react';
import { AgentProfileService } from 'sabre-ngv-app/app/services/impl/AgentProfileService';
import { EventBusService } from 'sabre-ngv-app/app/services/impl/EventBusService';
import { Module } from 'sabre-ngv-core/modules/Module';
import { ReactModalOptions } from 'sabre-ngv-modals/components/PublicReactModal/ReactModalOptions';
import { PublicModalsService } from 'sabre-ngv-modals/services/PublicModalService';
import { RedAppSidePanelButton } from 'sabre-ngv-redAppSidePanel/models/RedAppSidePanelButton';
import { PNR_SESSION_UPDATED_EVENT } from 'sabre-ngv-sdk-events/events';
import { PnrSessionUpdatedEventData } from 'sabre-ngv-sdk-events/interfaces/PnrSessionUpdatedEventData';
import { RedAppSidePanelConfig } from 'sabre-ngv-xp/configs/RedAppSidePanelConfig';
import { ExtensionPointService } from 'sabre-ngv-xp/services/ExtensionPointService';
import { getAuthToken } from './api/rest/getAuthToken';
import { ApplyVisaModal } from './components/ShowPnrDetailsModal';
import { getService } from './Context';
import { AUTH_TOKEN_KEY } from './env';
import { setAgentDetails, setAuthToken } from './store/actions';
import { store } from './store/store';

export class Main extends Module {
  private modalService: PublicModalsService = getService(PublicModalsService);
  private eventBusService: EventBusService = getService(EventBusService);
  private agentProfileService = getService(AgentProfileService);

  init(): void {
    super.init();

    // 1. Create the side panel configuration
    const sidePanelConfig = new RedAppSidePanelConfig(
      [new RedAppSidePanelButton('Visa Requirement - Intellivisa', 'btn btn-secondary', () => this.applyVisaModal())],
      100
    ); // Priority

    // 2. Register the button to the side panel extension point
    getService(ExtensionPointService).addConfig('redAppSidePanel', sidePanelConfig);

    // 3. Setup automatic trigger on PNR creation/update
    this.setupPnrEventListener();

    // 4. Authentication for TPA service
    this.initializeAuthentication();
  }

  applyVisaModal = () => {
    const ngvModalOptions: ReactModalOptions = {
      header: 'Check Visa Requirements - Intellivisa',
      component: React.createElement(ApplyVisaModal),
      store: store,
    };
    this.modalService.showReactModal(ngvModalOptions);
  };

  /**
   * Setup event listener to automatically trigger workflow on PNR creation
   */
  private setupPnrEventListener(): void {
    this.eventBusService.listenToEventBus(PNR_SESSION_UPDATED_EVENT, (data: PnrSessionUpdatedEventData) => {
      console.log('SABRE-IV: PNR_SESSION_UPDATED_EVENT received', data);
      // Check if we have a valid PNR record locator
      if (data.recordLocator && data.recordLocator.trim() !== '') {
        // Automatically trigger your workflow
        this.applyVisaModal();
      }
    });

    console.log('SABRE-IV: PNR event listener registered successfully');
  }

  private async initializeAuthentication(): Promise<void> {
    const agentDetails = {
      agentId: this.agentProfileService.getAgentId(),
      country: this.agentProfileService.getCountry(),
      pcc: this.agentProfileService.getPcc(),
      username: this.agentProfileService.getUsername(),
    };
    // Save agent details to Redux store
    store.dispatch(setAgentDetails(agentDetails));

    // Get xApiKey from store for API calls
    const state = store.getState();
    const storedApiKey = state.xApiKey;

    if (agentDetails && agentDetails.pcc && storedApiKey) {
      const state = store.getState();
      const agentId = state.agentDetails?.pcc;
      const xApiKey = state.xApiKey;
      const authTokenResponse = await getAuthToken(agentId, xApiKey);

      // Save auth token to Redux store
      store.dispatch(setAuthToken(authTokenResponse.data));

      // Save auth token to localStorage
      localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(authTokenResponse.data));
      console.log('SABRE-IV: Auth token saved to store and localStorage');
    } else {
      console.warn('SABRE-IV: Missing required data for Auth Token fetch');
    }
  }
}
