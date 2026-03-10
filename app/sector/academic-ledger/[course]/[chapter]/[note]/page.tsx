import { notFound } from "next/navigation";
import { AcademicLedgerNoteDetail } from "@/components/academic-ledger-note-detail";
import { AcademicLedgerShell } from "@/components/academic-ledger-shell";
import { getAcademicCourseGroups, getAcademicNote, getAcademicNoteParams } from "@/lib/academic-ledger";

type AcademicNotePageProps = {
  params: {
    course: string;
    chapter: string;
    note: string;
  };
};

export async function generateStaticParams() {
  return getAcademicNoteParams();
}

export default async function AcademicNotePage({ params }: AcademicNotePageProps) {
  const [courseGroups, note] = await Promise.all([
    getAcademicCourseGroups(),
    getAcademicNote(params.course, params.chapter, params.note),
  ]);

  if (!note) notFound();

  return (
    <AcademicLedgerShell courseGroups={courseGroups} activeCourseId={note.course.id} activeChapterSlug={note.chapter.slug}>
      <AcademicLedgerNoteDetail note={note} />
    </AcademicLedgerShell>
  );
}
