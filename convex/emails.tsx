"use node";

import { render } from "@react-email/render";
import { Resend } from "@convex-dev/resend";
import { components, internal } from "./_generated/api";
import { ActionCtx, internalAction } from "./_generated/server";
import { ConvexConstants } from "./lib/constants";
import { StoppedSendingData } from "./emails/stoppedSendingData";

const resend = new Resend(components.resend, {
  testMode: false,
});

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

  const html = await render(
    <StoppedSendingData minutesSinceLastUpdate={minutesPast} />
  );

  try {
    await resend.sendEmail(ctx, {
      from: "D-Tracker <onboarding@resend.dev>",
      to: toEmails,
      subject: "Device stopped sending data",
      html,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
