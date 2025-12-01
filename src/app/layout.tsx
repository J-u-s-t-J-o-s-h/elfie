import type { Metadata } from "next";
import { Geist, Geist_Mono, Mountains_of_Christmas } from "next/font/google";
import "./globals.css";
import { StorageProvider } from "@/context/StorageContext";
import { Snow } from "@/components/ui/Snow";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const festiveFont = Mountains_of_Christmas({
  variable: "--font-festive",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elfie",
  description: "North Pole Surveillance System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${festiveFont.variable} antialiased`}
      >
        <Snow />
        <StorageProvider>
          {children}
        </StorageProvider>
      </body>
    </html>
  );
}
