import type { ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Providers } from "../providers";
import { Header } from "../components/header";
import { ScrollToTop } from "../components/scroll-to-top";
import { Toaster } from "../components/ui/toaster";
import { Constants } from "../constants";
import "../globals.css";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: Constants.APP_NAME },
      { name: "description", content: Constants.APP_DESCRIPTION_META },
    ],
    links: [
      // Google Fonts - DM Sans & Fraunces
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Providers>
        <ScrollToTop />
        <Header />
        <div className="min-h-screen w-full pt-16">
          <Outlet />
        </div>
        <Toaster />
      </Providers>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
