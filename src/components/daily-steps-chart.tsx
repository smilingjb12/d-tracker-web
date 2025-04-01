import { cn } from "@/lib/utils";

type DailyStepsChartProps = {
  data: Array<{
    date: string;
    steps: number;
  }>;
  className?: string;
};

export function DailyStepsChart({ data, className }: DailyStepsChartProps) {
  // Find the maximum steps in the data to use as scale
  const maxStepsInData = Math.max(...data.map((d) => d.steps));
  const MAX_STEPS = Math.max(12000, Math.ceil(maxStepsInData / 1000) * 1000);

  return (
    <div className={cn("w-full flex flex-col gap-2", className)}>
      <div className="flex items-end justify-between h-[140px] gap-1">
        {data.map((day) => {
          const percentage = (day.steps / MAX_STEPS) * 100;
          const height = `${Math.max(percentage, 5)}%`;

          // Use the theme's primary color for the bar background
          const barBackgroundColor = "hsl(var(--primary))";
          // Use the theme's primary foreground color for the text
          const stepTextColor = "hsl(var(--primary-foreground))";

          return (
            <div
              key={day.date}
              className="flex-1 relative group min-w-[20px] h-full"
            >
              <div
                className="w-full rounded-t-md absolute bottom-0 transition-colors duration-200 ease-in-out"
                style={{
                  height,
                  background: barBackgroundColor,
                }}
              />
              <div className="absolute inset-x-0 bottom-2 flex justify-center pointer-events-none">
                <div
                  className="text-sm font-medium [writing-mode:vertical-lr] rotate-180 transition-colors duration-200 ease-in-out"
                  style={{
                    color: stepTextColor,
                  }}
                >
                  {day.steps.toLocaleString()}
                </div>
              </div>
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                {new Date(day.date).toLocaleDateString(undefined, {
                  day: "numeric",
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
