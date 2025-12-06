import { Constants } from "@/constants";

type StepsData = {
  percentage: number;
  barColor: string;
  textColor: string;
};

export function useStepsTracker() {
  const calculateStepsData = (steps: number): StepsData => {
    const MAX_STEPS = Constants.DAILY_STEPS_GOAL;
    const percentage = Math.min(Math.max((steps / MAX_STEPS) * 100, 0), 100);

    // Use theme's primary color
    const primaryColor = "hsl(var(--primary))";

    // Special case for exceeding the goal - use primary color
    if (steps > MAX_STEPS) {
      return {
        percentage: 100,
        barColor: primaryColor,
        textColor: primaryColor,
      };
    }

    // For 0 to MAX_STEPS, use the primary color
    // The visual progress is shown by the bar's width
    return {
      percentage,
      barColor: primaryColor,
      textColor: primaryColor,
    };
  };

  return calculateStepsData;
}
