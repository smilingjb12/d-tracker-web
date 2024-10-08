import { internal } from "../_generated/api";
import { ActionCtx, MutationCtx, QueryCtx } from "../_generated/server";
import { requireAuthentication, requireReaderRole } from "../lib/helpers";

const ITEM_LIMIT = 3000;

export const recordsPostHandler = async (ctx: ActionCtx, req: Request) => {
  const record = await req.json();
  console.log("Received record:", record);
  await ctx.runMutation(internal.records.addRecord, record);
  return new Response(null, {
    status: 200,
  });
};

export const getStatsHandler = async (ctx: QueryCtx) => {
  await requireAuthentication(ctx);
  await requireReaderRole(ctx);
  const lastFiveRecords = await ctx.db.query("records").order("desc").take(5);
  const updateIntervalInMinutes = getTimeDifferenceInMinutes(
    lastFiveRecords.map((record) => record._creationTime)
  );
  const lastUpdatedAt = lastFiveRecords[0]._creationTime;
  return {
    updateIntervalInMinutes,
    lastUpdatedAt,
  };
};

export const addRecordHandler = async (
  ctx: MutationCtx,
  args: {
    latitude: number;
    longitude: number;
    power: number;
  }
) => {
  await ctx.db.insert("records", args);
  const allItems = await ctx.db.query("records").collect();
  if (allItems.length >= ITEM_LIMIT) {
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
