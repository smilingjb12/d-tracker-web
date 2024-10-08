import { UserIdentity } from "convex/server";
import { ConvexError } from "convex/values";
import { api } from "../_generated/api";
import { QueryCtx } from "../_generated/server";

export async function requireAuthentication(
  ctx: QueryCtx
): Promise<UserIdentity> {
  const userIdentity = await ctx.auth.getUserIdentity();
  if (!userIdentity) {
    throw new ConvexError("Unauthorized");
  }

  return userIdentity;
}

export async function requireReaderRole(ctx: QueryCtx) {
  const user = await ctx.runQuery(api.users.getCurrentUser, {});
  if (!user?.roles.includes("reader")) {
    throw new ConvexError("Reader role is required for this operation");
  }
}
