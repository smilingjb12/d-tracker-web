import { useEffect, useState } from "react";
import LoadingIndicator from "./loading-indicator";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { GeocodeXYZProvider } from "../lib/geocoding/geocode-xyz-provider";
import { GeocodingProvider } from "@/lib/geocoding/types";

const geocodingProvider: GeocodingProvider = new GeocodeXYZProvider();

export function GeocodedLocation() {
  const [location, setLocation] = useState<string | null>("N/A");
  const [isLoading, setIsLoading] = useState(true);
  const lastRecord = useQuery(api.records.getMostRecentRecord);

  useEffect(() => {
    if (!lastRecord) {
      setIsLoading(false);
      setLocation("N/A");
      return;
    }

    const fetchLocation = async () => {
      try {
        const result = await geocodingProvider.reverseGeocode({
          latitude: lastRecord.latitude,
          longitude: lastRecord.longitude,
        });

        setLocation(result.formattedAddress);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocation();
  }, [lastRecord, geocodingProvider]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div
      className={`text-lg mb-1 ${location === "N/A" ? "opacity-0" : "opacity-100"}`}
    >
      {location}
    </div>
  );
}
