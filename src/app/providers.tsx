"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { nextEnv } from "@/nextEnv";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

const convex = new ConvexReactClient(nextEnv.NEXT_PUBLIC_CONVEX_URL);

const ThemedClerkProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider
      appearance={{ baseTheme: dark }}
      publishableKey={nextEnv.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      {children}
    </ClerkProvider>
  );
};

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ThemedClerkProvider>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          {children}
        </ConvexProviderWithClerk>
      </ThemedClerkProvider>
    </ThemeProvider>
  );
};
