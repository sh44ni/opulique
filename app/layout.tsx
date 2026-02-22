import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/context/CartContext";
import Script from "next/script";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Opulique - Premium Authentic Handbags in Oman",
  description: "Discover luxury and elegance. Pre-loved and brand new authentic designer handbags.",
};

import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GPPHN8KXP4"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GPPHN8KXP4');
          `}
        </Script>
        <NextTopLoader color="#305752" showSpinner={false} />
        <CartProvider>
          {children}
        </CartProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
