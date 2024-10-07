import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import {
  addCommentHandler,
  createThumbnailPollHandler,
  getRecentThumbnailPollsHandler,
  voteOnThumbnailPollHandler,
} from "./handlers/thumbnailPolls";

export const addComment = mutation({
  args: { pollId: v.id("thumbnailPolls"), text: v.string() },
  handler: async (ctx, args) => {
    return await addCommentHandler(ctx, args);
  },
});

export const createThumbnailPoll = mutation({
  args: {
    title: v.string(),
    aImageId: v.string(),
    bImageId: v.string(),
  },
  handler: async (ctx, args): Promise<Id<"thumbnailPolls">> => {
    return await createThumbnailPollHandler(ctx, args);
  },
});

export const getThumbnailPoll = query({
  args: {
    thumbnailPollId: v.id("thumbnailPolls"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.thumbnailPollId);
  },
});

export const getRecentThumbnailPolls = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await getRecentThumbnailPollsHandler(ctx, args);
  },
});

export const voteOnThumbnailPoll = mutation({
  args: {
    thumbnailPollId: v.id("thumbnailPolls"),
    imageId: v.string(),
  },
  handler: async (ctx, args) => {
    return await voteOnThumbnailPollHandler(ctx, args);
  },
});
