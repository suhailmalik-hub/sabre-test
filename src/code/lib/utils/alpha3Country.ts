import { ALL_COUNTRIES } from './allCountry';

export const getAlpha3Code = (alpha2Code: string): string | undefined => {
  const country = ALL_COUNTRIES.find((c) => c.value === alpha2Code);
  return country ? country.alpha3 : undefined;
};

export const getCountryName = (alpha2Code: string): string | undefined => {
  const country = ALL_COUNTRIES.find((c) => c.value === alpha2Code);
  return country ? country.label : undefined;
};
