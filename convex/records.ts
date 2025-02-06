import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { internalMutation, internalQuery, query } from "./_generated/server";
import {
  addRecordHandler,
  getRecordsPageHandler,
  getStatsHandler,
  getMostRecentRecordHandler,
  getMostRecentRecordHandlerInternal,
} from "./handlers/records";
import { requireAuthentication, requireReaderRole } from "./lib/helpers";

export const getRecordsPage = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await getRecordsPageHandler(ctx, args);
  },
});

export const getMostRecentRecord = query({
  args: {},
  handler: async (ctx) => {
    return await getMostRecentRecordHandler(ctx);
  },
});

export const getMostRecentRecordInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await getMostRecentRecordHandlerInternal(ctx);
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
