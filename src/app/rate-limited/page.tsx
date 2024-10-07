export default function RateLimitedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full mx-auto max-w-screen-lg pt-24 text-center">
      <div className="text-4xl mb-4">429</div>
      We{"'"}ve detected an unusual amount of requests coming from your device.
      Please wait a few minutes before trying again.
    </div>
  );
}
