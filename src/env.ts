// Client-side environment variables (VITE_ prefix)
export const clientEnv = {
  VITE_CONVEX_URL: import.meta.env.VITE_CONVEX_URL as string,
  VITE_CLERK_PUBLISHABLE_KEY: import.meta.env
    .VITE_CLERK_PUBLISHABLE_KEY as string,
  VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: import.meta.env
    .VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL as string,
  VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: import.meta.env
    .VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL as string,
};

// Validate required environment variables
if (typeof window !== "undefined") {
  if (!clientEnv.VITE_CONVEX_URL) {
    throw new Error("VITE_CONVEX_URL is required");
  }
  if (!clientEnv.VITE_CLERK_PUBLISHABLE_KEY) {
    throw new Error("VITE_CLERK_PUBLISHABLE_KEY is required");
  }
}
