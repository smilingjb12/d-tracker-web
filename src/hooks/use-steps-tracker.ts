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

    // Special gradient for exceeding the goal
    if (steps > MAX_STEPS) {
      return {
        percentage: 100,
        barColor: "linear-gradient(90deg, #8B5CF6 0%, #D946EF 100%)",
        textColor: "#D946EF",
      };
    }

    // For 0 to MAX_STEPS, transition from red (0deg) to green (120deg)
    const hue = (percentage / 100) * 120; // This gives us 0° (red) to 120° (green)
    const color = `hsla(${hue}, 100%, 50%, 0.9)`;

    return {
      percentage,
      barColor: color,
      textColor: color,
    };
  };

  return calculateStepsData;
}
