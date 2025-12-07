import LoadingIndicator from "@/components/loading-indicator";
import { Button } from "@/components/ui/button";
import { StepsBar } from "@/components/steps-bar";
import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";
import {
  Battery,
  ExternalLink,
  Footprints,
  MapPin,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Coords = { lat: number; long: number };

export function LogsTable() {
  const PAGE_SIZE = 20;
  const knownLocations = useQuery(api.knownLocations.getKnownLocations);
  const { results, isLoading, loadMore, status } = usePaginatedQuery(
    api.records.getRecordsPage,
    {},
    { initialNumItems: PAGE_SIZE }
  );

  function formatToDateTime(unixTimestamp: number): string {
    const date = new Date(unixTimestamp);
    return date.toLocaleString("en-UK", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  function coordinatesAreSimilar(point1: Coords, point2: Coords) {
    const roundToFive = (num: number) => Math.round(num * 1000) / 1000;
    return (
      roundToFive(point1.lat) === roundToFive(point2.lat) &&
      roundToFive(point2.long) === roundToFive(point2.long)
    );
  }

  function getCoordiantesDisplay(latitude: number, longitude: number): string {
    const defaultDisplay = `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`;
    if (!knownLocations) {
      return defaultDisplay;
    }
    const knownLocation = knownLocations?.find((loc) =>
      coordinatesAreSimilar(
        { lat: loc.latitude, long: loc.longitude },
        { lat: latitude, long: longitude }
      )
    );
    if (knownLocation) {
      return knownLocation.name;
    }
    return defaultDisplay;
  }

  const PowerIndicator = ({ power }: { power: number }) => {
    const percentage = Math.min(Math.max(power, 0), 100);

    const getColor = () => {
      if (percentage >= 60) return "bg-primary";
      if (percentage >= 30) return "bg-warm";
      return "bg-destructive";
    };

    return (
      <div className="flex items-center gap-2">
        <Battery size={16} className="text-muted-foreground" />
        <div className="w-12 h-2 rounded-full bg-muted/50 overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all", getColor())}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm text-muted-foreground w-8">{power}%</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Records list - card style for mobile-first design */}
      <div className="space-y-3">
        {results?.map((r, index) => (
          <motion.div
            key={r._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03, duration: 0.3 }}
            className="p-4 rounded-2xl bg-secondary/30 border border-border/30 hover:border-border/50 hover:bg-secondary/50 transition-all duration-300"
          >
            {/* Top row: Location and time */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://www.google.com/maps?q=${r.latitude},${r.longitude}`}
                className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors group"
              >
                <MapPin size={16} className="flex-shrink-0" />
                <span className="font-medium group-hover:underline">
                  {getCoordiantesDisplay(r.latitude, r.longitude)}
                </span>
                <ExternalLink
                  size={12}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </a>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar size={14} />
                <span>{formatToDateTime(r._creationTime)}</span>
              </div>
            </div>

            {/* Bottom row: Power and Steps */}
            <div className="flex items-center justify-between gap-4">
              <PowerIndicator power={r.power} />

              <div className="flex items-center gap-2">
                <Footprints size={16} className="text-muted-foreground" />
                <StepsBar steps={r.steps ?? 0} showBar={false} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load more button */}
      {status === "CanLoadMore" && (
        <div className="flex justify-center pt-4">
          <Button
            variant="secondary"
            onClick={() => loadMore(PAGE_SIZE)}
            className="rounded-full px-6 shadow-soft hover:shadow-soft-lg transition-all duration-300"
          >
            <ChevronDown size={18} className="mr-2" />
            Load More
          </Button>
        </div>
      )}

      {/* Empty state */}
      {results?.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No records found
        </div>
      )}
    </div>
  );
}
