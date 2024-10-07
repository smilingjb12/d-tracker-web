import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { internalMutation, internalQuery, query } from "./_generated/server";
import {
  addCreditsHandler,
  createSignedInUserHandler,
  decrementCreditsHandler,
  getAvailableCreditsHandler,
  getByUserIdHandler,
  getCurrentUserHandler,
} from "./handlers/users";

export const getAvailableCredits = query({
  args: {},
  handler: async (ctx): Promise<number> => {
    return await getAvailableCreditsHandler(ctx);
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx): Promise<Doc<"users"> | null> => {
    return await getCurrentUserHandler(ctx);
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

export const decrementCredits = internalMutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    await decrementCreditsHandler(ctx, args);
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

export const addCredits = internalMutation({
  args: {
    userId: v.string(),
    stripeCheckoutSessionId: v.string(),
    stripeItemId: v.string(),
    creditsToAdd: v.number(),
  },
  handler: async (ctx, args) => {
    return await addCreditsHandler(ctx, args);
  },
});
