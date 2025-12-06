import LoadingIndicator from "@/components/loading-indicator";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center organic-bg">
      <div className="text-center">
        <LoadingIndicator />
        <p className="mt-4 text-muted-foreground text-sm animate-gentle-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}
