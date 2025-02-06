import { cn } from "@/lib/utils";

type StepsBarProps = {
  steps: number;
  showBar?: boolean;
};

export function StepsBar({ steps, showBar = true }: StepsBarProps) {
  const MAX_STEPS = 6000;
  const percentage = Math.min(Math.max((steps / MAX_STEPS) * 100, 0), 100);
  const color =
    steps > MAX_STEPS
      ? "linear-gradient(90deg, #8B5CF6 0%, #D946EF 100%)"
      : `hsla(${percentage * 1.2}, 100%, 50%, 0.9)`;
  const textColor = steps > MAX_STEPS ? "#D946EF" : color;

  return (
    <div
      className={cn(
        "flex flex-col w-full gap-1",
        showBar ? "items-center" : "items-start"
      )}
    >
      <span style={{ color: textColor }}>{steps}</span>
      {showBar && (
        <div className="w-32 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            className="h-2.5 rounded-full"
            style={{
              width: steps > MAX_STEPS ? "100%" : `${percentage}%`,
              background: color,
            }}
          ></div>
        </div>
      )}
    </div>
  );
}
