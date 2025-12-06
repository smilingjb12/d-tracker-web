import { GeocodingProvider, GeocodingResult } from "./types";

interface GeocodeXYZResponse {
  city?: string;
  region?: string;
  prov?: string;
  standard?: {
    addresst?: string;
    staddress?: string;
    region?: string;
    countryname?: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

export class GeocodeXYZProvider implements GeocodingProvider {
  async reverseGeocode(
    point: { latitude: number; longitude: number },
    retries = 3,
    delay = 1000
  ): Promise<GeocodingResult> {
    try {
      const response = await fetch(
        `https://geocode.xyz/${point.latitude},${point.longitude}?json=1`
      );

      const data: GeocodeXYZResponse = await response.json();

      // Check if any field contains the throttling message
      if (data.city?.includes("Throttled!") && retries > 0) {
        // If rate limited, wait and retry
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.reverseGeocode(point, retries - 1, delay * 2);
      }

      if (data.error) {
        throw new Error(`Geocoding error: ${data.error.message}`);
      }

      const parts = [
        data.standard?.addresst || data.standard?.staddress,
        data.city,
        data.standard?.countryname || data.prov,
      ].filter((part) => part && !part.includes("Throttled!"));

      return {
        streetAddress: data.standard?.addresst || data.standard?.staddress,
        city: data.city,
        region: data.standard?.region?.split(",")[1]?.trim(),
        formattedAddress: parts.join(", ") || "N/A",
      };
    } catch (error) {
      console.error("Failed to fetch location:", error);
      return {
        formattedAddress: "N/A",
      };
    }
  }
}
