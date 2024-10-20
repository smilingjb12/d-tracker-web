import { Resend } from "resend";
import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";
import { StoppedSendingData } from "./emails/stoppedSendingData";
import { ConvexConstants } from "./lib/constants";
import { convexEnv } from "./lib/convexEnv";

const resend = new Resend(convexEnv.RESEND_API_KEY);

export const notifyIfStoppedSendingData = internalAction({
  handler: async (ctx) => {
    const lastRecord = await ctx.runQuery(
      internal.records.getMostRecentRecord,
      {}
    );
    if (!lastRecord) {
      return;
    }
    console.log("Last record:", lastRecord);
    const minutesPast = getMinutesDifferenceToNow(lastRecord._creationTime);
    console.log("Minutes since last update:", minutesPast);
    const INACCURACY_IN_MINUTES = 10;
    if (
      minutesPast >
      ConvexConstants.EXPECTED_UPDATE_INTERVAL_IN_MINUTES +
        INACCURACY_IN_MINUTES
    ) {
      console.log("Sending email to notify");
      const ownerUsers = await ctx.runQuery(internal.users.getOwnerUsers, {});
      const toEmails = ownerUsers.map((u) => u.email);
      const { error } = await resend.emails.send({
        from: "D-Tracker <onboarding@resend.dev>",
        to: toEmails,
        subject: "Device stopped sending data",
        react: StoppedSendingData({ minutesSinceLastUpdate: minutesPast }),
      });
      if (error) {
        console.error("Error sending email:", error);
      }
    }
  },
});

function getMinutesDifferenceToNow(timestamp: number) {
  const now = Date.now();
  const differenceInMs = now - timestamp;
  const differenceInMinutes = Math.floor(differenceInMs / (1000 * 60));
  return differenceInMinutes;
}
