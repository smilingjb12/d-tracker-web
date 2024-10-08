import { query } from "./_generated/server";
import { getKnownLocationsHandler } from "./handlers/knownLocations";

export const getKnownLocations = query({
  args: {},
  handler: async (ctx) => {
    return await getKnownLocationsHandler(ctx);
  },
});
