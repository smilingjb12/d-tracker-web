import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { internalMutation, internalQuery, query } from "./_generated/server";
import {
  createSignedInUserHandler,
  getByUserIdHandler,
  getCurrentUserHandler,
  getLastKnownLocationsHandler,
  getRolesHandler,
} from "./handlers/users";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx): Promise<Doc<"users"> | null> => {
    return await getCurrentUserHandler(ctx);
  },
});

export const getLastKnownLocations = query({
  args: {},
  handler: async (ctx) => {
    return await getLastKnownLocationsHandler(ctx);
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
    return await getRolesHandler(ctx);
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
