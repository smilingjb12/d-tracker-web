import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { internalMutation, internalQuery, query } from "./_generated/server";
import {
  addRecordHandler,
  getRecordsPageHandler,
  getStatsHandler,
} from "./handlers/records";

export const getRecordsPage = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await getRecordsPageHandler(ctx, args);
  },
});

export const getMostRecentRecord = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("records").order("desc").first();
  },
});

export const addRecord = internalMutation({
  args: {
    latitude: v.number(),
    longitude: v.number(),
    power: v.number(),
    steps: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await addRecordHandler(ctx, args);
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    return await getStatsHandler(ctx);
  },
});
