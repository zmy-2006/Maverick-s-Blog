import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import { getLedgerSnapshot } from "@/lib/ledger";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "The Bond Archive",
  description: "A private journal for life, research, and technical archives.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { drawers, spotlightItems } = await getLedgerSnapshot();

  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <div className="fixed inset-0 -z-20">
          <div className="theme-bg absolute inset-0 bg-cover bg-center bg-no-repeat" />
          <div className="absolute inset-0 bg-hero-vignette" />
          <div className="dynamic-grain absolute inset-0" />
        </div>

        <div className="vignette-overlay" />
        <AppShell drawers={drawers} searchItems={spotlightItems}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
