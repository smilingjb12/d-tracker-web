import { DailyStepsChart } from "@/components/daily-steps-chart";
import LoadingIndicator from "@/components/loading-indicator";
import { StepsBar } from "@/components/steps-bar";
import { useQuery } from "convex/react";
import { formatDistance } from "date-fns";
import {
  Clock,
  Footprints,
  MessageCircle,
  RefreshCw,
  User,
} from "lucide-react";
import { api } from "../../convex/_generated/api";

export function Stats() {
  const stats = useQuery(api.records.getStats);

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingIndicator />
      </div>
    );
  }

  const getLastUpdatedString = (epochMilliseconds: number) => {
    const date = new Date(epochMilliseconds);
    return formatDistance(date, new Date(), { addSuffix: true });
  };

  return (
    <div className="space-y-8">
      {/* Top stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Last Updated Card */}
        <div className="group p-5 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10 hover:border-primary/20 transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Clock size={22} strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Last Updated
              </p>
              <p className="text-xl font-display font-medium text-foreground truncate">
                {getLastUpdatedString(stats.lastUpdatedAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Update Interval Card */}
        <div className="group p-5 rounded-2xl bg-gradient-to-br from-warm/5 to-warm/10 border border-warm/10 hover:border-warm/20 transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-warm/10 text-warm">
              <RefreshCw size={22} strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Update Interval
              </p>
              <p className="text-xl font-display font-medium text-foreground">
                {Math.floor(stats.updateIntervalInMinutes)} minutes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Steps Section - Featured */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-accent/30 to-accent/10 border border-accent/20">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <Footprints size={22} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="font-display text-lg font-medium text-foreground">
              Daily Steps
            </h3>
            <p className="text-sm text-muted-foreground">
              Keep moving, you&apos;re doing great
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {stats.dailySteps !== undefined && stats.dailySteps !== null && (
            <StepsBar steps={stats.dailySteps} />
          )}

          {stats.dailyStepsData && stats.dailyStepsData.length > 0 && (
            <DailyStepsChart data={stats.dailyStepsData} />
          )}
        </div>
      </div>

      {/* Contacts Section */}
      {stats.landlord && (
        <div className="p-5 rounded-2xl bg-secondary/50 border border-border/50">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-muted text-muted-foreground">
              <User size={22} strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Emergency Contact
              </p>
              <p className="text-lg font-medium text-foreground mb-1">
                {stats.landlord.name}
              </p>
              <a
                href={`https://wa.me/${stats.landlord.phone?.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <MessageCircle size={16} />
                <span>{stats.landlord.phone}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
