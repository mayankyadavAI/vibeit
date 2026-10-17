import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "vibeIt Atelier — AI Virtual Fitting & Haute Couture Engine",
  description: "Couture-grade photoreal virtual fittings from a portrait and a garment. Next-generation fabric drape, skin-true lighting, and zero fitting-room friction.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${plusJakarta.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fbfaf7] text-slate-900 font-sans selection:bg-rose-500/20 selection:text-rose-900">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
