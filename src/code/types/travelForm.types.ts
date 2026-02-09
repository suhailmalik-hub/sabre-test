export interface TravelFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  sex: 'Male' | 'Female' | 'Unspecified' | '';
  passportIssueCountry: string;
  passportExpiryDate: string;
  passportNationality: string;
  birthDate: string;
  departurePoint: string;
  departureType: string;
  departureDateTime: string;
  arrivalPoint: string;
  arrivalType: string;
  arrivalDateTime: string;
  returnDate: string;
}
