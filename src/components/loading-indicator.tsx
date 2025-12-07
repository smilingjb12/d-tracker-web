import { cn } from "@/lib/utils";

export default function LoadingIndicator({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      data-testid="loading-indicator"
      className={cn(
        "w-full h-full flex items-center justify-center p-4",
        className
      )}
    >
      <div className="relative">
        {/* Outer ring */}
        <div className="w-10 h-10 rounded-full border-2 border-primary/20 animate-spin" style={{ animationDuration: '2s' }} />
        {/* Spinning arc */}
        <div
          className="absolute inset-0 w-10 h-10 rounded-full border-2 border-transparent border-t-primary animate-spin"
          style={{ animationDuration: '1s' }}
        />
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-primary animate-gentle-pulse" />
        </div>
      </div>
    </div>
  );
}
