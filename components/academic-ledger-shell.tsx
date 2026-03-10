"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { type AcademicCourseGroup } from "@/lib/academic-ledger-shared";

const accordionTransition = {
  type: "spring",
  stiffness: 300,
  damping: 25,
} as const;

type AcademicLedgerShellProps = {
  courseGroups: AcademicCourseGroup[];
  activeCourseId: string;
  activeChapterSlug?: string;
  children: React.ReactNode;
};

function getGroupForCourse(courseGroups: AcademicCourseGroup[], courseId: string) {
  return courseGroups.find((group) => group.courses.some((course) => course.id === courseId)) ?? courseGroups[0];
}

export function AcademicLedgerShell({ courseGroups, activeCourseId, activeChapterSlug, children }: AcademicLedgerShellProps) {
  const [openGroup, setOpenGroup] = useState<string>(getGroupForCourse(courseGroups, activeCourseId)?.id ?? "");

  useEffect(() => {
    setOpenGroup(getGroupForCourse(courseGroups, activeCourseId)?.id ?? "");
  }, [activeCourseId, courseGroups]);

  return (
    <motion.section
      initial={{ opacity: 0, scale: 1.02, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.95, ease: [0.16, 0.78, 0.1, 1] }}
      className="mx-auto w-full max-w-[1500px] xl:h-[calc(100vh-9rem)] xl:overflow-hidden"
    >
      <div className="grid gap-6 xl:h-full xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="glass-panel hide-scrollbar relative h-fit overflow-hidden rounded-[2rem] border border-white/8 bg-[#05090c]/82 p-5 xl:h-full xl:overflow-y-auto">
          <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#006039]/70 to-transparent" />
          <div className="pointer-events-none absolute right-[-70px] top-10 h-32 w-32 rounded-full bg-[#006039]/14 blur-3xl" />

          <div className="border-b border-white/8 pb-4">
            <p className="meta-text text-[10px] tracking-[0.32em] text-[#d4af37]/78">Sector 01</p>
            <Link href="/sector/academic-ledger" className="block">
              <h1 className="font-editorial pt-3 text-3xl italic text-[#f3f3f1]">Academic Ledger</h1>
            </Link>
            <p className="pt-3 text-[11px] uppercase tracking-[0.24em] text-[#006039]/88">Oystersteel Study Registry</p>
          </div>

          <div className="space-y-5 pt-5">
            {courseGroups.map((group) => {
              const isOpen = openGroup === group.id;
              return (
                <div key={group.id}>
                  <button
                    type="button"
                    onClick={() => setOpenGroup(isOpen ? "" : group.id)}
                    className="flex w-full items-center justify-between py-1 text-left"
                  >
                    <span className="text-[10px] tracking-[0.42em] text-gray-500">{group.title}</span>
                    <span className="text-[10px] tracking-[0.24em] text-[#006039]/82">{isOpen ? "OPEN" : "LOCKED"}</span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={accordionTransition}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2 pt-3">
                          {group.courses.map((course) => {
                            const active = activeCourseId === course.id;
                            return (
                              <Link
                                key={course.id}
                                href={`/sector/academic-ledger/${course.id}`}
                                className={`block w-full border-l-2 px-3 py-3 text-left transition-colors duration-300 ${
                                  active
                                    ? "border-l-[#d4af37] bg-[#006039]/12"
                                    : "border-l-transparent bg-transparent hover:bg-[#006039]/6"
                                }`}
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <p className="text-sm tracking-[0.08em] text-neutral-100">{course.title}</p>
                                  <span
                                    className={`h-1.5 w-1.5 rounded-full ${active ? "bg-[#006039] shadow-[0_0_12px_rgba(0,96,57,0.9)]" : "bg-white/20"}`}
                                  />
                                </div>
                                <p className="pt-1 text-[10px] uppercase tracking-[0.24em] text-neutral-400/74">
                                  {course.code} / {course.term}
                                </p>
                                {active && activeChapterSlug ? (
                                  <p className="pt-2 text-[10px] uppercase tracking-[0.24em] text-[#d4af37]/80">
                                    Chapter Focus: {activeChapterSlug.replace(/-/g, " ")}
                                  </p>
                                ) : null}
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </aside>

        <div className="hide-scrollbar min-w-0 xl:h-full xl:overflow-y-auto xl:pr-1">{children}</div>
      </div>
    </motion.section>
  );
}
