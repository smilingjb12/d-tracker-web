import { ThemeProvider } from "@/components/theme-provider";
import { clientEnv } from "@/env";
import { ClerkLoaded, ClerkLoading, ClerkProvider, useAuth } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import LoadingIndicator from "./components/loading-indicator";

const convex = new ConvexReactClient(clientEnv.VITE_CONVEX_URL);

const ThemedClerkProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider
      appearance={{ baseTheme: dark }}
      publishableKey={clientEnv.VITE_CLERK_PUBLISHABLE_KEY}
    >
      <ClerkLoading>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingIndicator />
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        {children}
      </ClerkLoaded>
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
