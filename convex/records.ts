import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { internalMutation, internalQuery, query } from "./_generated/server";
import { requireAuthentication, requireReaderRole } from "./lib/helpers";
import { RecordService } from "./services/record.service";

export const getRecordsPage = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    await requireAuthentication(ctx);
    await requireReaderRole(ctx);
    return await RecordService.getRecordsPage(ctx, args);
  },
});

export const getMostRecentRecord = query({
  args: {},
  handler: async (ctx) => {
    await requireAuthentication(ctx);
    await requireReaderRole(ctx);
    return await RecordService.getMostRecentRecord(ctx);
  },
});

export const getMostRecentRecordInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await RecordService.getMostRecentRecord(ctx);
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
    return await RecordService.addRecord(ctx, args);
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    await requireAuthentication(ctx);
    await requireReaderRole(ctx);
    return await RecordService.getStats(ctx);
  },
});
