import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { rateLimitTables } from "convex-helpers/server/rateLimit";

export default defineSchema({
  ...rateLimitTables,
  records: defineTable({
    power: v.number(),
    latitude: v.number(),
    longitude: v.number(),
    steps: v.optional(v.number()),
    place: v.optional(v.string()),
  }),
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    roles: v.array(v.union(v.literal("reader"), v.literal("owner"))),
  }).index("by_userId", ["userId"]),
  knownLocations: defineTable({
    latitude: v.number(),
    longitude: v.number(),
    name: v.string(),
  }),
  contacts: defineTable({
    type: v.union(v.literal("landlord")),
    name: v.string(),
    phone: v.string(),
  }),
});
