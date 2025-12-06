import { QueryCtx } from "../_generated/server";

export const KnownLocationsService = {
  async getKnownLocations(ctx: QueryCtx) {
    return await ctx.db.query("knownLocations").collect();
  },
};
