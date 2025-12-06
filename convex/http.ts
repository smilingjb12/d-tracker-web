import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { HttpService } from "./services/http.service";

const http = httpRouter();

http.route({
  path: "/clerk",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    return await HttpService.processClerkWebhook(ctx, req);
  }),
});

http.route({
  path: "/records",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    return await HttpService.processRecordsPost(ctx, req);
  }),
});

export default http;
