export interface GeocodingResult {
  streetAddress?: string;
  city?: string;
  region?: string;
  formattedAddress: string;
}

export interface GeocodingProvider {
  reverseGeocode(point: {
    latitude: number;
    longitude: number;
  }): Promise<GeocodingResult>;
}
