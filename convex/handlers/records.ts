import { internal } from "../_generated/api";
import { ActionCtx, MutationCtx, QueryCtx } from "../_generated/server";
import { ConvexConstants } from "../lib/constants";
import { convexEnv } from "../lib/convexEnv";
import { requireAuthentication, requireReaderRole } from "../lib/helpers";

export const recordsPostHandler = async (ctx: ActionCtx, req: Request) => {
  const record = await req.json();
  console.log("Received record:", record);
  const key = req.headers.get("authorization-key");
  if (key !== convexEnv.API_AUTHORIZATION_KEY) {
    console.warn("Trying to post without a key");
    return new Response(null, {
      status: 401,
    });
  }
  await ctx.runMutation(internal.records.addRecord, record);
  return new Response(null, {
    status: 200,
  });
};

export const getStatsHandler = async (ctx: QueryCtx) => {
  await requireAuthentication(ctx);
  await requireReaderRole(ctx);

  const dailyStepsData = await getLast5DaysStepsData(ctx);
  const last5Records = await ctx.db.query("records").order("desc").take(5);
  const updateIntervalInMinutes = getTimeDifferenceInMinutes(
    last5Records.map((record) => record._creationTime)
  );
  const landlord = await getLandlord(ctx);
  const lastUpdatedAt = last5Records[0]._creationTime;
  const dailySteps = last5Records[0].steps;

  return {
    updateIntervalInMinutes,
    lastUpdatedAt,
    dailySteps,
    landlord,
    dailyStepsData,
  };
};

export const addRecordHandler = async (
  ctx: MutationCtx,
  args: {
    latitude: number;
    longitude: number;
    power: number;
    steps?: number;
    place?: string;
  }
) => {
  await ctx.db.insert("records", args);
  const allItems = await ctx.db.query("records").collect();
  if (allItems.length >= ConvexConstants.RECORD_LIMIT) {
    const oldestItem = allItems[0];
    await ctx.db.delete(oldestItem._id);
  }
};

export const getRecordsPageHandler = async (
  ctx: QueryCtx,
  args: {
    paginationOpts: {
      id?: number | undefined;
      endCursor?: string | null | undefined;
      maximumRowsRead?: number | undefined;
      maximumBytesRead?: number | undefined;
      numItems: number;
      cursor: string | null;
    };
  }
) => {
  await requireAuthentication(ctx);
  await requireReaderRole(ctx);
  const page = await ctx.db
    .query("records")
    .order("desc")
    .paginate(args.paginationOpts);
  return page;
};

export const getMostRecentRecordHandler = async (ctx: QueryCtx) => {
  await requireAuthentication(ctx);
  await requireReaderRole(ctx);
  return await ctx.db.query("records").order("desc").first();
};

export const getMostRecentRecordHandlerInternal = async (ctx: QueryCtx) => {
  return await ctx.db.query("records").order("desc").first();
};

async function getLast5DaysStepsData(ctx: QueryCtx) {
  const now = Date.now();
  const startTime = now - 5 * 24 * 60 * 60 * 1000;
  const records = await ctx.db
    .query("records")
    .withIndex("by_creation_time", (q) => q.gte("_creationTime", startTime))
    .collect();

  const recordsByDay = new Map<string, { date: string; steps: number }>();

  records.forEach((record) => {
    // Use Brussels timezone
    const date = new Date(record._creationTime)
      .toLocaleString("en-CA", {
        timeZone: "Europe/Brussels",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .split(",")[0]; // YYYY-MM-DD format
    const existing = recordsByDay.get(date);
    const currentSteps = record.steps ?? 0;

    // Keep the record with the highest step count for each day
    if (!existing || currentSteps > existing.steps) {
      recordsByDay.set(date, {
        date,
        steps: currentSteps,
      });
    }
  });

  // Convert to array and sort by date
  return Array.from(recordsByDay.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
}

async function getLandlord(ctx: QueryCtx) {
  return await ctx.db
    .query("contacts")
    .filter((q) => q.eq(q.field("type"), "landlord"))
    .first();
}

function getTimeDifferenceInMinutes(timestamps: number[]): number {
  if (timestamps.length < 2) {
    throw new Error(
      "At least two timestamps are required to calculate the difference."
    );
  }

  const sortedTimestamps = timestamps.slice().sort((a, b) => a - b);

  const differences = sortedTimestamps.slice(1).map((timestamp, index) => {
    const diff = timestamp - sortedTimestamps[index];
    return diff / (1000 * 60); // Convert milliseconds to minutes
  });

  const averageDifference =
    differences.reduce((sum, diff) => sum + diff, 0) / differences.length;

  return averageDifference;
}
