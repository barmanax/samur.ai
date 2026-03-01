import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CherryBlossomBg } from "@/components/cherry-blossom-bg";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Samur.ai — Cut through the clutter",
  description: "Turn your syllabus into calendar events instantly. Paste, extract, export.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-transparent text-foreground`}
      >
        <CherryBlossomBg />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
