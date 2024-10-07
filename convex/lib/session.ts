import {
  customAction,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import {
  SessionIdArg,
  runSessionFunctions,
} from "convex-helpers/server/sessions";
import { action, mutation, query } from "../_generated/server";

export const queryWithSession = customQuery(query, {
  args: SessionIdArg,
  input: async (ctx, { sessionId }) => {
    return { ctx: { ...ctx, sessionId }, args: {} };
  },
});

export const mutationWithSession = customMutation(mutation, {
  args: SessionIdArg,
  input: async (ctx, { sessionId }) => {
    return { ctx: { ...ctx, sessionId }, args: {} };
  },
});

export const actionWithSession = customAction(action, {
  args: SessionIdArg,
  input: async (ctx, { sessionId }) => {
    return {
      ctx: {
        ...ctx,
        ...runSessionFunctions(ctx, sessionId),
        sessionId,
      },
      args: {},
    };
  },
});
