import { createEnvRecord } from "./env";

const ENV_VARS = [
  "CLERK_WEBHOOK_SECRET",
  "CLERK_JWT_ISSUER_DOMAIN",
  "SITE_URL",
] as const;

export const convexEnv = createEnvRecord(ENV_VARS);
