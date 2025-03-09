import { query } from "./_generated/server";
import { requireAuthentication, requireReaderRole } from "./lib/helpers";
import { KnownLocationsService } from "./services/known.locations.service";

export const getKnownLocations = query({
  args: {},
  handler: async (ctx) => {
    await requireAuthentication(ctx);
    await requireReaderRole(ctx);
    return await KnownLocationsService.getKnownLocations(ctx);
  },
});
