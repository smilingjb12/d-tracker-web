import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { internalMutation, internalQuery, query } from "./_generated/server";
import {
  createSignedInUserHandler,
  getByUserIdHandler,
  getCurrentUserHandler,
} from "./handlers/users";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx): Promise<Doc<"users"> | null> => {
    return await getCurrentUserHandler(ctx);
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
