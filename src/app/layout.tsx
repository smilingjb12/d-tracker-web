import ScrollToTop from "@/components/scroll-to-top";
import { Toaster } from "@/components/ui/toaster";
import { Constants } from "@/constants";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { Header } from "./header";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: Constants.APP_NAME,
  description: Constants.APP_DESCRIPTION_META,
};

const inter = Inter({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <NextTopLoader
            showSpinner={false}
            color={Constants.TOP_LOADER_COLOR}
          />
          <ScrollToTop />
          <Header />
          <div className="flex min-h-screen w-full flex-col py-[70px] px-0">
            {children}
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
