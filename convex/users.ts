import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { internalMutation, internalQuery, query } from "./_generated/server";
import {
  createSignedInUserHandler,
  getByUserIdHandler,
  getCurrentUserHandler,
} from "./handlers/users";
import { requireAuthentication, requireReaderRole } from "./lib/helpers";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx): Promise<Doc<"users"> | null> => {
    return await getCurrentUserHandler(ctx);
  },
});

export const getLastKnownLocation = query({
  args: {},
  handler: async (ctx) => {
    await requireAuthentication(ctx);
    await requireReaderRole(ctx);
    const latestRecord = await ctx.db.query("records").order("desc").first();
    return { lat: latestRecord?.latitude, lng: latestRecord?.longitude };
  },
});

export const getOwnerUsers = internalQuery({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users.filter((u) => u.roles.includes("owner"));
  },
});

export const getRoles = query({
  args: {},
  handler: async (ctx): Promise<("reader" | "owner")[]> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }
    const user = await getCurrentUserHandler(ctx);
    return user?.roles ?? [];
  },
});

export const createSignedInUser = internalMutation({
  args: {
    userId: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    return await createSignedInUserHandler(ctx, args);
  },
});

export const getByUserId = internalQuery({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await getByUserIdHandler(ctx, args);
  },
});
