"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { type AcademicChapterSummary, type AcademicCourseSummary } from "@/lib/academic-ledger-shared";

export function AcademicLedgerChapterDetail({
  course,
  chapter,
}: {
  course: AcademicCourseSummary;
  chapter: AcademicChapterSummary;
}) {
  return (
    <div className="glass-panel relative overflow-hidden rounded-[2rem] border border-white/8 bg-[#05090c]/72 p-5 md:p-7">
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#006039]/70 to-transparent" />
      <div className="pointer-events-none absolute left-[-80px] top-12 h-40 w-40 rounded-full bg-[#006039]/10 blur-3xl" />

      <div className="border-b border-white/8 pb-6">
        <p className="text-[10px] tracking-[0.36em] text-[#006039]">CHAPTER DOSSIER</p>
        <h2 className="pt-3 font-editorial text-4xl italic text-[#f5f3ef]">{chapter.title}</h2>
        <p className="pt-2 text-lg tracking-[0.08em] text-white">{course.title}</p>

        <div className="mt-5 flex flex-wrap gap-3">
          <span className="rounded-full border border-[#006039]/40 bg-[#006039]/10 px-3 py-1 text-[10px] uppercase tracking-[0.26em] text-[#78b79b]">
            {chapter.noteCount} Notes
          </span>
          <span className="rounded-full border border-[#d4af37]/25 bg-[#d4af37]/8 px-3 py-1 text-[10px] uppercase tracking-[0.26em] text-[#d4af37]">
            Last Modified {new Date(chapter.updatedAt).toLocaleDateString("zh-CN")}
          </span>
        </div>

        <p className="pt-5 max-w-3xl text-sm leading-8 tracking-[0.08em] text-neutral-300/78">{chapter.summary}</p>
      </div>

      <div className="pt-6">
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-white/8 pb-3">
          <p className="text-[10px] tracking-[0.42em] text-[#006039]">NOTE INDEX</p>
          <p className="text-[10px] tracking-[0.32em] text-neutral-500">Private Chapter Notes</p>
        </div>

        {chapter.notes.map((note) => (
          <motion.article
            key={note.slug}
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

            <Link href={`/sector/academic-ledger/${course.id}/${chapter.slug}/${note.slug}`} className="block">
              <div className="grid gap-4 py-5 md:grid-cols-[180px_minmax(0,1fr)_220px] md:items-center">
                <div>
                  <p className="font-editorial text-lg italic tracking-[0.08em] text-[#d4af37]">NOTE</p>
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
                    {note.title}
                  </motion.p>
                  <p className="pt-2 text-[11px] tracking-[0.12em] text-neutral-400/76">{note.summary}</p>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                    Last Modified: {new Date(note.updatedAt).toLocaleDateString("zh-CN")}
                  </p>
                </div>
              </div>
            </Link>
          </motion.article>
        ))}

        <div className="pt-6">
          <Link
            href={`/sector/academic-ledger/${course.id}`}
            className="inline-flex rounded-[1.25rem] border border-[#006039]/30 bg-[#006039]/10 px-4 py-3 text-sm tracking-[0.08em] text-neutral-100 transition-colors hover:bg-[#006039]/16"
          >
            Back to {course.title}
          </Link>
        </div>
      </div>
    </div>
  );
}
