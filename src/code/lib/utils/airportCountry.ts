import { getService } from 'sabre-ngv-app/app/getService';
import { IEncodeDecodePublicService } from 'sabre-ngv-app/app/services/impl/IEncodeDecodePublicService';
import { Domain } from 'sabre-ngv-app/app/services/impl/encodeDecode/Domain';

export async function getAirportCountryInfo(airportCode: string): Promise<{ airport: string; country: string }> {
  const edService: IEncodeDecodePublicService = getService(IEncodeDecodePublicService);

  const results = await edService.decode(Domain.AIRPORTS_COUNTRYCODE, airportCode);

  // Parse the result (format: "AIRPORTCODE-COUNTRYCODE")
  const [airport, country] = results[0].split('-').map((s) => s.trim());

  return { airport, country };
}
