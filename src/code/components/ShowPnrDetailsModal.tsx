import * as React from 'react';
import { connect } from 'react-redux';
import { usePnr } from '../hooks/use-pnr';
import { useVisa } from '../hooks/use-visa';
import { GlobalToastContainer } from '../lib/toast/GlobalToastContainer';
import { setPnrData } from '../store/actions';
import { StoreStateType } from '../store/store';
import { PnrData, VisaDetailsPayload, VisaRequirement } from '../types';
import { GuidelineModal } from './GuidelineModal';
import { IataStatus } from './IataStatus';
import { NotSupportedModal } from './NotSupportedModal';
import { PnrDetails } from './PnrDetails';
import { TravelDetailsForm } from './TravelDetailsForm';
import { VisaCategoryList } from './VisaCategoryList';

const ApplyVisaComponent = ({
  setPnrData,
  pnrData,
}: {
  setPnrData: (pnrData: PnrData | null) => void;
  pnrData: PnrData | null;
}) => {
  const [selectedVisa, setSelectedVisa] = React.useState<VisaRequirement | null>(null);
  const [isFlightBooking, setIsFlightBooking] = React.useState<boolean>(true);
  const [showNotSupportedModal, setShowNotSupportedModal] = React.useState<boolean>(false);
  const { fetchPnrDetails, pnrDetails, isPnrLoading } = usePnr();
  const { isVisaDetailsLoading, visaDetails, fetchVisaDetails } = useVisa();

  console.log('SABRE-IV Data Obtained from REDUX', pnrData);
  console.log('SABRE-IV VISA DETAILS ', visaDetails);

  React.useEffect(() => {
    fetchPnrDetails();
  }, []);

  React.useEffect(() => {
    if (pnrDetails) {
      const res = pnrDetails?.['stl19:GetReservationRS']?.['stl19:Reservation']?.[0];
      const _pnr: PnrData = {
        locator: '',
        createdDate: '',
        agentId: '',
        pcc: '',
        pax: [] as any[],
        segments: [] as any[],
        remarks: [] as string[],
      };

      // Check if this is a flight booking
      let hasFlightSegments = false;

      if (res) {
        // Booking Details
        const booking = res['stl19:BookingDetails']?.[0];
        _pnr.locator = booking?.['stl19:RecordLocator']?.[0];
        _pnr.createdDate = booking?.['stl19:CreationTimestamp']?.[0];
        _pnr.agentId = booking?.['stl19:CreationAgentID']?.[0];

        // POS
        _pnr.pcc = res['stl19:POS']?.[0]?.['stl19:Source']?.[0]?.$?.PseudoCityCode || '';

        // Passengers
        const paxList = res['stl19:PassengerReservation']?.[0]?.['stl19:Passengers']?.[0]?.['stl19:Passenger'];
        if (paxList) {
          _pnr.pax = paxList.map((p) => ({
            firstName: p['stl19:FirstName']?.[0],
            lastName: p['stl19:LastName']?.[0],
            phone: p['stl19:PhoneNumbers']?.[0]?.['stl19:PhoneNumber']?.[0]?.['stl19:Number']?.[0] || '',
          }));
        }

        // Segments - Check for flight segments
        const segList = res['stl19:PassengerReservation']?.[0]?.['stl19:Segments']?.[0]?.['stl19:Segment'];
        if (segList) {
          // Check if any segment has Air data
          hasFlightSegments = segList.some((seg: any) => seg['stl19:Air']);

          _pnr.segments = segList
            .map((seg: any) => {
              const air = seg['stl19:Air']?.[0];
              if (air) {
                return {
                  origin: air['stl19:DepartureAirport']?.[0],
                  destination: air['stl19:ArrivalAirport']?.[0],
                  depDate: air['stl19:DepartureDateTime']?.[0],
                  arrDate: air['stl19:ArrivalDateTime']?.[0],
                  flightNo: air['stl19:FlightNumber']?.[0],
                  carrier: air['stl19:MarketingAirlineCode']?.[0],
                  carrierName: air['stl19:OperatingAirlineShortName']?.[0],
                  duration: air['stl19:ElapsedTime']?.[0],
                  equipment: air['stl19:EquipmentType']?.[0],
                  class: air['stl19:ClassOfService']?.[0],
                  cabin: air['stl19:Cabin']?.[0]?.$?.Name,
                  status: air['stl19:ActionCode']?.[0],
                  meal: air['stl19:Meal']?.[0]?.$?.Code,
                };
              }
              return null;
            })
            .filter((s: any) => s !== null);
        }

        // Remarks
        const remarks = res['stl19:PassengerReservation']?.[0]?.['stl19:GenericSpecialRequests'];
        if (remarks) {
          _pnr.remarks = remarks.map((r) => r['stl19:FullText']?.[0]).filter(Boolean) as string[];
        }
      }

      // Update flight booking status
      setIsFlightBooking(hasFlightSegments);

      // Show not supported modal if no flight segments
      if (!hasFlightSegments) {
        console.log('SABRE-IV: Non-flight booking detected');
        setShowNotSupportedModal(true);
      }

      setPnrData(_pnr);
    }
  }, [pnrDetails]);

  const handleTravelFormSubmit = (payload: VisaDetailsPayload) => {
    console.warn('SABRE-IV Payload', payload);
    fetchVisaDetails(payload);
    console.log('SABRE-IV API Response:', visaDetails);
  };

  return (
    <div className='pnr-container'>
      {/* Global Toast Container for API notifications */}
      <GlobalToastContainer />

      {isPnrLoading ? (
        <div className='loader-container'>
          <div className='spinner'></div>
          <p>Loading</p>
        </div>
      ) : !pnrData?.locator ? (
        <div className='empty-state-message'>No PNR Details To Show. Please Try Again!</div>
      ) : (
        <div className='pnr-card'>
          <PnrDetails pnr={pnrData} />
        </div>
      )}

      {pnrData?.locator && !visaDetails && (
        <TravelDetailsForm
          isLoading={isVisaDetailsLoading}
          onGetGuidelines={handleTravelFormSubmit}
        />
      )}

      {!isVisaDetailsLoading && visaDetails?.visaStatus && <IataStatus visaStatus={visaDetails.visaStatus} />}

      {!isVisaDetailsLoading && visaDetails?.visaCategory?.visa?.length > 0 && (
        <VisaCategoryList
          visaCategories={visaDetails.visaCategory.visa}
          onSelectVisa={setSelectedVisa}
        />
      )}

      <NotSupportedModal
        isOpen={showNotSupportedModal}
        onClose={() => setShowNotSupportedModal(false)}
      />

      <GuidelineModal
        isOpen={!!selectedVisa}
        visaRequirement={selectedVisa}
        onClose={() => setSelectedVisa(null)}
      />
    </div>
  );
};

const mapStateToProps = (state: StoreStateType) => ({
  pnrData: state.pnrData,
});

const mapDispatchToProps = {
  setPnrData,
};

export const ApplyVisaModal = connect(mapStateToProps, mapDispatchToProps)(ApplyVisaComponent);
