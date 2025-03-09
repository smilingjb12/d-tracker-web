import { Doc, Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";

export const UserService = {
  async getByUserId(
    ctx: QueryCtx,
    { userId }: { userId: string }
  ): Promise<Doc<"users"> | null> {
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    return user;
  },

  async createSignedInUser(
    ctx: MutationCtx,
    { userId, email }: { userId: string; email: string }
  ): Promise<Id<"users">> {
    return await ctx.db.insert("users", {
      userId,
      email,
      roles: [],
    });
  },

  async getOwnerUsers(ctx: QueryCtx): Promise<Doc<"users">[]> {
    const users = await ctx.db.query("users").collect();
    return users.filter((u) => u.roles.includes("owner"));
  },

  async getRoles(ctx: QueryCtx): Promise<("reader" | "owner")[]> {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }
    const user = await UserService.getCurrentUser(ctx);
    return user?.roles ?? [];
  },

  async getCurrentUser(ctx: QueryCtx): Promise<Doc<"users"> | null> {
    const userIdentity = await ctx.auth.getUserIdentity();
    return await UserService.getByUserId(ctx, {
      userId: userIdentity!.subject,
    });
  },

  async getLastKnownLocations(
    ctx: QueryCtx
  ): Promise<{ lat: number; lng: number }[]> {
    const lastFewRecords = await ctx.db.query("records").order("desc").take(5);
    return lastFewRecords.map((r) => ({ lat: r.latitude, lng: r.longitude }));
  },
};
