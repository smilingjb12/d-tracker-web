import LoadingIndicator from "@/components/loading-indicator";
import { useQuery } from "convex/react";
import { formatDistance } from "date-fns";
import { api } from "../../convex/_generated/api";

export function Stats() {
  const stats = useQuery(api.records.getStats);
  if (!stats) {
    return <LoadingIndicator />;
  }

  const getLastUpdatedString = (epochMilliseconds: number) => {
    const date = new Date(epochMilliseconds);
    return formatDistance(date, new Date(), { addSuffix: true });
  };

  const StatItem = ({ title, value }: { title: string; value: string }) => {
    return (
      <div className="flex flex-col justify-start gap-x-10 items-center whitespace-nowrap gap-y-1">
        <div className="font-bold text-lg text-primary">{title}</div>
        <div className="text-xl">{value}</div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-y-8 mx-auto max-w-fit">
      <StatItem
        title="Last Updated"
        value={getLastUpdatedString(stats.lastUpdatedAt)}
      />
      <StatItem
        title="Update Interval"
        value={Math.floor(stats.updateIntervalInMinutes) + " minutes"}
      />
    </div>
  );
}
