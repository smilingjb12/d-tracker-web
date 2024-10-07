import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { rateLimitTables } from "convex-helpers/server/rateLimit";

export default defineSchema({
  ...rateLimitTables,
  records: defineTable({
    power: v.number(),
    latitude: v.number(),
    longitude: v.number(),
  }),
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    isAdmin: v.boolean(),
  }).index("by_userId", ["userId"]),
});
