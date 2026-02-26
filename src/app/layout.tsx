import type { Metadata } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-display",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "FindMyExams — McGill",
  description: "A fast, privacy-first way to find your McGill University final exams for April 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${instrumentSerif.variable} ${manrope.variable} bg-[#FBF7EF] text-[#141414] font-body antialiased selection:bg-[#141414] selection:text-[#FFE459]`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
