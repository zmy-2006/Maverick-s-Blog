import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { getAcademicAssetsRoot } from "@/lib/academic-ledger";

type AssetRouteProps = {
  params: {
    assetPath: string[];
  };
};

const contentTypes: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
};

export async function GET(_request: Request, { params }: AssetRouteProps) {
  const root = getAcademicAssetsRoot();
  const directPath = path.normalize(path.join(root, ...params.assetPath));
  const candidates = [directPath];

  if (params.assetPath.length >= 3) {
    const [courseId, _chapterSlug, ...rest] = params.assetPath;
    candidates.push(path.normalize(path.join(root, courseId, "fig", ...rest)));
  }

  for (const candidate of candidates) {
    if (!candidate.startsWith(root)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    try {
      const buffer = await fs.readFile(candidate);
      const ext = path.extname(candidate).toLowerCase();
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": contentTypes[ext] ?? "application/octet-stream",
          "Cache-Control": "public, max-age=3600",
        },
      });
    } catch {
      continue;
    }
  }

  return new NextResponse("Not Found", { status: 404 });
}
