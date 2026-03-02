import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "LeadHarvest — Google Maps Lead Extractor",
  description:
    "Extract high-quality local business leads from Google Maps search results instantly. Get names, phone numbers, websites, social profiles, and more.",
  keywords: "lead extractor, google maps scraper, business leads, local business data",
};

import AuthProvider from "@/components/AuthProvider";
import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body suppressHydrationWarning>
        <AuthProvider>
          <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
        </AuthProvider>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      </body>
    </html>
  );
}
