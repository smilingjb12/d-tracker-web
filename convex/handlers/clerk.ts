"use node";

import { Webhook, WebhookRequiredHeaders } from "svix";
import { ActionCtx } from "../_generated/server";
import { convexEnv } from "../lib/convexEnv";

// Clerk webhook event type (defined inline to avoid importing @clerk/nextjs/server in Convex)
type WebhookEvent = {
  type: string;
  data: {
    id: string;
    email_addresses: Array<{ email_address: string }>;
    [key: string]: unknown;
  };
  object: string;
};

export const clearkWebhookHandler = async (
  ctx: ActionCtx,
  args: { headers: WebhookRequiredHeaders; payload: string }
) => {
  const wh = new Webhook(convexEnv.CLERK_WEBHOOK_SECRET);
  const payload = wh.verify(args.payload, args.headers) as WebhookEvent;
  return payload;
};
