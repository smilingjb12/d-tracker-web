import { internal } from "../_generated/api";
import { MutationCtx, QueryCtx } from "../_generated/server";

export const createSignedInUserHandler = async (
  ctx: MutationCtx,
  args: { userId: string; email: string }
) => {
  return await ctx.db.insert("users", {
    userId: args.userId,
    email: args.email,
    isAdmin: false,
  });
};

export const getCurrentUserHandler = async (ctx: QueryCtx) => {
  const userIdentity = await ctx.auth.getUserIdentity();
  return await ctx.runQuery(internal.users.getByUserId, {
    userId: userIdentity!.subject,
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
