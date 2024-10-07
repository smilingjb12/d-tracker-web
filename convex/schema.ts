import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { rateLimitTables } from "convex-helpers/server/rateLimit";

export default defineSchema({
  ...rateLimitTables,
  thumbnailPolls: defineTable({
    title: v.string(),
    userId: v.string(),
    aImageId: v.string(),
    bImageId: v.string(),
    aVotes: v.number(),
    bVotes: v.number(),
    votedUserIds: v.array(v.string()),
    comments: v.array(
      v.object({
        userId: v.string(),
        text: v.string(),
        createdAt: v.number(),
        userName: v.string(),
        profileUrl: v.string(),
      })
    ),
  }),
  userPurchases: defineTable({
    userId: v.string(),
    stripeItemId: v.string(),
    stripeCheckoutSessionId: v.string(),
  }),
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    credits: v.number(),
    isAnonymous: v.boolean(),
  }).index("by_userId", ["userId"]),
});
