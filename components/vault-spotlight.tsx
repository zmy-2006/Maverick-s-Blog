"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { type SpotlightItem } from "@/lib/ledger-shared";

export function VaultSpotlight({ searchItems }: { searchItems: SpotlightItem[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return searchItems.slice(0, 18);
    return searchItems.filter((item) => `${item.title} ${item.keywords}`.toLowerCase().includes(q));
  }, [query, searchItems]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/25 text-neutral-200/80 transition-opacity hover:opacity-100"
        aria-label="Open spotlight"
      >
        <Search size={14} />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/35 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.7, ease: [0.18, 0.78, 0.1, 1] }}
              onClick={(event) => event.stopPropagation()}
              className="glass-panel mx-auto mt-24 w-[min(92vw,860px)] rounded-3xl p-5"
            >
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search private notes, courses, and dossiers..."
                  className="w-full bg-transparent text-sm tracking-[0.08em] text-neutral-100 outline-none placeholder:text-neutral-400/70"
                />
              </div>
              <div className="mt-4 max-h-[50vh] space-y-2 overflow-y-auto pr-1">
                {results.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm tracking-[0.08em] text-neutral-200/85 transition-colors hover:border-[var(--theme-accent)]/40 hover:text-white"
                  >
                    {item.title}
                  </Link>
                ))}
                {results.length === 0 ? (
                  <p className="px-1 py-2 text-xs tracking-[0.12em] text-neutral-400/80">No matching records found.</p>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
