import { useStepsTracker } from "@/hooks/use-steps-tracker";
import { cn } from "@/lib/utils";

type StepsBarProps = {
  steps: number;
  showBar?: boolean;
};

export function StepsBar({ steps, showBar = true }: StepsBarProps) {
  const calculateStepsData = useStepsTracker();
  const { percentage, barColor, textColor } = calculateStepsData(steps);

  return (
    <div
      className={cn(
        "flex flex-col w-full gap-1",
        showBar ? "items-center" : "items-start"
      )}
    >
      <span style={{ color: textColor }}>{steps}</span>
      {showBar && (
        <div
          className="w-32 rounded-full h-2.5"
          style={{ backgroundColor: "hsl(var(--muted))" }}
        >
          <div
            className="h-2.5 rounded-full"
            style={{
              width: `${percentage}%`,
              background: barColor,
            }}
          ></div>
        </div>
      )}
    </div>
  );
}
