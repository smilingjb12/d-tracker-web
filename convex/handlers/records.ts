import { internal } from "../_generated/api";
import { ActionCtx, QueryCtx } from "../_generated/server";

export const recordsPostHandler = async (ctx: ActionCtx, req: Request) => {
  const record = await req.json();
  console.log("Received record:", record);
  await ctx.runMutation(internal.records.addRecord, record);
  return new Response(null, {
    status: 200,
  });
};

export const getRecordsPageHandler = async (
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
    .query("records")
    .order("desc")
    .paginate(args.paginationOpts);
  return page;
};
