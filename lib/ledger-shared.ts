import { type VaultPartition } from "@/lib/vault";

export type LedgerAssetType = "MDX" | "PDF" | "PPT" | "FILE";

export type LedgerAsset = {
  id: string;
  name: string;
  type: LedgerAssetType;
  date: string;
  clearance: string;
  href: string;
  partition: VaultPartition;
  directory: string;
};

export type LedgerCourseNode = {
  slug: string;
  title: string;
  partition: VaultPartition;
  assets: LedgerAsset[];
};

export type LedgerDrawer = {
  title: string;
  partition: VaultPartition;
  courses: Array<{ slug: string; title: string }>;
};

export type SpotlightItem = {
  title: string;
  keywords: string;
  href: string;
};

export const partitionTitle: Record<VaultPartition, string> = {
  life: "Life Chronicle",
  notes: "Notes Index",
  research: "Research Ledger",
  tech: "Technical Dossier",
};
