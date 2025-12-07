import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Constants } from "@/constants";

type DailyStepsChartProps = {
  data: Array<{
    date: string;
    steps: number;
  }>;
  className?: string;
};

export function DailyStepsChart({ data, className }: DailyStepsChartProps) {
  const GOAL = Constants.DAILY_STEPS_GOAL;
  const maxStepsInData = Math.max(...data.map((d) => d.steps));
  const MAX_STEPS = Math.max(GOAL * 1.5, Math.ceil(maxStepsInData / 1000) * 1000);

  const getDayName = (dateString: string, index: number, total: number) => {
    if (index === total - 1) {
      return "Today";
    }
    // Parse date and get short weekday name
    const date = new Date(dateString + "T12:00:00");
    return date.toLocaleDateString(undefined, { weekday: "short" });
  };

  const getBarColor = (steps: number) => {
    if (steps >= GOAL) {
      return "bg-gradient-to-t from-primary to-emerald-400";
    }
    if (steps >= GOAL * 0.7) {
      return "bg-gradient-to-t from-primary/80 to-primary";
    }
    if (steps >= GOAL * 0.4) {
      return "bg-gradient-to-t from-warm/70 to-warm";
    }
    return "bg-gradient-to-t from-muted-foreground/40 to-muted-foreground/60";
  };

  return (
    <div className={cn("w-full pt-8", className)}>
      {/* Chart bars area */}
      <div className="relative px-1" style={{ height: "160px" }}>
        {/* Goal line indicator */}
        <div
          className="absolute left-0 right-0 border-t-2 border-dashed border-primary/30 z-0 pointer-events-none"
          style={{ bottom: `${(GOAL / MAX_STEPS) * 100}%` }}
        />
        {/* Bars */}
        <div className="flex items-end justify-between gap-2 h-full">
          {data.map((day, index) => {
            const percentage = (day.steps / MAX_STEPS) * 100;
            const height = Math.max(percentage, 3);
            const isGoalReached = day.steps >= GOAL;

            return (
              <div
                key={day.date}
                className="flex-1 basis-0 min-w-0 flex items-end justify-center group h-full"
              >
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: `${height}%`, opacity: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className={cn(
                    "w-full max-w-[40px] rounded-t-xl relative overflow-hidden cursor-pointer",
                    "transition-all duration-300 group-hover:scale-105",
                    getBarColor(day.steps)
                  )}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                    <div className="bg-card px-3 py-1.5 rounded-lg shadow-soft-lg border border-border/50 whitespace-nowrap">
                      <span className="text-sm font-medium text-foreground">
                        {day.steps.toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">steps</span>
                    </div>
                    <div className="w-2 h-2 bg-card border-r border-b border-border/50 rotate-45 mx-auto -mt-1" />
                  </div>

                  {/* Goal marker on bar */}
                  {isGoalReached && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.5, duration: 0.3 }}
                      className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white/80"
                    />
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Day labels */}
      <div className="flex justify-between gap-2 px-1 mt-2">
        {data.map((day, index) => (
          <motion.span
            key={day.date}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.3 }}
            className={cn(
              "flex-1 basis-0 min-w-0 text-center text-xs font-medium transition-colors",
              index === data.length - 1
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            {getDayName(day.date, index, data.length)}
          </motion.span>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-gradient-to-t from-primary to-emerald-400" />
          <span>Goal reached</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-gradient-to-t from-warm/70 to-warm" />
          <span>In progress</span>
        </div>
      </div>
    </div>
  );
}
