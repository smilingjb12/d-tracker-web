import { ConvexError } from "convex/values";
import { api, internal } from "../_generated/api";
import { MutationCtx, QueryCtx } from "../_generated/server";
import { convexEnv } from "../lib/convexEnv";

export const createSignedInUserHandler = async (
  ctx: MutationCtx,
  args: { userId: string; email: string }
) => {
  return await ctx.db.insert("users", {
    userId: args.userId,
    email: args.email,
    credits: Number(convexEnv.DEFAULT_CREDITS),
    isAnonymous: false,
  });
};

export const decrementCreditsHandler = async (
  ctx: MutationCtx,
  args: { userId: string }
) => {
  const user = await ctx.runQuery(internal.users.getByUserId, {
    userId: args.userId,
  });
  await ctx.db.patch(user!._id, {
    credits: user!.credits - 1,
  });
};

export const getAvailableCreditsHandler = async (ctx: QueryCtx) => {
  if (!(await ctx.auth.getUserIdentity())) {
    return Number(convexEnv.DEFAULT_CREDITS);
  }
  const user = await ctx.runQuery(api.users.getCurrentUser, {});
  return user?.credits ?? Number(convexEnv.DEFAULT_CREDITS);
};

export const getCurrentUserHandler = async (ctx: QueryCtx) => {
  const userIdentity = await ctx.auth.getUserIdentity();
  return await ctx.runQuery(internal.users.getByUserId, {
    userId: userIdentity!.subject,
  });
};

export const addCreditsHandler = async (
  ctx: MutationCtx,
  args: {
    userId: string;
    creditsToAdd: number;
    stripeCheckoutSessionId: string;
    stripeItemId: string;
  }
) => {
  console.log("Adding", args.creditsToAdd, "credits to user:", args.userId);
  const user = await ctx.db
    .query("users")
    .withIndex("by_userId", (q) => q.eq("userId", args.userId))
    .first();

  if (!user) {
    throw new ConvexError("No user found with userId = " + args.userId);
  }

  await ctx.db.insert("userPurchases", {
    stripeCheckoutSessionId: args.stripeCheckoutSessionId,
    stripeItemId: args.stripeItemId,
    userId: args.userId,
  });
  await ctx.db.patch(user._id, {
    credits: user.credits + args.creditsToAdd,
  });
};

export const getByUserIdHandler = async (
  ctx: QueryCtx,
  args: { userId: string }
) => {
  const user = await ctx.db
    .query("users")
    .withIndex("by_userId", (q) => q.eq("userId", args.userId))
    .first();

  return user;
};
