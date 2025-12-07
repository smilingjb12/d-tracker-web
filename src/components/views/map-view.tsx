import { GeocodedLocation } from "@/components/geocoded-location";
import LoadingIndicator from "@/components/loading-indicator";
import { lazy, Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const LocationMap = lazy(() => import("../location-map"));

export default function MapView() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
    >
      {/* Location card */}
      <div className="bg-card/80 backdrop-blur-sm rounded-3xl border border-border/50 shadow-soft overflow-hidden">
        {/* Address section */}
        <div className="p-6 border-b border-border/50">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-accent/50 text-accent-foreground">
              <MapPin size={22} strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Current Location
              </p>
              <div className="text-lg font-medium text-foreground">
                <GeocodedLocation />
              </div>
            </div>
          </div>
        </div>

        {/* Map section */}
        <div className="p-4">
          <Suspense
            fallback={
              <div className="h-[400px] rounded-2xl bg-muted/30 flex items-center justify-center">
                <LoadingIndicator />
              </div>
            }
          >
            {isVisible && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="rounded-2xl overflow-hidden shadow-soft"
              >
                <LocationMap />
              </motion.div>
            )}
          </Suspense>
        </div>
      </div>
    </motion.div>
  );
}
