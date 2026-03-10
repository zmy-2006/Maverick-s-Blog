"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { type AcademicCourseSummary } from "@/lib/academic-ledger-shared";

export function AcademicLedgerOverview({ course }: { course: AcademicCourseSummary }) {
  return (
    <div className="glass-panel relative overflow-hidden rounded-[2rem] border border-white/8 bg-[#05090c]/72 p-5 md:p-7 xl:min-h-full">
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#006039]/70 to-transparent" />
      <div className="pointer-events-none absolute right-[-120px] top-[-40px] h-44 w-44 rounded-full bg-[#006039]/10 blur-3xl" />

      <div className="border-b border-white/8 pb-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] tracking-[0.36em] text-[#006039]">CURRENT COURSE</p>
            <h2 className="pt-3 font-editorial text-4xl italic text-[#f5f3ef]">{course.title}</h2>
          </div>
          <div className="text-left md:text-right">
            <p className="text-[10px] tracking-[0.28em] text-neutral-500">REFERENCE</p>
            <p className="pt-2 text-xs uppercase tracking-[0.22em] text-neutral-300/78">
              {[course.code, course.term].filter(Boolean).join(" / ")}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <span className="rounded-full border border-[#d4af37]/25 bg-[#d4af37]/8 px-3 py-1 text-[10px] uppercase tracking-[0.26em] text-[#d4af37]">
            {course.chapters.length} Chapters
          </span>
          <span className="rounded-full border border-[#006039]/40 bg-[#006039]/10 px-3 py-1 text-[10px] uppercase tracking-[0.26em] text-[#78b79b]">
            {course.chapters.reduce((count, chapter) => count + chapter.noteCount, 0)} Notes
          </span>
        </div>

        <p className="pt-4 max-w-2xl text-sm leading-8 tracking-[0.08em] text-neutral-300/78">{course.summary}</p>
      </div>

      <div className="pt-8">
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-white/8 pb-3">
          <p className="text-[10px] tracking-[0.42em] text-[#006039]">DIAL INDEX</p>
          <p className="text-[10px] tracking-[0.32em] text-neutral-500">Precision Chapter Registry</p>
        </div>

        {course.chapters.map((chapter) => (
          <motion.article
            key={chapter.slug}
            initial="rest"
            whileHover="hover"
            animate="rest"
            className="group relative overflow-hidden border-b border-white/5"
          >
            <motion.span
              variants={{
                rest: { x: "-140%" },
                hover: { x: "240%" },
              }}
              transition={{ duration: 1.15, ease: [0.2, 0.72, 0.16, 1] }}
              className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)]"
            />

            <Link href={`/sector/academic-ledger/${course.id}/${chapter.slug}`} className="block">
              <div className="grid gap-4 py-5 md:grid-cols-[180px_minmax(0,1fr)_220px] md:items-center">
                <div>
                  <p className="font-editorial text-lg italic tracking-[0.08em] text-[#d4af37]">{chapter.title}</p>
                </div>

                <div className="overflow-hidden">
                  <motion.p
                    variants={{
                      rest: { x: 0 },
                      hover: { x: 4 },
                    }}
                    transition={{ duration: 0.55, ease: [0.18, 0.78, 0.1, 1] }}
                    className="text-base font-medium tracking-[0.05em] text-white"
                  >
                    {chapter.title}
                  </motion.p>
                  <p className="pt-2 text-[11px] tracking-[0.12em] text-neutral-400/76">{chapter.summary}</p>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                    Last Modified: {new Date(chapter.updatedAt).toLocaleDateString("zh-CN")}
                  </p>
                  <p className="pt-2 text-[10px] uppercase tracking-[0.28em] text-[#006039]/92">{chapter.noteCount} Notes</p>
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
