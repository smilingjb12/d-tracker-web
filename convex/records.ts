import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";
import { getRecordsPageHandler } from "./handlers/records";
import { requireAuthentication } from "./lib/helpers";

export const getRecordsPage = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    await requireAuthentication(ctx);
    return await getRecordsPageHandler(ctx, args);
  },
});

export const addRecord = internalMutation({
  args: { latitude: v.number(), longitude: v.number(), power: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("records", args);
  },
});
