import { notFound } from "next/navigation";
import { AcademicLedgerOverview } from "@/components/academic-ledger-overview";
import { AcademicLedgerShell } from "@/components/academic-ledger-shell";
import { getAcademicCourseGroups, getAllAcademicCourses } from "@/lib/academic-ledger";

export const metadata = {
  title: "Academic Ledger",
  description: "Rolex-inspired academic command center for course notes, chapter indexes, and study instruments.",
};

export default async function AcademicLedgerPage() {
  const [courseGroups, courses] = await Promise.all([getAcademicCourseGroups(), getAllAcademicCourses()]);
  const course = courses[0];
  if (!course) notFound();

  return (
    <AcademicLedgerShell courseGroups={courseGroups} activeCourseId={course.id}>
      <AcademicLedgerOverview course={course} />
    </AcademicLedgerShell>
  );
}
