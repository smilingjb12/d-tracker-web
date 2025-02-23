import { DailyStepsChart } from "@/components/daily-steps-chart";
import LoadingIndicator from "@/components/loading-indicator";
import { StepsBar } from "@/components/steps-bar";
import { useQuery } from "convex/react";
import { formatDistance } from "date-fns";
import { PhoneIcon, UserIcon } from "lucide-react";
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

  const StatItem = ({
    title,
    value,
  }: {
    title: string;
    value: React.ReactNode;
  }) => {
    return (
      <div className="flex flex-col justify-start gap-x-10 items-center whitespace-nowrap gap-y-1">
        <div className="font-bold text-lg text-primary">{title}</div>
        <div className="text-xl">{value}</div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto w-full max-w-4xl md:justify-between">
      <StatItem
        title="Last Updated"
        value={getLastUpdatedString(stats.lastUpdatedAt)}
      />
      <StatItem
        title="Update Interval"
        value={Math.floor(stats.updateIntervalInMinutes) + " minutes"}
      />
      <StatItem
        title="Daily Steps"
        value={
          <div className="flex flex-col items-center gap-4 w-full">
            {stats.dailySteps ? (
              <StepsBar steps={stats.dailySteps} />
            ) : (
              stats.dailySteps
            )}
            {stats.dailyStepsData && (
              <DailyStepsChart className="mb-3" data={stats.dailyStepsData} />
            )}
          </div>
        }
      />
      <StatItem
        title="Contacts"
        value={
          <div className="flex flex-col items-center justify-center text-lg">
            <div className="flex flex-col justify-center items-center">
              <div className="flex flex-row items-center">
                <UserIcon size="20" className="mr-1" />
                {stats.landlord?.name}
              </div>{" "}
              <div className="flex flex-row items-center">
                <PhoneIcon size="18" className="mr-1" />
                {stats.landlord?.phone} (WhatsApp)
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
}
