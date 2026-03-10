import Link from "next/link";
import { categoryLabels, formatDate, getAllArchives, getCategoryCount } from "@/lib/archives";

export const metadata = {
  title: "The Archives",
  description: "Private Journal listings across life, notes, research, and technical tracks.",
};

export default async function ArchivesPage() {
  const [entries, counts] = await Promise.all([getAllArchives(), getCategoryCount()]);

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 pb-16">
      <div className="space-y-4">
        <p className="meta-text text-[11px]">The Archives · Editorial Ledger</p>
        <h1 className="font-editorial text-5xl italic text-neutral-100 md:text-6xl">Private Journal</h1>
        <p className="max-w-2xl text-sm leading-8 tracking-[0.08em] text-neutral-200/80">
          以高质量归档方式整理日常、笔记、科研与技术沉淀，让碎片记录变成长期可复用的私人资产。
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {Object.entries(categoryLabels).map(([key, label]) => (
          <div key={key} className="glass-panel rounded-2xl p-4">
            <p className="meta-text text-[10px]">{label}</p>
            <p className="pt-3 text-3xl font-light text-neutral-100">{counts[key] ?? 0}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {entries.map((entry) => (
          <Link
            key={entry.slug}
            href={entry.url}
            className="glass-panel group block rounded-3xl p-6 transition-transform duration-700 ease-vault-ease hover:-translate-y-1"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="meta-text text-[10px]">{entry.tier}</p>
              <p className="text-xs tracking-[0.16em] text-neutral-300/75">{formatDate(entry.publishedAt)}</p>
            </div>
            <h2 className="font-editorial pt-4 text-3xl italic text-neutral-100">{entry.title}</h2>
            <p className="pt-3 text-sm leading-7 tracking-[0.06em] text-neutral-300/80">{entry.summary}</p>
            <div className="pt-5 flex items-center justify-between text-xs tracking-[0.15em]">
              <span className="text-[#d4af37]/85">{categoryLabels[entry.category]}</span>
              <span className="text-neutral-300/70">{entry.readingTime}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
