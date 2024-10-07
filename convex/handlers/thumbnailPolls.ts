import { ConvexError } from "convex/values";
import { Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";
import {
  ensureUploadSizeIsNotExceeded,
  requireAuthentication,
} from "../lib/helpers";
import { rateLimitActivity } from "../lib/rateLimits";
import { internal } from "../_generated/api";

export const getThumbnailPollHandler = async (
  ctx: QueryCtx,
  args: { thumbnailPollId: Id<"thumbnailPolls"> }
) => {
  return await ctx.db.get(args.thumbnailPollId);
};

export const getRecentThumbnailPollsHandler = async (
  ctx: QueryCtx,
  args: {
    paginationOpts: {
      id?: number | undefined;
      endCursor?: string | null | undefined;
      maximumRowsRead?: number | undefined;
      maximumBytesRead?: number | undefined;
      numItems: number;
      cursor: string | null;
    };
  }
) => {
  const page = await ctx.db
    .query("thumbnailPolls")
    .order("desc")
    .paginate(args.paginationOpts);
  const result = await Promise.all(
    page.page.map(async (poll) => ({
      ...poll,
      aImageUrl: await ctx.storage.getUrl(poll.aImageId as Id<"_storage">),
      bImageUrl: await ctx.storage.getUrl(poll.bImageId as Id<"_storage">),
    }))
  );
  page.page = result;
  return page;
};

export const voteOnThumbnailPollHandler = async (
  ctx: MutationCtx,
  args: { thumbnailPollId: Id<"thumbnailPolls">; imageId: string }
) => {
  const user = await requireAuthentication(ctx);
  await rateLimitActivity(ctx, user.subject);
  const poll = await ctx.db.get(args.thumbnailPollId);
  if (!poll) {
    throw new ConvexError("Poll not found");
  }
  if (poll.votedUserIds.includes(user.subject)) {
    throw new ConvexError("You have already voted for this poll");
  }
  if (![poll.aImageId, poll.bImageId].includes(args.imageId)) {
    throw new ConvexError("Given imageId doesn't exist");
  }

  if (poll.aImageId === args.imageId) {
    await ctx.db.patch(args.thumbnailPollId, {
      aVotes: poll.aVotes + 1,
      votedUserIds: [...poll.votedUserIds, user.subject],
    });
  } else {
    await ctx.db.patch(args.thumbnailPollId, {
      bVotes: poll.bVotes + 1,
      votedUserIds: [...poll.votedUserIds, user.subject],
    });
  }

  return poll;
};

export const addCommentHandler = async (
  ctx: MutationCtx,
  args: { pollId: Id<"thumbnailPolls">; text: string }
) => {
  const userIdentity = await requireAuthentication(ctx);
  await rateLimitActivity(ctx, userIdentity.subject);
  const poll = await ctx.db.get(args.pollId);
  if (!poll) {
    throw new ConvexError("Poll not found");
  }
  const newComment = {
    createdAt: Date.now(),
    text: args.text,
    userId: userIdentity.subject,
    userName: userIdentity.name ?? "Anonymous",
    profileUrl: userIdentity.pictureUrl ?? "",
  };
  await ctx.db.patch(poll._id, {
    comments: [newComment, ...poll.comments],
  });
};

export const createThumbnailPollHandler = async (
  ctx: MutationCtx,
  args: { aImageId: string; bImageId: string; title: string }
) => {
  console.log("Creating poll with args:", args);
  const userIdentity = await requireAuthentication(ctx);
  await rateLimitActivity(ctx, userIdentity.subject);
  await ensureUploadSizeIsNotExceeded(ctx, args.aImageId, args.bImageId);
  const userId = userIdentity!.subject;
  const user = await ctx.runQuery(internal.users.getByUserId, {
    userId: userId,
  });
  console.log("Current user:", user);
  if (user!.credits - 1 < 0) {
    throw new ConvexError("Not enough credits to create new test");
  }
  await ctx.runMutation(internal.users.decrementCredits, {
    userId: user!.userId,
  });

  const pollId = await ctx.db.insert("thumbnailPolls", {
    title: args.title,
    userId: user!.userId,
    aImageId: args.aImageId,
    bImageId: args.bImageId,
    aVotes: 0,
    bVotes: 0,
    votedUserIds: [],
    comments: [],
  });
  return pollId;
};
