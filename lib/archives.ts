import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type ArchiveCategory = "life" | "notes" | "research" | "tech";

export type ArchiveEntry = {
  slug: string;
  url: string;
  title: string;
  summary: string;
  category: ArchiveCategory;
  publishedAt: string;
  readingTime: string;
  tier: string;
  featured?: boolean;
  body: string;
};

export const categoryLabels: Record<string, string> = {
  life: "日常生活记录",
  notes: "笔记归档",
  research: "科研记录",
  tech: "技术沉淀",
};

const archivesPath = path.join(process.cwd(), "content", "archives");

async function readArchiveFile(slug: string): Promise<ArchiveEntry | null> {
  const filePath = path.join(archivesPath, `${slug}.mdx`);
  const file = await fs.readFile(filePath, "utf8");
  const { data, content } = matter(file);

  if (
    typeof data.title !== "string" ||
    typeof data.summary !== "string" ||
    typeof data.category !== "string" ||
    typeof data.publishedAt !== "string" ||
    typeof data.readingTime !== "string" ||
    typeof data.tier !== "string"
  ) {
    return null;
  }

  return {
    slug,
    url: `/archives/${slug}`,
    title: data.title,
    summary: data.summary,
    category: data.category as ArchiveCategory,
    publishedAt: data.publishedAt,
    readingTime: data.readingTime,
    tier: data.tier,
    featured: Boolean(data.featured),
    body: content,
  };
}

export async function getAllArchives() {
  const files = await fs.readdir(archivesPath);
  const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

  const entries = await Promise.all(mdxFiles.map((file) => readArchiveFile(file.replace(/\.mdx$/, ""))));
  return entries.filter((entry): entry is ArchiveEntry => Boolean(entry)).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function getArchiveBySlug(slug: string) {
  return readArchiveFile(slug);
}

export async function getCategoryCount() {
  const entries = await getAllArchives();
  return entries.reduce<Record<string, number>>((acc, entry) => {
    const key = entry.category;
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
