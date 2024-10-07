"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { clearkWebhookHandler } from "./handlers/clerk";

export const webhook = internalAction({
  args: {
    headers: v.any(),
    payload: v.string(),
  },
  handler: async (ctx, args) => {
    return await clearkWebhookHandler(ctx, args);
  },
});
