"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { vaultPartitions, type VaultAssetRecord, type VaultPartition } from "@/lib/vault";

type UploadResult =
  | { ok: true; asset: VaultAssetRecord }
  | { ok: false; message: string };

const MAX_BYTES = 25 * 1024 * 1024;

function isVaultPartition(value: string): value is VaultPartition {
  return vaultPartitions.includes(value as VaultPartition);
}

export async function uploadVaultAsset(formData: FormData): Promise<UploadResult> {
  const partitionRaw = formData.get("partition");
  const directoryRaw = formData.get("directory");
  const file = formData.get("file");

  if (typeof partitionRaw !== "string" || !isVaultPartition(partitionRaw)) {
    return { ok: false, message: "Invalid partition." };
  }

  if (!(file instanceof File)) {
    return { ok: false, message: "No file selected." };
  }
  const directory =
    typeof directoryRaw === "string" && directoryRaw.trim().length > 0
      ? directoryRaw.trim().slice(0, 60)
      : null;

  if (file.size === 0) {
    return { ok: false, message: "File is empty." };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, message: "File is too large. Max size is 25MB." };
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return { ok: false, message: "Missing BLOB_READ_WRITE_TOKEN in environment." };
  }
  if (!process.env.DATABASE_URL) {
    return { ok: false, message: "Missing DATABASE_URL in environment." };
  }

  try {
    const blob = await put(`vault/${partitionRaw}/${Date.now()}-${file.name}`, file, {
      access: "public",
      token,
      addRandomSuffix: true,
    });

    const created = await prisma.vaultAsset.create({
      data: {
        originalName: file.name,
        blobUrl: blob.url,
        mimeType: file.type || "application/octet-stream",
        sizeBytes: file.size,
        partition: partitionRaw,
        directory,
      },
    });

    revalidatePath("/depository");

    return {
      ok: true,
      asset: {
        id: created.id,
        originalName: created.originalName,
        blobUrl: created.blobUrl,
        mimeType: created.mimeType,
        sizeBytes: created.sizeBytes,
        partition: created.partition as VaultPartition,
        directory: created.directory,
        uploadedAt: created.uploadedAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("uploadVaultAsset failed:", error);
    return { ok: false, message: "Upload failed. Please check Blob/Database configuration." };
  }
}
