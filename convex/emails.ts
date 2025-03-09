import { ActionCtx, internalAction } from "./_generated/server";
import { EmailService } from "./services/email.service";

export const notifyIfStoppedSendingData = internalAction({
  handler: async (ctx: ActionCtx) => {
    await EmailService.notifyIfStoppedSendingData(ctx);
  },
});
