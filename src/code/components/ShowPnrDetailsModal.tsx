import * as React from 'react';
import { connect } from 'react-redux';
import { getVisaCategory } from '../api/rest/getVisaCategory';
import { getReservation } from '../api/soap/getReservation';
import { StoreStateType } from '../store/store';
import { ISabreResponse, TravelFormData } from '../types';
import { getAirportCountryInfo } from '../lib/utils/airportCountry';
import { getAlpha3Code } from '../lib/utils/alpha3Country';
import { GlobalToastContainer } from '../lib/toast/GlobalToastContainer';
import { RequiredDocumentsModal } from './RequiredDocumentsModal';
import { TravelDetailsForm } from './TravelDetailsForm';
import { VisaRequirement, VisaRequirementCard } from './VisaRequirementCard';

type SoapViewProps = {
  isReservationLoading: boolean;
  reservationError: string | null;
};

const ApplyVisaComponent = ({ isReservationLoading, reservationError }: SoapViewProps) => {
  const [reservationData, setReservationData] = React.useState<string>('');
  const [guidelines, setGuidelines] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  /* State for Trip Details needed by the form */
  const [tripDetails, setTripDetails] = React.useState<{
    fromCountry: string;
    toCountry: string;
    fromDate: string;
    toDate: string;
    firstName: string;
    lastName: string;
    phone: string;
  }>({
    fromCountry: '',
    toCountry: '',
    fromDate: '',
    toDate: '',
    firstName: '',
    lastName: '',
    phone: '',
  });

  const [visaRequirements, setVisaRequirements] = React.useState<VisaRequirement[]>([]);
  const [selectedVisa, setSelectedVisa] = React.useState<VisaRequirement | null>(null);
  const [submittedFormData, setSubmittedFormData] = React.useState<TravelFormData | null>(null);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getReservation();
      console.log('SABRE-IV: Fetched Reservation Data:', JSON.parse(data));
      setReservationData(data);
    } catch (error) {
      console.error('Failed to fetch reservation:', error);
    }
  };

  const handleTravelFormSubmit = async (formData: TravelFormData) => {
    setIsLoading(true);
    setSubmittedFormData(formData);

    try {
      // Prepare Payload
      // Extract YYYY-MM-DD from the ISO strings
      const payload = {
        fromCountryCode: formData.departurePoint, // Assuming Country Code is passed
        toCountryCode: formData.arrivalPoint,
        fromDate: formData.departureDateTime ? formData.departureDateTime.split('T')[0] : '',
        toDate: formData.returnDate ? formData.returnDate.split('T')[0] : '',
      };

      console.log('SABRE-IV Payload Data:', payload);
      console.log('SABRE-IV FORM Data:', formData);

      // Call API
      const response = await getVisaCategory(payload);

      console.log('SABRE-IV API Response:', response);
      setGuidelines(JSON.stringify(response, null, 2));

      // Update state for Card UI
      if (response && response.visa && Array.isArray(response.visa)) {
        setVisaRequirements(response.visa);
      } else {
        setVisaRequirements([]);
      }
    } catch (error) {
      console.error('SABRE-IV: Failed to process form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  let pnr = {
    locator: '',
    createdDate: '',
    agentId: '',
    pcc: '',
    pax: [] as any[],
    segments: [] as any[],
    remarks: [] as string[],
  };

  try {
    if (reservationData) {
      const data = JSON.parse(reservationData) as ISabreResponse;
      const res = data?.['stl19:GetReservationRS']?.['stl19:Reservation']?.[0];

      if (res) {
        // Booking Details
        const booking = res['stl19:BookingDetails']?.[0];
        pnr.locator = booking?.['stl19:RecordLocator']?.[0];
        pnr.createdDate = booking?.['stl19:CreationTimestamp']?.[0];
        pnr.agentId = booking?.['stl19:CreationAgentID']?.[0];

        // POS
        pnr.pcc = res['stl19:POS']?.[0]?.['stl19:Source']?.[0]?.$?.PseudoCityCode || '';

        // Passengers
        const paxList = res['stl19:PassengerReservation']?.[0]?.['stl19:Passengers']?.[0]?.['stl19:Passenger'];
        if (paxList) {
          pnr.pax = paxList.map((p) => ({
            firstName: p['stl19:FirstName']?.[0],
            lastName: p['stl19:LastName']?.[0],
            phone: p['stl19:PhoneNumbers']?.[0]?.['stl19:PhoneNumber']?.[0]?.['stl19:Number']?.[0] || '',
          }));
        }

        // Segments
        const segList = res['stl19:PassengerReservation']?.[0]?.['stl19:Segments']?.[0]?.['stl19:Segment'];
        if (segList) {
          pnr.segments = segList
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
          pnr.remarks = remarks.map((r) => r['stl19:FullText']?.[0]).filter(Boolean) as string[];
        }
      }
    }
  } catch (e) {
    console.error('Parse Error', e);
  }

  // Pre-calculate trip details for form pre-filling if segments exist
  React.useEffect(() => {
    if (pnr.segments.length > 0) {
      const firstSeg = pnr.segments[0];
      const lastSeg = pnr.segments[pnr.segments.length - 1];
      const firstPax = pnr.pax[0] || { firstName: '', lastName: '', phone: '' };

      const resolveCodes = async () => {
        const fromCountry = await getAirportCountryInfo(firstSeg.origin);
        const toCountry = await getAirportCountryInfo(firstSeg.destination); // or lastSeg arrival?

        // Check if we have multiple segments?
        const destCode = lastSeg.destination || firstSeg.destination;
        const toCountryResolved = await getAirportCountryInfo(destCode);

        // Format Departure Date for Display
        // User requested: "2026-07-25 {user Local Time}" meaning the actual time value.
        // firstSeg.depDate is usually ISO-like "2026-07-25T10:00:00"
        let formattedDepDate = firstSeg.depDate ? firstSeg.depDate : '';
        if (formattedDepDate) {
          // Format as YYYY-MM-DD HH:mm (removing T and seconds)
          formattedDepDate = formattedDepDate.replace('T', ' ').substring(0, 16);
        }

        setTripDetails({
          fromCountry: getAlpha3Code(fromCountry.country),
          toCountry: getAlpha3Code(toCountryResolved.country),
          fromDate: formattedDepDate,
          toDate: '',
          firstName: firstPax.firstName || '',
          lastName: firstPax.lastName || '',
          phone: firstPax.phone || '',
        });
      };
      resolveCodes();
    }
  }, [reservationData]);

  return (
    <div className='pnr-container'>
      {/* Global Toast Container for API notifications */}
      <GlobalToastContainer />

      {isReservationLoading ? (
        <div className='loader-container'>
          <div className='spinner'></div>
          <p>Loading</p>
        </div>
      ) : !reservationData ? (
        <div className='empty-state-message'>No PNR Details To Show. Please Try Again!</div>
      ) : (
        <div className='pnr-card'>
          <div className='pnr-header'>
            <div className='header-left'>
              <div className='pnr-locator'>PNR No: {pnr.locator ?? 'N/A'}</div>
              <div className='booking-date'>
                Created Date: {pnr.createdDate ? new Date(pnr.createdDate).toLocaleDateString() : 'N/A'}
              </div>
            </div>
            <div className='header-right'>
              <div className='agency-info'>PCC: {pnr.pcc ?? 'N/A'}</div>
              <div className='agent-id'>Agent: {pnr.agentId ?? 'N/A'}</div>
            </div>
          </div>

          <div className='section-title'>Travelers</div>
          <div className='passenger-section'>
            {pnr.pax.map((p, idx) => (
              <div
                key={idx}
                className='passenger-item'
              >
                <span className='pax-name'>
                  {p.firstName ?? 'N/A'} {p.lastName ?? 'N/A'}
                </span>
                <span className='pax-contact'>{p.phone ?? 'N/A'}</span>
              </div>
            ))}
          </div>

          <div className='section-title'>Itinerary</div>
          {pnr.segments.map((seg, idx) => (
            <div
              key={idx}
              className='flight-segment'
            >
              <div className='flight-main'>
                <div className='airline-logo'>{seg.carrier}</div>
                <div className='route-info'>
                  <div className='stations'>
                    {seg.origin} ➝ {seg.destination}
                  </div>
                  <div className='duration'>
                    {seg.carrierName} #{seg.flightNo} • {seg.duration ? seg.duration.replace('.', 'h ') + 'm' : ''}
                  </div>
                </div>
              </div>
              <div className='flight-details-grid'>
                <div className='detail-item'>
                  <span className='label'>Date</span> {new Date(seg.depDate).toLocaleDateString()}
                </div>
                <div className='detail-item'>
                  <span className='label'>Time</span>{' '}
                  {new Date(seg.depDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className='detail-item'>
                  <span className='label'>Class</span> {seg.class} ({seg.cabin || 'Eco'})
                </div>
                <div className='detail-item'>
                  <span className='label'>Equip</span> {seg.equipment}
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span className='flight-status-badge'>{seg.status === 'HK' ? 'CONFIRMED' : seg.status}</span>
                </div>
              </div>
            </div>
          ))}

          {pnr.remarks.length > 0 && (
            <>
              <div className='section-title'>Remarks</div>
              <div className='remarks-section'>
                {pnr.remarks.map((rem, idx) => (
                  <div
                    key={idx}
                    className='remark-item'
                  >
                    {rem}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Inline Travel Details Form */}
          {pnr.locator && visaRequirements.length === 0 && (
            <TravelDetailsForm
              tripDetails={tripDetails}
              isLoading={isLoading}
              onGetGuidelines={handleTravelFormSubmit}
            />
          )}

          {/* Render Visa Requirement Cards */}
          {visaRequirements.length > 0 ? (
            <div className='travel-details-form-container'>
              <div className='form-hint'>Please select the visa category to proceed</div>
              <div className='visa-card-container'>
                {visaRequirements.map((req, index) => (
                  <VisaRequirementCard
                    key={`${req.visaType}-${index}`}
                    visaRequirement={req}
                    onApply={(visa) => setSelectedVisa(visa)}
                  />
                ))}
              </div>
            </div>
          ) : null}

          <RequiredDocumentsModal
            isOpen={!!selectedVisa}
            visaRequirement={selectedVisa}
            onClose={() => setSelectedVisa(null)}
            tripDetails={tripDetails}
            submittedFormData={submittedFormData}
          />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: StoreStateType) => ({
  isReservationLoading: state.isReservationLoading,
});

export const ApplyVisaModal = connect(mapStateToProps)(ApplyVisaComponent);
