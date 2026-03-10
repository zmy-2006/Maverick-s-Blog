export const vaultPartitions = ["life", "notes", "research", "tech"] as const;

export type VaultPartition = (typeof vaultPartitions)[number];

export const partitionLabels: Record<VaultPartition, string> = {
  life: "日常生活记录",
  notes: "笔记归档",
  research: "科研记录",
  tech: "技术沉淀",
};

export type VaultAssetRecord = {
  id: string;
  originalName: string;
  blobUrl: string;
  mimeType: string;
  sizeBytes: number;
  partition: VaultPartition;
  uploadedAt: string;
};

export function formatSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}
