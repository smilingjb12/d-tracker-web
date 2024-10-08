import { nextEnv } from "./nextEnv";

export function register() {
  ensureEnvVariablesAreSet();
}

function ensureEnvVariablesAreSet(): void {
  console.log("Checking environment variables");
  for (const [key, value] of Object.entries(nextEnv)) {
    if (value == null) {
      throw new Error(`Missing environment variable: ${key}`);
    }
  }
  console.log("Environment variables are set correctly");
}
