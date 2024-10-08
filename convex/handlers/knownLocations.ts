import { QueryCtx } from "../_generated/server";
import { requireAuthentication, requireReaderRole } from "../lib/helpers";

export async function getKnownLocationsHandler(ctx: QueryCtx) {
  await requireAuthentication(ctx);
  await requireReaderRole(ctx);
  return ctx.db.query("knownLocations").collect();
}
