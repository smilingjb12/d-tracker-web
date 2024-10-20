import { internal } from "../_generated/api";
import { MutationCtx, QueryCtx } from "../_generated/server";
import { requireAuthentication, requireReaderRole } from "../lib/helpers";

export const createSignedInUserHandler = async (
  ctx: MutationCtx,
  args: { userId: string; email: string }
) => {
  return await ctx.db.insert("users", {
    userId: args.userId,
    email: args.email,
    roles: [],
  });
};

export const getRolesHandler = async (
  ctx: QueryCtx
): Promise<("reader" | "owner")[]> => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return [];
  }
  const user = await getCurrentUserHandler(ctx);
  return user?.roles ?? [];
};

export const getLastKnownLocationsHandler = async (ctx: QueryCtx) => {
  await requireAuthentication(ctx);
  await requireReaderRole(ctx);
  const lastFewRecords = await ctx.db.query("records").order("desc").take(5);
  return lastFewRecords.map((r) => ({ lat: r.latitude, lng: r.longitude }));
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
