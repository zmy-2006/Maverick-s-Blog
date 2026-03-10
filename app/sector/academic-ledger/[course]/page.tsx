import { notFound } from "next/navigation";
import { AcademicLedgerOverview } from "@/components/academic-ledger-overview";
import { AcademicLedgerShell } from "@/components/academic-ledger-shell";
import { getAcademicCourse, getAcademicCourseGroups, getAcademicCourseParams } from "@/lib/academic-ledger";

type AcademicCoursePageProps = {
  params: {
    course: string;
  };
};

export async function generateStaticParams() {
  return getAcademicCourseParams();
}

export default async function AcademicCoursePage({ params }: AcademicCoursePageProps) {
  const [courseGroups, course] = await Promise.all([getAcademicCourseGroups(), getAcademicCourse(params.course)]);
  if (!course) notFound();

  return (
    <AcademicLedgerShell courseGroups={courseGroups} activeCourseId={course.id}>
      <AcademicLedgerOverview course={course} />
    </AcademicLedgerShell>
  );
}
