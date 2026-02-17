// ---  export interfaces for Sabre Response ---
export interface ISabreResponse {
  'stl19:GetReservationRS'?: {
    'stl19:Reservation'?: Reservation[];
  };
}

export interface Reservation {
  'stl19:BookingDetails'?: BookingDetails[];
  'stl19:PassengerReservation'?: PassengerReservation[];
  'stl19:POS'?: POS[];
}

export interface BookingDetails {
  'stl19:RecordLocator'?: string[];
  'stl19:CreationTimestamp'?: string[];
  'stl19:CreationAgentID'?: string[];
  'stl19:DivideSplitDetails'?: string[];
}

export interface POS {
  'stl19:Source'?: { $: { PseudoCityCode: string; AgentSine: string } }[];
}

export interface PassengerReservation {
  'stl19:Passengers'?: Passengers[];
  'stl19:Segments'?: Segments[];
  'stl19:TicketingInfo'?: TicketingInfo[];
  'stl19:GenericSpecialRequests'?: GenericSpecialRequest[];
}

export interface TicketingInfo {
  'stl19:TicketingTimeLimit'?: { 'stl19:Time'?: string[] }[];
}

export interface GenericSpecialRequest {
  'stl19:FullText'?: string[];
  'stl19:Code'?: string[];
}

export interface Passengers {
  'stl19:Passenger'?: Passenger[];
}

export interface Passenger {
  $: { id: string };
  'stl19:FirstName'?: string[];
  'stl19:LastName'?: string[];
  'stl19:PhoneNumbers'?: { 'stl19:PhoneNumber'?: { 'stl19:Number'?: string[] }[] }[];
}

export interface Segments {
  'stl19:Segment'?: SegmentWrapper[];
}

export interface SegmentWrapper {
  'stl19:Air'?: AirSegment[];
}

export interface AirSegment {
  'stl19:DepartureAirport'?: string[];
  'stl19:ArrivalAirport'?: string[];
  'stl19:DepartureDateTime'?: string[];
  'stl19:ArrivalDateTime'?: string[];
  'stl19:FlightNumber'?: string[];
  'stl19:OperatingAirlineShortName'?: string[];
  'stl19:MarketingAirlineCode'?: string[];
  'stl19:ElapsedTime'?: string[]; // Duration
  'stl19:AirMilesFlown'?: string[];
  'stl19:EquipmentType'?: string[];
  'stl19:ClassOfService'?: string[];
  'stl19:ActionCode'?: string[]; // HK, etc.
  'stl19:Cabin'?: { $: { Name: string } }[];
  'stl19:Meal'?: { $: { Code: string } }[];
}

// --- PNR Data Interfaces for Redux Store ---
export interface PnrPax {
  firstName: string;
  lastName: string;
  phone: string;
}

export interface PnrSegment {
  origin: string;
  destination: string;
  depDate: string;
  arrDate: string;
  flightNo: string;
  carrier: string;
  carrierName: string;
  duration: string;
  equipment: string;
  class: string;
  cabin: string;
  status: string;
  meal: string;
}

export interface PnrData {
  locator: string;
  createdDate: string;
  agentId: string;
  pcc: string;
  pax: PnrPax[];
  segments: PnrSegment[];
  remarks: string[];
}
