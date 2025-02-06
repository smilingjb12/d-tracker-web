"use client";

import { Card, CardContent } from "@/components/ui/card";
import { GeocodedLocation } from "@/components/geocoded-location";
import LoadingIndicator from "@/components/loading-indicator";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";

const LocationMap = dynamic(() => import("../location-map"), {
  ssr: false,
  loading: () => <LoadingIndicator />,
});

export default function MapView() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set visible after mount to ensure proper initialization
    setIsVisible(true);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full"
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="space-y-6">
            <GeocodedLocation />
            <Suspense fallback={<LoadingIndicator />}>
              {isVisible && <LocationMap />}
            </Suspense>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
