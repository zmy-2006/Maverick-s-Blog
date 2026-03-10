import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { type AcademicNote } from "@/lib/academic-ledger-shared";

export function AcademicLedgerNoteDetail({ note }: { note: AcademicNote }) {
  return (
    <section className="glass-panel relative overflow-hidden rounded-[2rem] border border-white/8 bg-[#05090c]/72 p-5 md:p-7">
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#006039]/70 to-transparent" />
      <div className="pointer-events-none absolute left-[-80px] top-12 h-40 w-40 rounded-full bg-[#006039]/10 blur-3xl" />

      <header className="border-b border-white/8 pb-6">
        <p className="text-[10px] tracking-[0.36em] text-[#006039]">NOTE DOSSIER</p>
        <h1 className="pt-3 font-editorial text-4xl italic text-[#f5f3ef]">{note.title}</h1>
        <div className="mt-5 flex flex-wrap gap-3">
          <span className="rounded-full border border-[#006039]/40 bg-[#006039]/10 px-3 py-1 text-[10px] uppercase tracking-[0.26em] text-[#78b79b]">
            {note.course.title}
          </span>
          <span className="rounded-full border border-[#d4af37]/25 bg-[#d4af37]/8 px-3 py-1 text-[10px] uppercase tracking-[0.26em] text-[#d4af37]">
            {note.chapter.title}
          </span>
        </div>
        <p className="pt-4 max-w-3xl text-sm leading-8 tracking-[0.08em] text-neutral-300/78">{note.summary}</p>
      </header>

      <div className="flex flex-wrap gap-3 pt-6">
        <Link
          href={`/sector/academic-ledger/${note.course.id}`}
          className="rounded-[1.25rem] border border-white/10 bg-black/20 px-4 py-3 text-sm tracking-[0.08em] text-neutral-200 transition-colors hover:bg-white/5"
        >
          Back to Course
        </Link>
        <Link
          href={`/sector/academic-ledger/${note.course.id}/${note.chapter.slug}`}
          className="rounded-[1.25rem] border border-[#006039]/30 bg-[#006039]/10 px-4 py-3 text-sm tracking-[0.08em] text-neutral-100 transition-colors hover:bg-[#006039]/16"
        >
          Back to Chapter
        </Link>
      </div>

      <article className="prose prose-invert prose-headings:font-editorial prose-headings:text-neutral-100 prose-h1:text-4xl prose-h2:italic prose-blockquote:border-[#006039]/45 prose-blockquote:bg-[#006039]/8 prose-blockquote:px-4 prose-blockquote:py-3 prose-strong:text-[#d4af37]/85 prose-a:text-[#d4af37] prose-li:text-neutral-300/85 prose-p:leading-8 prose-p:text-neutral-200/85 mt-8 max-w-none">
        <ReactMarkdown
          components={{
            img: ({ src, alt }) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src ?? ""} alt={alt ?? ""} className="rounded-2xl border border-white/10 bg-black/20" />
            ),
          }}
        >
          {note.body}
        </ReactMarkdown>
      </article>
    </section>
  );
}
