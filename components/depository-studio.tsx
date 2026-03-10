"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { DragEvent, useMemo, useState, useTransition } from "react";
import { uploadVaultAsset } from "@/app/depository/actions";
import {
  formatSize,
  partitionLabels,
  type VaultAssetRecord,
  type VaultPartition,
} from "@/lib/vault";

type LocalPendingAsset = {
  id: string;
  file: File;
  originalName: string;
  sizeBytes: number;
  partition: VaultPartition;
  directory: string;
};

const partitions: Array<{ id: VaultPartition; title: string; desc: string }> = [
  { id: "life", title: partitionLabels.life, desc: "生活照片、日记片段、时刻存档" },
  { id: "notes", title: partitionLabels.notes, desc: "课堂笔记、阅读摘录、框架草稿" },
  { id: "research", title: partitionLabels.research, desc: "实验数据、论文资料、对照日志" },
  { id: "tech", title: partitionLabels.tech, desc: "设计文档、代码方案、复盘总结" },
];

type DepositoryStudioProps = {
  initialAssets: VaultAssetRecord[];
};

export function DepositoryStudio({ initialAssets }: DepositoryStudioProps) {
  const [activePartition, setActivePartition] = useState<VaultPartition>("life");
  const [isDragging, setIsDragging] = useState(false);
  const [assets, setAssets] = useState<VaultAssetRecord[]>(initialAssets);
  const [pendingAssets, setPendingAssets] = useState<LocalPendingAsset[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploading, startUpload] = useTransition();
  const [directoryInput, setDirectoryInput] = useState("general-intake");

  const activeInfo = useMemo(
    () => partitions.find((partition) => partition.id === activePartition) ?? partitions[0],
    [activePartition],
  );
  const activeAssets = assets.filter((asset) => asset.partition === activePartition).slice(0, 12);
  const activePendingAssets = pendingAssets.filter((asset) => asset.partition === activePartition);

  const stageFiles = (files: File[]) => {
    if (files.length === 0) return;
    const staged = files.map((file) => ({
      id: `${file.name}-${file.lastModified}`,
      file,
      originalName: file.name,
      sizeBytes: file.size,
      partition: activePartition,
      directory: directoryInput.trim() || "general-intake",
    }));
    setPendingAssets((prev) => [...staged, ...prev]);
    setErrorMessage(null);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const files = Array.from(event.dataTransfer.files ?? []);
    stageFiles(files);
  };

  const uploadPending = () => {
    if (activePendingAssets.length === 0) {
      setErrorMessage("请先拖入或选择文件后再上传。");
      return;
    }

    startUpload(async () => {
      for (const pending of activePendingAssets) {
        const formData = new FormData();
        formData.set("partition", pending.partition);
        formData.set("directory", pending.directory);
        formData.set("file", pending.file);

        const result = await uploadVaultAsset(formData);
        if (!result.ok) {
          setErrorMessage(result.message);
          continue;
        }

        setAssets((prev) => [result.asset, ...prev]);
        setPendingAssets((prev) => prev.filter((asset) => asset.id !== pending.id));
      }
    });
  };

  const buildPreviewLink = (asset: VaultAssetRecord) =>
    `/depository/preview?url=${encodeURIComponent(asset.blobUrl)}&name=${encodeURIComponent(
      asset.originalName,
    )}&type=${encodeURIComponent(asset.mimeType)}`;

  const canPreview = (asset: VaultAssetRecord) =>
    asset.mimeType.startsWith("text/") ||
    asset.mimeType.includes("markdown") ||
    asset.mimeType.startsWith("image/") ||
    asset.mimeType === "application/pdf" ||
    asset.originalName.endsWith(".md") ||
    asset.originalName.endsWith(".mdx");

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 pb-16">
      <div className="space-y-4">
        <p className="meta-text text-[11px]">Secure Depository · Partitioned Intake</p>
        <h1 className="font-editorial text-5xl italic text-neutral-100 md:text-6xl">Asset Vault</h1>
        <p className="max-w-3xl text-sm leading-8 tracking-[0.08em] text-neutral-200/80">
          按分区沉淀文件资产，先选择归档板块，再拖拽上传。拖拽状态会出现香槟金边缘高亮，模拟 velvet-tray 的入库质感。
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {partitions.map((partition) => (
          <button
            type="button"
            key={partition.id}
            onClick={() => setActivePartition(partition.id)}
            className={`glass-panel rounded-2xl p-4 text-left transition-all duration-700 ease-vault-ease ${
              activePartition === partition.id ? "gold-hairline scale-[1.01]" : "opacity-80"
            }`}
          >
            <p className="meta-text text-[10px]">{partition.title}</p>
            <p className="pt-2 text-xs tracking-[0.06em] text-neutral-300/75">{partition.desc}</p>
          </button>
        ))}
      </div>

      <motion.div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.18, 0.78, 0.1, 1] }}
        className={`glass-panel rounded-3xl p-8 md:p-10 transition-all duration-700 ease-vault-ease ${
          isDragging ? "gold-hairline border-[#d4af37]/40" : ""
        }`}
      >
        <p className="meta-text text-[10px]">{activeInfo.title}</p>
        <h2 className="font-editorial pt-4 text-3xl italic text-neutral-100">Drag to Intake Chamber</h2>
        <p className="pt-3 text-sm leading-7 tracking-[0.06em] text-neutral-300/80">
          支持 PPT、PDF、Markdown、图片等文件。当前分区：{activeInfo.title}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <input
            value={directoryInput}
            onChange={(event) => setDirectoryInput(event.target.value)}
            placeholder="Directory / Course (e.g. system-design)"
            className="w-[min(340px,90vw)] rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs tracking-[0.12em] text-neutral-100 outline-none placeholder:text-neutral-400/75"
          />
          <label className="inline-flex cursor-pointer items-center rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs tracking-[0.14em] text-neutral-200/85">
            选择文件
            <input
              type="file"
              multiple
              className="sr-only"
              onChange={(event) => stageFiles(Array.from(event.target.files ?? []))}
            />
          </label>
          <button
            type="button"
            onClick={uploadPending}
            disabled={isUploading}
            className="rounded-full border border-[#d4af37]/35 bg-[#d4af37]/10 px-5 py-2 text-xs tracking-[0.16em] text-[#d4af37]/90 transition-opacity duration-500 disabled:opacity-45"
          >
            {isUploading ? "Uploading..." : "Commit To Vault"}
          </button>
        </div>
        {errorMessage ? <p className="pt-4 text-xs tracking-[0.06em] text-rose-300/90">{errorMessage}</p> : null}
      </motion.div>

      <AnimatePresence mode="popLayout">
        <div className="space-y-3">
          {activePendingAssets.length > 0 ? (
            activePendingAssets.map((asset) => (
              <motion.div
                key={asset.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.8, ease: [0.18, 0.78, 0.1, 1] }}
                className="glass-panel rounded-2xl px-5 py-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm tracking-[0.06em] text-neutral-200/90">{asset.originalName}</p>
                    <p className="pt-1 text-[11px] tracking-[0.12em] text-neutral-400/80">{asset.directory}</p>
                  </div>
                  <p className="text-xs tracking-[0.16em] text-neutral-300/75">
                    {formatSize(asset.sizeBytes)} · pending
                  </p>
                </div>
              </motion.div>
            ))
          ) : null}

          {activeAssets.length === 0 && activePendingAssets.length === 0 ? (
            <p className="text-sm tracking-[0.08em] text-neutral-300/70">
              当前分区还没有文件，拖拽文件到上方区域开始归档。
            </p>
          ) : (
            activeAssets.map((asset) => (
              <motion.div
                key={asset.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.8, ease: [0.18, 0.78, 0.1, 1] }}
                className="glass-panel rounded-2xl px-5 py-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm tracking-[0.06em] text-neutral-200/90">{asset.originalName}</p>
                    <p className="pt-1 text-[11px] tracking-[0.12em] text-neutral-300/65">
                      {(asset.directory || "general-intake") + " · " + new Date(asset.uploadedAt).toLocaleString("zh-CN")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs tracking-[0.16em] text-[#d4af37]/85">{formatSize(asset.sizeBytes)}</p>
                    <div className="pt-1 flex items-center justify-end gap-3">
                      {canPreview(asset) ? (
                        <Link href={buildPreviewLink(asset)} className="text-[11px] tracking-[0.12em] text-neutral-200/90 hover:text-white">
                          Preview
                        </Link>
                      ) : null}
                      <a
                        href={asset.blobUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] tracking-[0.12em] text-neutral-300/75 hover:text-neutral-100"
                      >
                        Open
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </AnimatePresence>
    </section>
  );
}
