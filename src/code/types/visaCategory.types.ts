export interface VisaRequirementsParams {
  fromCountryCode: string;
  toCountryCode: string;
  fromDate: string;
  toDate: string;
}

export interface VisaFee {
  applicantType: string;
  amount: string;
}

export interface AdditionalNote {
  requirements: string[];
  notes: string[];
  links: string[];
}

export interface VisaMetaData {
  visaName: string;
  visaFees: VisaFee[];
  maxLengthOfStay: string;
  duration: string;
  processingTime: string;
  earliestTimeToApply: string;
  entriesAllowed: string;
  additionalNotes: AdditionalNote[];
  baseUrl: string[];
  syncedAt: string | null;
}

export interface Document {
  documentName: string;
  requirements: string[];
  links: string[];
  category: string;
}

export interface VisaDocumentGuideline {
  docCategory: string;
  documents: Document[];
  notes: string[];
  links: string[];
  mandatory: boolean;
  conditions: string[];
}

export interface VisaInfo {
  fromCountryCode: string;
  toCountryCode: string;
  fromCountryName: string;
  toCountryName: string;
  route: string;
  visaType: string;
  visaCategory: string;
  visaMetaData: VisaMetaData;
  visaDocumentsGuidelines: VisaDocumentGuideline[];
}

export interface VisaRequirementsResponse {
  isSupported: boolean;
  visa: VisaInfo[];
}

export interface VisaFeeInfo {
  applicantType: string;
  amount: string;
}

export interface VisaMetaDataInfo {
  visaName: string;
  visaFees: VisaFee[];
  processingTime: string;
  maxLengthOfStay?: string;
  duration?: string;
  entriesAllowed?: string;
}

export interface VisaRequirement {
  fromCountryCode: string;
  toCountryCode: string;
  fromCountryName?: string;
  toCountryName?: string;
  visaType: string;
  visaCategory: string;
  visaMetaData: VisaMetaDataInfo;
}
