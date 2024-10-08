import { createEnvRecord } from "./env";

const ENV_VARS = [
  "CLERK_WEBHOOK_SECRET",
  "CLERK_JWT_ISSUER_DOMAIN",
  "SITE_URL",
  "RESEND_API_KEY",
] as const;

export const convexEnv = createEnvRecord(ENV_VARS);
