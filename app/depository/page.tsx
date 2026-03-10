import { DepositoryStudio } from "@/components/depository-studio";
import { prisma } from "@/lib/prisma";
import { type VaultAssetRecord, type VaultPartition } from "@/lib/vault";

export const metadata = {
  title: "Secure Depository",
  description: "Partitioned upload and archive intake for private assets.",
};

export const dynamic = "force-dynamic";

async function getRecentAssets(): Promise<VaultAssetRecord[]> {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
    const rows = await prisma.vaultAsset.findMany({
      orderBy: { uploadedAt: "desc" },
      take: 24,
    });
    return rows.map((row) => ({
      id: row.id,
      originalName: row.originalName,
      blobUrl: row.blobUrl,
      mimeType: row.mimeType,
      sizeBytes: row.sizeBytes,
      partition: row.partition as VaultPartition,
      directory: row.directory,
      uploadedAt: row.uploadedAt.toISOString(),
    }));
  } catch {
    return [];
  }
}

export default async function DepositoryPage() {
  const initialAssets = await getRecentAssets();
  return <DepositoryStudio initialAssets={initialAssets} />;
}
