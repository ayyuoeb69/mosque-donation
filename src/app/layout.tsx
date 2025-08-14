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
  title: "Donasi Masjid - Membangun Rumah Ibadah Bersama",
  description: "Bergabunglah membangun masjid yang indah untuk menjadi pusat ibadah, berkumpul komunitas, dan pendidikan Islam untuk generasi mendatang.",
  keywords: ["donasi masjid", "pembangunan masjid", "infak", "sedekah", "zakat", "wakaf", "fundraising masjid", "komunitas muslim"],
  authors: [{ name: "Komunitas Masjid" }],
  openGraph: {
    title: "Donasi Masjid - Membangun Rumah Ibadah Bersama",
    description: "Bergabunglah membangun masjid yang indah untuk komunitas kita",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
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
