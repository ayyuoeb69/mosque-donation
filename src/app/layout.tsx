import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mosque Donation - Help Build Our Community",
  description: "Join us in building a beautiful mosque that will serve as a center for worship, community gatherings, and Islamic education for generations to come.",
  keywords: ["mosque", "donation", "charity", "community", "islamic", "fundraising"],
  authors: [{ name: "Mosque Community" }],
  openGraph: {
    title: "Mosque Donation - Help Build Our Community",
    description: "Join us in building a beautiful mosque for our community",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
