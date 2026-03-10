import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Link from "next/link";
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

const navItems = [
  { label: "Private Journal", href: "/archives" },
  { label: "Collections", href: "/archives" },
  { label: "Secure Depository", href: "/depository" },
  { label: "Access Tiers", href: "/archives" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <div className="fixed inset-0 -z-20">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/v12-hero.jpg')" }}
          />
          <div className="absolute inset-0 bg-hero-vignette" />
        </div>

        <div className="vignette-overlay" />

        <header className="fixed left-1/2 top-6 z-30 w-[min(92%,1150px)] -translate-x-1/2">
          <nav className="glass-panel rounded-full px-6 py-4 text-xs tracking-[0.22em] text-neutral-200/85 md:px-9">
            <div className="flex items-center justify-between gap-4">
              <Link href="/" className="font-editorial text-sm italic tracking-[0.18em] text-[#d4af37]/90">
                The Bond Archive
              </Link>
              <div className="hidden items-center gap-6 lg:flex">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="opacity-75 transition-opacity duration-700 ease-vault-ease hover:opacity-100"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </header>

        <main className="relative z-10 min-h-screen px-4 pb-14 pt-28 md:px-10 md:pt-32">{children}</main>
      </body>
    </html>
  );
}
