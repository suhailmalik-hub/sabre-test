export interface TravelFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  sex: 'Male' | 'Female' | 'Unspecified' | '';
  passportIssueCountry: string;
  passportExpiryDate: string;
  nationality: string;
  departureAirportCode: string;
  departureDateTime: string;
  arrivalAirportCode: string;
  arrivalDateTime: string;
  returnDate: string;
  fromCountry: string;
  toCountry: string;
}
