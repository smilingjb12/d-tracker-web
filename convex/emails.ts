import { Resend } from "resend";
import { internal } from "./_generated/api";
import { ActionCtx, internalAction } from "./_generated/server";
import { StoppedSendingData } from "./emails/stoppedSendingData";
import { ConvexConstants } from "./lib/constants";
import { convexEnv } from "./lib/convexEnv";

const resend = new Resend(convexEnv.RESEND_API_KEY);

const INACCURACY_IN_MINUTES = 10;

export const notifyIfStoppedSendingData = internalAction({
  handler: async (ctx: ActionCtx) => {
    const lastRecord = await ctx.runQuery(
      internal.records.getMostRecentRecord,
      {}
    );
    if (!lastRecord) {
      console.log("No records found");
      return;
    }

    const minutesPast = getMinutesDifferenceToNow(lastRecord._creationTime);
    console.log("Last record:", lastRecord);
    console.log("Minutes since last update:", minutesPast);

    if (shouldSendNotification(minutesPast)) {
      await sendStoppedSendingDataEmail(ctx, minutesPast);
    }
  },
});

function getMinutesDifferenceToNow(timestamp: number) {
  const now = Date.now();
  const differenceInMs = now - timestamp;
  const differenceInMinutes = Math.floor(differenceInMs / (1000 * 60));
  return differenceInMinutes;
}

function shouldSendNotification(minutesPast: number): boolean {
  return (
    minutesPast >
    ConvexConstants.EXPECTED_UPDATE_INTERVAL_IN_MINUTES + INACCURACY_IN_MINUTES
  );
}

async function sendStoppedSendingDataEmail(
  ctx: ActionCtx,
  minutesPast: number
) {
  console.log("Sending email to notify");
  const ownerUsers = await ctx.runQuery(internal.users.getOwnerUsers, {});
  const toEmails = ownerUsers.map((u) => u.email);

  try {
    await resend.emails.send({
      from: "D-Tracker <onboarding@resend.dev>",
      to: toEmails,
      subject: "Device stopped sending data",
      react: await StoppedSendingData({ minutesSinceLastUpdate: minutesPast }),
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
