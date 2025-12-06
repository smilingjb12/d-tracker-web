import { Constants } from "@/constants";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Sparkles, Target } from "lucide-react";

type StepsBarProps = {
  steps: number;
  showBar?: boolean;
};

export function StepsBar({ steps, showBar = true }: StepsBarProps) {
  const MAX_STEPS = Constants.DAILY_STEPS_GOAL;
  const percentage = Math.min(Math.max((steps / MAX_STEPS) * 100, 0), 100);
  const isGoalReached = steps >= MAX_STEPS;

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  if (!showBar) {
    return (
      <span className={cn(
        "font-medium",
        isGoalReached ? "text-primary" : "text-foreground"
      )}>
        {formatNumber(steps)}
      </span>
    );
  }

  return (
    <div className="w-full space-y-3">
      {/* Steps count and goal */}
      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-2">
          <span className={cn(
            "text-4xl font-display font-semibold tracking-tight",
            isGoalReached ? "text-primary" : "text-foreground"
          )}>
            {formatNumber(steps)}
          </span>
          <span className="text-muted-foreground text-sm">steps</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
          <Target size={14} />
          <span>{formatNumber(MAX_STEPS)} goal</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative">
        <div className="w-full h-4 rounded-full bg-muted/50 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className={cn(
              "h-full rounded-full relative",
              isGoalReached
                ? "bg-gradient-to-r from-primary via-primary to-emerald-500"
                : "progress-nature"
            )}
          >
            {/* Animated shine effect */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 3
                }}
                className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
              />
            </div>
          </motion.div>
        </div>

        {/* Percentage indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="absolute -bottom-6 left-0 right-0 flex justify-center"
        >
          <span className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full",
            isGoalReached
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
          )}>
            {Math.round(percentage)}%
          </span>
        </motion.div>
      </div>

      {/* Goal reached celebration */}
      {isGoalReached && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="flex items-center justify-center gap-2 pt-4 text-primary"
        >
          <Sparkles size={16} className="animate-gentle-pulse" />
          <span className="text-sm font-medium">Goal reached! Amazing work!</span>
          <Sparkles size={16} className="animate-gentle-pulse" />
        </motion.div>
      )}
    </div>
  );
}
