import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";
import {
  ensureHasPositiveCredits,
  requireAuthentication,
} from "../lib/helpers";

export const generateUploadUrlHandler = async (ctx: MutationCtx) => {
  await requireAuthentication(ctx);
  await ensureHasPositiveCredits(ctx);
  return await ctx.storage.generateUploadUrl();
};

export const getFileUrlHandler = async (
  ctx: QueryCtx,
  args: { fileId: Id<"_storage"> }
) => {
  return await ctx.storage.getUrl(args.fileId);
};

export const cleanupFileStorageHandler = async (ctx: MutationCtx) => {
  await ctx.runMutation(internal.files.deduplicateFilesByHash, {});
  await ctx.runMutation(internal.files.removeTemporaryFiles, {});
};

export const deduplicateFilesByHashHandler = async (ctx: MutationCtx) => {
  const allFiles = await ctx.db.system.query("_storage").collect();
  const uniqueFileHashes: Array<{ sha256: string; fileId: string }> = [];
  for (const file of allFiles) {
    if (uniqueFileHashes.some((h) => h.sha256 === file.sha256)) {
      continue;
    }
    uniqueFileHashes.push({ sha256: file.sha256, fileId: file._id });
  }
  console.log("unique hashes count:", uniqueFileHashes.length);
  console.log("all files count:", allFiles.length);

  const polls = await ctx.db.query("thumbnailPolls").collect();
  for (const poll of polls) {
    const fileA = allFiles.find((f) => f._id === poll.aImageId);
    const fileB = allFiles.find((f) => f._id === poll.bImageId);
    const aImageId = uniqueFileHashes.find(
      (i) => i.sha256 === fileA!.sha256
    )!.fileId;
    const bImageId = uniqueFileHashes.find(
      (i) => i.sha256 === fileB!.sha256
    )!.fileId;
    await ctx.db.patch(poll._id, { aImageId, bImageId });
  }
};

export const removeTemporaryFilesHandler = async (ctx: MutationCtx) => {
  const polls = await ctx.db.query("thumbnailPolls").collect();
  const usedImageIds = new Set(
    polls.flatMap((poll) => [poll.aImageId, poll.bImageId])
  );

  const allFiles = await ctx.db.system.query("_storage").collect();
  const unusedFiles = allFiles.filter((file) => !usedImageIds.has(file._id));

  for (const file of unusedFiles) {
    await ctx.storage.delete(file._id);
  }
  console.log("Deleted", unusedFiles.length, "unused files.");
};
