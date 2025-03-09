import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { internalMutation, internalQuery, query } from "./_generated/server";
import { UserService } from "./services/user.service";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx): Promise<Doc<"users"> | null> => {
    return await UserService.getCurrentUser(ctx);
  },
});

export const getLastKnownLocations = query({
  args: {},
  handler: async (ctx) => {
    return await UserService.getLastKnownLocations(ctx);
  },
});

export const getRoles = query({
  args: {},
  handler: async (ctx): Promise<("reader" | "owner")[]> => {
    return await UserService.getRoles(ctx);
  },
});

export const getOwnerUsers = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await UserService.getOwnerUsers(ctx);
  },
});

export const createSignedInUser = internalMutation({
  args: {
    userId: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    return await UserService.createSignedInUser(ctx, args);
  },
});
