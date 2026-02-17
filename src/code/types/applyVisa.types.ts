export interface Applicant {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  sex: 'Male' | 'Female' | 'Unspecified';
  applicantType: 'D2C' | 'B2B' | string;
  address: Address;
}

export interface Address {
  country: string;
  state: string;
  city: string;
  pin: string;
}

export interface VisaApplication {
  visaFrom: string;
  visaTo: string;
  visaType: string;
  fromDate: string;
  toDate: string;
  nationality: string;
}

export interface VisaApplicationReq {
  applicant: Applicant;
  visaApplication: VisaApplication;
}

export interface ApplyVisaPayload {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  sex: string;
  agentUids: string[];
  applicantType: string;
  address: {
    country: string;
    state: string;
    city: string;
    pin: string;
  };
}

export interface ApplyVisaResponse {
  success: boolean;
  message?: string;
  data?: any;
}
