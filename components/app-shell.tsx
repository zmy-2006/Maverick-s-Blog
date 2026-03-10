"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { House } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BreadcrumbTrail } from "@/components/breadcrumb-trail";
import { VaultSidebar } from "@/components/vault-sidebar";
import { VaultSpotlight } from "@/components/vault-spotlight";
import { type LedgerDrawer, type SpotlightItem } from "@/lib/ledger-shared";
import { themeOptions } from "@/lib/themes";

type AppShellProps = {
  children: React.ReactNode;
  drawers: LedgerDrawer[];
  searchItems: SpotlightItem[];
};

export function AppShell({ children, drawers, searchItems }: AppShellProps) {
  const pathname = usePathname();
  void drawers;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [enterReveal, setEnterReveal] = useState(false);
  const isFullscreenHall = pathname === "/" || pathname === "/archives";
  const activeTheme = themeOptions[0];

  useEffect(() => {
    document.documentElement.style.setProperty("--hero-image", `url("${activeTheme.backgroundImage}")`);
    document.documentElement.style.setProperty("--theme-accent", activeTheme.accent);
  }, [activeTheme]);

  useEffect(() => {
    if (pathname === "/") return;
    const shouldReveal = window.sessionStorage.getItem("vault-enter-transition") === "1";
    if (!shouldReveal) {
      setEnterReveal(false);
      return;
    }

    setEnterReveal(true);
    window.sessionStorage.removeItem("vault-enter-transition");
    const timer = window.setTimeout(() => setEnterReveal(false), 1400);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  if (isFullscreenHall) {
    return <div className="relative z-10 min-h-screen">{children}</div>;
  }

  return (
    <motion.div
      initial={false}
      animate={{
        opacity: enterReveal ? [0, 1] : 1,
        filter: enterReveal ? ["blur(8px)", "blur(0px)"] : "blur(0px)",
        y: enterReveal ? [24, 0] : 0,
      }}
      transition={{ duration: 1.2, ease: [0.18, 0.78, 0.1, 1] }}
      className="relative z-10 min-h-screen"
    >
      <VaultSidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
      />

      <header
        className={`fixed top-6 z-30 w-[min(95%,1080px)] transition-all duration-700 ease-vault-ease ${
          sidebarOpen ? "left-1/2 -translate-x-1/2 xl:left-[58%] xl:w-[min(72%,980px)]" : "left-1/2 -translate-x-1/2"
        }`}
      >
        <nav className="glass-panel rounded-full px-6 py-4 text-xs tracking-[0.22em] text-neutral-200/85">
          <div className="flex items-center justify-end gap-3">
            <Link
              href="/archives"
              aria-label="Return to hall"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/25 text-neutral-200/80 transition-opacity hover:opacity-100"
            >
              <House size={14} />
            </Link>
            <VaultSpotlight searchItems={searchItems} />
          </div>
        </nav>
      </header>

      <main
        className={`relative min-h-screen px-4 pb-14 pt-28 transition-all duration-700 ease-vault-ease md:px-10 md:pt-32 ${
          sidebarOpen ? "xl:pl-[21rem]" : "xl:pl-12"
        }`}
      >
        <BreadcrumbTrail />
        {children}
      </main>
    </motion.div>
  );
}
