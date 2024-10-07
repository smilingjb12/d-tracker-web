import { defineRateLimits } from "convex-helpers/server/rateLimit";
import { MutationCtx } from "../_generated/server";

export const SECOND = 1000; // ms
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;
const NAME = "activity";

const { checkRateLimit, rateLimit } = defineRateLimits({
  activity: { kind: "token bucket", rate: 10, period: MINUTE, capacity: 15 },
});

const checkActivityRate = async (ctx: MutationCtx, userId: string) => {
  await checkRateLimit(ctx, { name: NAME, key: userId, throws: true });
};

const recordActivityRate = async (ctx: MutationCtx, userId: string) => {
  await rateLimit(ctx, { name: NAME, key: userId });
};

export const rateLimitActivity = async (ctx: MutationCtx, userId: string) => {
  await checkActivityRate(ctx, userId);
  await recordActivityRate(ctx, userId);
};
