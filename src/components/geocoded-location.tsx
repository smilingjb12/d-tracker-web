import { GeocodingProvider } from "@/lib/geocoding/types";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";
import { GeocodeXYZProvider } from "../lib/geocoding/geocode-xyz-provider";
import LoadingIndicator from "./loading-indicator";

const defaultProvider: GeocodingProvider = new GeocodeXYZProvider();

export interface GeocodedLocationProps {
  geocodingProvider?: GeocodingProvider;
}

export function GeocodedLocation({
  geocodingProvider = defaultProvider,
}: GeocodedLocationProps) {
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
      } catch {
        setLocation("N/A");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocation();
  }, [lastRecord, geocodingProvider]);

  if (isLoading) {
    return (
      <div className="h-6 flex items-center">
        <div className="w-4 h-4">
          <LoadingIndicator className="scale-50 origin-left" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`transition-opacity duration-300 ${
        location === "N/A" ? "opacity-50 text-muted-foreground" : "opacity-100"
      }`}
    >
      {location || "Unknown location"}
    </div>
  );
}
