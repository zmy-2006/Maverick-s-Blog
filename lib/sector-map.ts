import { type ArchiveCategory } from "@/lib/archives";

export const sectorMap = {
  "academic-ledger": {
    title: "Academic Ledger",
    category: "notes" as ArchiveCategory,
    summary: "Structured coursework, study notes, reading extracts, and knowledge indexing.",
    sector: "01",
  },
  "technical-matrix": {
    title: "The Technical Matrix",
    category: "tech" as ArchiveCategory,
    summary: "Architecture journals, engineering decisions, and reusable technical sediment.",
    sector: "02",
  },
  "research-pipeline": {
    title: "Research Pipeline",
    category: "research" as ArchiveCategory,
    summary: "Protocols, experiments, iteration records, and active scientific inquiry.",
    sector: "03",
  },
  "private-chronicle": {
    title: "Private Chronicle",
    category: "life" as ArchiveCategory,
    summary: "Life records, routines, private logs, and reflective memory fragments.",
    sector: "04",
  },
} as const;

export type SectorSlug = keyof typeof sectorMap;
