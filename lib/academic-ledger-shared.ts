export type AcademicGroupId = "current" | "archived";

export type AcademicNoteSummary = {
  slug: string;
  title: string;
  summary: string;
  updatedAt: string;
};

export type AcademicChapterSummary = {
  slug: string;
  title: string;
  summary: string;
  updatedAt: string;
  noteCount: number;
  notes: AcademicNoteSummary[];
};

export type AcademicCourseSummary = {
  id: string;
  title: string;
  code?: string;
  term?: string;
  summary: string;
  group: AcademicGroupId;
  chapters: AcademicChapterSummary[];
};

export type AcademicCourseGroup = {
  id: AcademicGroupId;
  title: string;
  courses: AcademicCourseSummary[];
};

export type AcademicNote = AcademicNoteSummary & {
  body: string;
  chapter: AcademicChapterSummary;
  course: AcademicCourseSummary;
};
