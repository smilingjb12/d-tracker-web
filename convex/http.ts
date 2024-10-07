import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { clerkRouteHandler } from "./handlers/http";
import { recordsPostHandler } from "./handlers/records";

const http = httpRouter();

http.route({
  path: "/clerk",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    return await clerkRouteHandler(ctx, req);
  }),
});

http.route({
  path: "/records",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    return await recordsPostHandler(ctx, req);
  }),
});

export default http;
