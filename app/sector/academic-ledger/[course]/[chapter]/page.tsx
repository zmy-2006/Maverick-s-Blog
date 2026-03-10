import { notFound, redirect } from "next/navigation";
import { AcademicLedgerChapterDetail } from "@/components/academic-ledger-chapter-detail";
import { AcademicLedgerShell } from "@/components/academic-ledger-shell";
import { getAcademicChapter, getAcademicChapterParams, getAcademicCourseGroups } from "@/lib/academic-ledger";

type AcademicChapterPageProps = {
  params: {
    course: string;
    chapter: string;
  };
};

export async function generateStaticParams() {
  return getAcademicChapterParams();
}

export default async function AcademicChapterPage({ params }: AcademicChapterPageProps) {
  const [courseGroups, match] = await Promise.all([getAcademicCourseGroups(), getAcademicChapter(params.course, params.chapter)]);
  if (!match) notFound();
  if (match.chapter.noteCount === 1) {
    redirect(`/sector/academic-ledger/${match.course.id}/${match.chapter.slug}/${match.chapter.notes[0].slug}`);
  }

  return (
    <AcademicLedgerShell courseGroups={courseGroups} activeCourseId={match.course.id} activeChapterSlug={match.chapter.slug}>
      <AcademicLedgerChapterDetail course={match.course} chapter={match.chapter} />
    </AcademicLedgerShell>
  );
}
