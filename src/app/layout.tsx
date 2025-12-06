import ScrollToTop from "@/components/scroll-to-top";
import { Toaster } from "@/components/ui/toaster";
import { Constants } from "@/constants";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { Header } from "./header";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: Constants.APP_NAME,
  description: Constants.APP_DESCRIPTION_META,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-body antialiased" suppressHydrationWarning>
        <Providers>
          <NextTopLoader
            showSpinner={false}
            color={Constants.TOP_LOADER_COLOR}
            height={3}
            shadow={false}
          />
          <ScrollToTop />
          <Header />
          <div className="min-h-screen w-full pt-16">
            {children}
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
