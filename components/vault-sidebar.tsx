"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { PanelLeft, PanelLeftClose } from "lucide-react";
import { useMemo } from "react";

type VaultSidebarProps = {
  open: boolean;
  onToggle: () => void;
};

const transition = { duration: 0.9, ease: [0.18, 0.78, 0.1, 1] } as const;

export function VaultSidebar({ open, onToggle }: VaultSidebarProps) {
  const pathname = usePathname();

  const quickLinks = useMemo(
    () => [
      { label: "Academic Ledger", href: "/sector/academic-ledger" },
      { label: "The Technical Matrix", href: "/sector/technical-matrix" },
      { label: "Research Pipeline", href: "/sector/research-pipeline" },
      { label: "Private Chronicle", href: "/sector/private-chronicle" },
    ],
    [],
  );

  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        className="glass-panel fixed left-4 top-6 z-40 inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-200/85 hover:text-white"
      >
        {open ? <PanelLeftClose size={16} /> : <PanelLeft size={16} />}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.aside
            initial={{ x: -320, opacity: 0.2 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0.2 }}
            transition={transition}
            className="glass-panel fixed left-4 top-20 z-30 hidden h-[calc(100vh-6rem)] w-72 flex-col rounded-3xl p-5 xl:flex"
          >
            <p className="font-editorial text-xl italic text-[var(--theme-accent)]">The Bond Archive</p>
            <p className="meta-text pt-3 text-[10px]">Private House Index</p>

            <div className="pt-6 space-y-2">
              {quickLinks.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`block rounded-[1.25rem] border px-4 py-3 text-xs tracking-[0.16em] transition-all duration-500 ${
                      active
                        ? "border-[var(--theme-accent)]/35 bg-white/10 text-neutral-100"
                        : "border-white/8 bg-black/15 text-neutral-300/80 hover:bg-white/5"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </>
  );
}
