import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "Check if device stopped sending data",
  { hours: 3 },
  internal.emails.notifyIfStoppedSendingData
);

export default crons;
