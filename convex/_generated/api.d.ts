/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as clerk from "../clerk.js";
import type * as crons from "../crons.js";
import type * as emails_stoppedSendingData from "../emails/stoppedSendingData.js";
import type * as emails from "../emails.js";
import type * as http from "../http.js";
import type * as knownLocations from "../knownLocations.js";
import type * as lib_constants from "../lib/constants.js";
import type * as lib_convexEnv from "../lib/convexEnv.js";
import type * as lib_env from "../lib/env.js";
import type * as lib_helpers from "../lib/helpers.js";
import type * as lib_rateLimits from "../lib/rateLimits.js";
import type * as records from "../records.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  clerk: typeof clerk;
  crons: typeof crons;
  "emails/stoppedSendingData": typeof emails_stoppedSendingData;
  emails: typeof emails;
  http: typeof http;
  knownLocations: typeof knownLocations;
  "lib/constants": typeof lib_constants;
  "lib/convexEnv": typeof lib_convexEnv;
  "lib/env": typeof lib_env;
  "lib/helpers": typeof lib_helpers;
  "lib/rateLimits": typeof lib_rateLimits;
  records: typeof records;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
