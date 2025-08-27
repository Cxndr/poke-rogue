import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const moreSugar = localFont({
  src: "../fonts/MoreSugar.woff",
  variable: "--font-more-sugar",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Poke Rogue",
  description: "A rogue-like pokemon battle game made with React without using Canvas, WebGL or similar technologies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="Poke Rogue" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${moreSugar.variable} antialiased`}
      >
        <main className="h-svh w-full" >
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
