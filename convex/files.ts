import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import {
  cleanupFileStorageHandler,
  deduplicateFilesByHashHandler,
  generateUploadUrlHandler,
  getFileUrlHandler,
  removeTemporaryFilesHandler,
} from "./handlers/files";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx): Promise<string> => {
    return await generateUploadUrlHandler(ctx);
  },
});

export const getFileUrl = query({
  args: {
    fileId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await getFileUrlHandler(ctx, args);
  },
});

export const cleanupFileStorage = internalMutation({
  args: {},
  handler: async (ctx): Promise<void> => {
    await cleanupFileStorageHandler(ctx);
  },
});

export const deduplicateFilesByHash = internalMutation({
  args: {},
  handler: async (ctx) => {
    await deduplicateFilesByHashHandler(ctx);
  },
});

export const removeTemporaryFiles = internalMutation({
  args: {},
  handler: async (ctx) => {
    await removeTemporaryFilesHandler(ctx);
  },
});
