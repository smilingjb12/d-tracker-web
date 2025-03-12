import { GeocodingProvider, GeocodingResult } from "./types";

export class GoogleMapsProvider implements GeocodingProvider {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  async reverseGeocode(point: {
    latitude: number;
    longitude: number;
  }): Promise<GeocodingResult> {
    // Implement Google Maps geocoding logic here
    // Return data in the standardized GeocodingResult format
    throw new Error("Not implemented");
  }
}
