import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "Clean up file storage",
  { hourUTC: 0, minuteUTC: 0 },
  internal.files.cleanupFileStorage
);

export default crons;
