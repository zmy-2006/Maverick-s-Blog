import { prisma } from "@/lib/prisma";
import { getAllArchives } from "@/lib/archives";
import { type VaultPartition, vaultPartitions } from "@/lib/vault";
import { partitionTitle, type LedgerAssetType, type LedgerCourseNode, type LedgerDrawer, type SpotlightItem } from "@/lib/ledger-shared";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleize(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function inferType(name: string, mimeType?: string): LedgerAssetType {
  const lower = name.toLowerCase();
  if (lower.endsWith(".md") || lower.endsWith(".mdx") || mimeType?.includes("markdown")) return "MDX";
  if (lower.endsWith(".pdf") || mimeType === "application/pdf") return "PDF";
  if (lower.endsWith(".ppt") || lower.endsWith(".pptx")) return "PPT";
  return "FILE";
}

function clearanceFromPartition(partition: VaultPartition) {
  if (partition === "life") return "Tier 01";
  if (partition === "notes") return "Tier 02";
  if (partition === "research") return "Tier 03";
  return "Tier 04";
}

export async function getLedgerSnapshot() {
  const [archives, vaultRows] = await Promise.all([
    getAllArchives(),
    (async () => {
      if (!process.env.DATABASE_URL) return [];
      try {
        return await prisma.vaultAsset.findMany({ orderBy: { uploadedAt: "desc" }, take: 200 });
      } catch {
        return [];
      }
    })(),
  ]);

  const courses = new Map<string, LedgerCourseNode>();
  const ensureCourse = (partition: VaultPartition, directory: string) => {
    const slug = slugify(directory);
    const key = `${partition}:${slug}`;
    if (!courses.has(key)) {
      courses.set(key, {
        slug,
        title: titleize(slug),
        partition,
        assets: [],
      });
    }
    return courses.get(key)!;
  };

  archives.forEach((entry) => {
    const partition = entry.category as VaultPartition;
    const course = ensureCourse(partition, `${partition}-archive`);
    course.assets.push({
      id: `archive-${entry.slug}`,
      name: `${entry.title}.mdx`,
      type: "MDX",
      date: entry.publishedAt,
      clearance: entry.tier,
      href: entry.url,
      partition,
      directory: `${partition}-archive`,
    });
  });

  vaultRows.forEach((row) => {
    const partition = row.partition as VaultPartition;
    if (!vaultPartitions.includes(partition)) return;
    const directory = row.directory?.trim() || "general-intake";
    const course = ensureCourse(partition, directory);
    course.assets.push({
      id: row.id,
      name: row.originalName,
      type: inferType(row.originalName, row.mimeType),
      date: row.uploadedAt.toISOString(),
      clearance: clearanceFromPartition(partition),
      href: `/depository/preview?url=${encodeURIComponent(row.blobUrl)}&name=${encodeURIComponent(
        row.originalName,
      )}&type=${encodeURIComponent(row.mimeType)}`,
      partition,
      directory,
    });
  });

  const allCourses = Array.from(courses.values()).map((course) => ({
    ...course,
    assets: [...course.assets].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  }));

  const drawers: LedgerDrawer[] = vaultPartitions
    .map((partition) => {
      const partitionCourses = allCourses
        .filter((course) => course.partition === partition)
        .sort((a, b) => a.title.localeCompare(b.title));
      return {
        title: partitionTitle[partition],
        partition,
        courses: partitionCourses.map((course) => ({ slug: course.slug, title: course.title })),
      };
    })
    .filter((drawer) => drawer.courses.length > 0);

  const spotlightItems: SpotlightItem[] = allCourses.flatMap((course) => [
    {
      title: `${partitionTitle[course.partition]} / ${course.title}`,
      keywords: `${course.partition} ${course.title}`,
      href: `/ledger/${course.partition}/${course.slug}`,
    },
    ...course.assets.slice(0, 4).map((asset) => ({
      title: asset.name,
      keywords: `${asset.partition} ${course.title} ${asset.type}`,
      href: asset.href,
    })),
  ]);

  return { drawers, courses: allCourses, spotlightItems };
}

export async function getLedgerCourse(partition: string, courseSlug: string) {
  const snapshot = await getLedgerSnapshot();
  return snapshot.courses.find((course) => course.partition === partition && course.slug === courseSlug) ?? null;
}
