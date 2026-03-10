import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type {
  AcademicChapterSummary,
  AcademicCourseGroup,
  AcademicCourseSummary,
  AcademicGroupId,
  AcademicNote,
  AcademicNoteSummary,
} from "@/lib/academic-ledger-shared";

const ledgerRoot = path.join(process.cwd(), "content", "academic-ledger");

type CourseMeta = {
  title?: string;
  code?: string;
  term?: string;
  summary?: string;
  group?: AcademicGroupId;
};

function labelFromSlug(value: string) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function summaryFromBody(body: string) {
  return body
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith("#") && !line.startsWith("![[") && !line.startsWith(">"))
    ?.slice(0, 140) ?? "Private study note.";
}

function coerceDate(value: string | Date | undefined, fallback: Date) {
  if (!value) return fallback.toISOString();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback.toISOString() : date.toISOString();
}

async function safeReadJson<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function listDirectories(targetPath: string) {
  try {
    const entries = await fs.readdir(targetPath, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
  } catch {
    return [];
  }
}

async function listMarkdownFiles(targetPath: string) {
  try {
    const entries = await fs.readdir(targetPath, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && /\.(md|mdx)$/i.test(entry.name))
      .map((entry) => entry.name)
      .sort();
  } catch {
    return [];
  }
}

function rewriteWikiSyntax(body: string, courseId: string, chapterSlug: string) {
  const withCallouts = body.replace(/^>\s*\[!(\w+)\]\s*$/gim, (_match, kind: string) => `> **${labelFromSlug(kind)}**`);
  const withImages = withCallouts.replace(/!\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, (_match, target: string) => {
    const encodedPath = [courseId, chapterSlug, target]
      .map((part) => part.split("/").map(encodeURIComponent).join("/"))
      .join("/");
    const alt = path.basename(target, path.extname(target));
    return `![${alt}](/api/academic-ledger/assets/${encodedPath})`;
  });

  return withImages.replace(/\[\[([^\]]+)\]\]/g, (_match, target: string) => target.split("|")[0]);
}

async function getNoteSummary(courseId: string, chapterSlug: string, noteFile: string): Promise<AcademicNoteSummary> {
  const notePath = path.join(ledgerRoot, courseId, chapterSlug, noteFile);
  const raw = await fs.readFile(notePath, "utf8");
  const stats = await fs.stat(notePath);
  const { data, content } = matter(raw);

  return {
    slug: noteFile.replace(/\.(md|mdx)$/i, ""),
    title: typeof data.title === "string" ? data.title : labelFromSlug(noteFile.replace(/\.(md|mdx)$/i, "")),
    summary: typeof data.summary === "string" ? data.summary : summaryFromBody(content),
    updatedAt: coerceDate(typeof data.updatedAt === "string" ? data.updatedAt : undefined, stats.mtime),
  };
}

async function getChapterSummary(courseId: string, chapterSlug: string): Promise<AcademicChapterSummary | null> {
  const chapterPath = path.join(ledgerRoot, courseId, chapterSlug);
  const noteFiles = await listMarkdownFiles(chapterPath);
  if (noteFiles.length === 0) return null;

  const notes = await Promise.all(noteFiles.map((file) => getNoteSummary(courseId, chapterSlug, file)));
  const updatedAt = notes
    .map((note) => new Date(note.updatedAt).getTime())
    .sort((a, b) => b - a)[0];

  return {
    slug: chapterSlug,
    title: labelFromSlug(chapterSlug),
    summary: notes[0]?.summary ?? "Chapter note collection.",
    updatedAt: new Date(updatedAt).toISOString(),
    noteCount: notes.length,
    notes,
  };
}

async function getCourseSummary(courseId: string): Promise<AcademicCourseSummary | null> {
  const coursePath = path.join(ledgerRoot, courseId);
  const meta = await safeReadJson<CourseMeta>(path.join(coursePath, "course.json"));
  const chapterDirs = (await listDirectories(coursePath)).filter((dir) => dir !== "assets" && dir !== "fig");
  const chapters = (await Promise.all(chapterDirs.map((dir) => getChapterSummary(courseId, dir)))).filter(
    (chapter): chapter is AcademicChapterSummary => Boolean(chapter),
  );
  if (chapters.length === 0) return null;

  return {
    id: courseId,
    title: meta?.title ?? labelFromSlug(courseId),
    code: meta?.code,
    term: meta?.term,
    summary: meta?.summary ?? chapters[0]?.summary ?? "Private course ledger.",
    group: meta?.group ?? "current",
    chapters,
  };
}

export async function getAcademicCourseGroups(): Promise<AcademicCourseGroup[]> {
  const courseDirs = await listDirectories(ledgerRoot);
  const courses = (await Promise.all(courseDirs.map((dir) => getCourseSummary(dir)))).filter(
    (course): course is AcademicCourseSummary => Boolean(course),
  );

  const groups: AcademicCourseGroup[] = [
    {
      id: "current",
      title: "CURRENT SESSION",
      courses: courses.filter((course) => course.group === "current"),
    },
    {
      id: "archived",
      title: "ARCHIVED CREDITS",
      courses: courses.filter((course) => course.group === "archived"),
    },
  ];

  return groups.filter((group) => group.courses.length > 0);
}

export async function getAllAcademicCourses() {
  const groups = await getAcademicCourseGroups();
  return groups.flatMap((group) => group.courses);
}

export async function getAcademicCourse(courseId: string) {
  const courses = await getAllAcademicCourses();
  return courses.find((course) => course.id === courseId) ?? null;
}

export async function getAcademicChapter(courseId: string, chapterSlug: string) {
  const course = await getAcademicCourse(courseId);
  if (!course) return null;
  const chapter = course.chapters.find((item) => item.slug === chapterSlug) ?? null;
  return chapter ? { course, chapter } : null;
}

export async function getAcademicNote(courseId: string, chapterSlug: string, noteSlug: string): Promise<AcademicNote | null> {
  const match = await getAcademicChapter(courseId, chapterSlug);
  if (!match) return null;

  const noteFile = `${noteSlug}.md`;
  const noteFileMdx = `${noteSlug}.mdx`;
  const chapterPath = path.join(ledgerRoot, courseId, chapterSlug);
  let notePath = path.join(chapterPath, noteFile);
  try {
    await fs.access(notePath);
  } catch {
    notePath = path.join(chapterPath, noteFileMdx);
    try {
      await fs.access(notePath);
    } catch {
      return null;
    }
  }

  const raw = await fs.readFile(notePath, "utf8");
  const stats = await fs.stat(notePath);
  const { data, content } = matter(raw);

  return {
    slug: noteSlug,
    title: typeof data.title === "string" ? data.title : labelFromSlug(noteSlug),
    summary: typeof data.summary === "string" ? data.summary : summaryFromBody(content),
    updatedAt: coerceDate(typeof data.updatedAt === "string" ? data.updatedAt : undefined, stats.mtime),
    body: rewriteWikiSyntax(content, courseId, chapterSlug),
    course: match.course,
    chapter: match.chapter,
  };
}

export async function getAcademicCourseParams() {
  const courses = await getAllAcademicCourses();
  return courses.map((course) => ({ course: course.id }));
}

export async function getAcademicChapterParams() {
  const courses = await getAllAcademicCourses();
  return courses.flatMap((course) =>
    course.chapters.map((chapter) => ({
      course: course.id,
      chapter: chapter.slug,
    })),
  );
}

export async function getAcademicNoteParams() {
  const courses = await getAllAcademicCourses();
  return courses.flatMap((course) =>
    course.chapters.flatMap((chapter) =>
      chapter.notes.map((note) => ({
        course: course.id,
        chapter: chapter.slug,
        note: note.slug,
      })),
    ),
  );
}

export function getAcademicAssetsRoot() {
  return ledgerRoot;
}
