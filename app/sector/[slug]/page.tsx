import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getAllArchives } from "@/lib/archives";
import { sectorMap, type SectorSlug } from "@/lib/sector-map";

type SectorPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return Object.keys(sectorMap)
    .filter((slug) => slug !== "academic-ledger")
    .map((slug) => ({ slug }));
}

export default async function SectorPage({ params }: SectorPageProps) {
  const sector = sectorMap[params.slug as SectorSlug];
  if (!sector) notFound();

  const entries = (await getAllArchives()).filter((entry) => entry.category === sector.category);

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 pb-16">
      <header className="glass-panel rounded-3xl p-7 md:p-10">
        <p className="meta-text text-[10px]">Sector {sector.sector}</p>
        <h1 className="font-editorial pt-4 text-4xl italic text-[#d4af37] md:text-5xl">{sector.title}</h1>
        <p className="max-w-2xl pt-4 text-sm leading-8 tracking-[0.08em] text-neutral-300/82">{sector.summary}</p>
      </header>

      <div className="space-y-3">
        {entries.map((entry) => (
          <Link
            key={entry.slug}
            href={entry.url}
            className="group glass-panel block rounded-2xl px-5 py-4 transition-all duration-700 ease-vault-ease hover:border-[var(--theme-accent)]/40 hover:bg-black/35"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm tracking-[0.08em] text-neutral-100">{entry.title}</p>
                <p className="pt-1 text-[11px] tracking-[0.12em] text-neutral-400/78">{entry.summary}</p>
              </div>
              <div className="text-right text-[11px] tracking-[0.14em]">
                <p className="text-[var(--theme-accent)]/88">{entry.tier}</p>
                <p className="pt-1 text-neutral-300/72">{formatDate(entry.publishedAt)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
