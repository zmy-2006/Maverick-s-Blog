"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { partitionTitle } from "@/lib/ledger-shared";

const labels: Record<string, string> = {
  archives: "Main Hall",
  depository: "Secure Depository",
  collections: "Collections",
  ledger: "Private Ledger",
  sector: "Sector",
  preview: "Preview",
  "academic-ledger": "Academic Ledger",
  "technical-matrix": "The Technical Matrix",
  "research-pipeline": "Research Pipeline",
  "private-chronicle": "Private Chronicle",
  research: partitionTitle.research,
  tech: partitionTitle.tech,
  life: partitionTitle.life,
  notes: partitionTitle.notes,
};

function titleCase(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function BreadcrumbTrail() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return (
      <div className="pb-4 text-[10px] uppercase tracking-[0.24em] text-neutral-400/75">
        <span>Private Ledger</span> <span className="px-2 text-neutral-500">/</span>{" "}
        <span className="text-[var(--theme-accent)]">Dashboard</span>
      </div>
    );
  }

  let cumulative = "";
  return (
    <div className="pb-4 text-[10px] uppercase tracking-[0.24em] text-neutral-400/75">
      <span>Private Ledger</span>
      {segments.map((segment, index) => {
        cumulative += `/${segment}`;
        const text = labels[segment] ?? titleCase(segment);
        const active = index === segments.length - 1;
        return (
          <span key={cumulative}>
            <span className="px-2 text-neutral-500">/</span>
            {active ? (
              <span className="text-[var(--theme-accent)]">{text}</span>
            ) : (
              <Link href={cumulative} className="hover:text-neutral-200">
                {text}
              </Link>
            )}
          </span>
        );
      })}
    </div>
  );
}
