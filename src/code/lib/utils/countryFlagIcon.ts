/**
 * Convert country code to flag emoji
 * Supports both ISO 3166-1 alpha-2 and alpha-3 country codes
 * @param countryCode - 2-letter or 3-letter country code (e.g., 'US', 'USA', 'AE', 'ARE')
 * @returns Flag emoji for the country
 */
export const countryFlagIcon = (countryCode: string): string => {
  if (!countryCode) return '';

  // Comprehensive mapping of ISO 3166-1 alpha-3 to alpha-2 codes
  const codeMap: { [key: string]: string } = {
    // Common countries
    USA: 'US', // United States
    GBR: 'GB', // United Kingdom
    CAN: 'CA', // Canada
    AUS: 'AU', // Australia
    IND: 'IN', // India
    CHN: 'CN', // China
    JPN: 'JP', // Japan
    DEU: 'DE', // Germany
    FRA: 'FR', // France
    ITA: 'IT', // Italy
    ESP: 'ES', // Spain
    BRA: 'BR', // Brazil
    RUS: 'RU', // Russia
    ZAF: 'ZA', // South Africa

    // Middle East
    ARE: 'AE', // United Arab Emirates (UAE)
    SAU: 'SA', // Saudi Arabia
    QAT: 'QA', // Qatar
    KWT: 'KW', // Kuwait
    OMN: 'OM', // Oman
    BHR: 'BH', // Bahrain
    JOR: 'JO', // Jordan
    LBN: 'LB', // Lebanon
    ISR: 'IL', // Israel
    IRQ: 'IQ', // Iraq
    IRN: 'IR', // Iran
    TUR: 'TR', // Turkey
    EGY: 'EG', // Egypt

    // Asia
    SGP: 'SG', // Singapore
    MYS: 'MY', // Malaysia
    THA: 'TH', // Thailand
    IDN: 'ID', // Indonesia
    PHL: 'PH', // Philippines
    VNM: 'VN', // Vietnam
    KOR: 'KR', // South Korea
    HKG: 'HK', // Hong Kong
    PAK: 'PK', // Pakistan
    BGD: 'BD', // Bangladesh
    LKA: 'LK', // Sri Lanka
    NPL: 'NP', // Nepal

    // Europe
    NLD: 'NL', // Netherlands
    BEL: 'BE', // Belgium
    CHE: 'CH', // Switzerland
    AUT: 'AT', // Austria
    SWE: 'SE', // Sweden
    NOR: 'NO', // Norway
    DNK: 'DK', // Denmark
    FIN: 'FI', // Finland
    POL: 'PL', // Poland
    PRT: 'PT', // Portugal
    GRC: 'GR', // Greece
    IRL: 'IE', // Ireland
    CZE: 'CZ', // Czech Republic
    HUN: 'HU', // Hungary
    ROU: 'RO', // Romania

    // Africa
    NGA: 'NG', // Nigeria
    KEN: 'KE', // Kenya
    ETH: 'ET', // Ethiopia
    GHA: 'GH', // Ghana
    TZA: 'TZ', // Tanzania
    UGA: 'UG', // Uganda
    MAR: 'MA', // Morocco
    DZA: 'DZ', // Algeria

    // Americas
    MEX: 'MX', // Mexico
    ARG: 'AR', // Argentina
    CHL: 'CL', // Chile
    COL: 'CO', // Colombia
    PER: 'PE', // Peru
    VEN: 'VE', // Venezuela
  };

  let code = countryCode.toUpperCase();

  // Use mapped code if available, otherwise try to use first 2 chars
  if (codeMap[code]) {
    code = codeMap[code];
  } else if (code.length === 3) {
    // Fallback: use first 2 characters (may not always be correct)
    code = code.slice(0, 2);
  }

  // Convert to flag emoji using regional indicator symbols
  const codePoints = code
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));

  return String.fromCodePoint(...codePoints);
};
