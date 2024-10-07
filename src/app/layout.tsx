import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Footer } from "./footer";
import "./globals.css";
import { Header } from "./header";
import { Providers } from "./providers";
import ScrollToTop from "@/components/scroll-to-top";
import { Constants } from "@/constants";
import NextTopLoader from "nextjs-toploader";

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
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <NextTopLoader
            showSpinner={false}
            color={Constants.TOP_LOADER_COLOR}
          />
          <ScrollToTop />
          <Header />
          <div className="flex min-h-screen w-full flex-col py-32 px-6">
            {children}
          </div>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
