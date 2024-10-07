"use node";

import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import { payActionHandler, stripeWebhookHandler } from "./handlers/stripe";

export const pay = action({
  args: { stripePriceId: v.string() },
  handler: async (ctx, args) => {
    return await payActionHandler(ctx, args);
  },
});

export const webhook = internalAction({
  args: { signature: v.string(), payload: v.string() },
  handler: async (ctx, args) => {
    return await stripeWebhookHandler(ctx, args);
  },
});
