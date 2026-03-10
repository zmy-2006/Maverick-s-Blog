import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { categoryLabels, formatDate, getArchiveBySlug } from "@/lib/archives";
import { getAllArchives } from "@/lib/archives";

type ArchiveDetailPageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const entries = await getAllArchives();
  return entries.map((entry) => ({
    slug: entry.slug,
  }));
}

export async function generateMetadata({ params }: ArchiveDetailPageProps) {
  const entry = await getArchiveBySlug(params.slug);
  if (!entry) {
    return {
      title: "Entry Not Found",
    };
  }

  return {
    title: entry.title,
    description: entry.summary,
  };
}

export default async function ArchiveDetailPage({ params }: ArchiveDetailPageProps) {
  const entry = await getArchiveBySlug(params.slug);
  if (!entry) {
    notFound();
  }

  return (
    <section className="mx-auto w-full max-w-4xl pb-16">
      <header className="glass-panel rounded-3xl p-8 md:p-10">
        <p className="meta-text text-[10px]">{entry.tier}</p>
        <h1 className="font-editorial pt-4 text-4xl italic text-neutral-100 md:text-5xl">{entry.title}</h1>
        <p className="pt-4 text-sm leading-8 tracking-[0.08em] text-neutral-200/80">{entry.summary}</p>
        <div className="pt-6 flex flex-wrap items-center gap-4 text-xs tracking-[0.14em]">
          <span className="text-[#d4af37]/85">{categoryLabels[entry.category]}</span>
          <span className="text-neutral-300/70">{formatDate(entry.publishedAt)}</span>
          <span className="text-neutral-300/70">{entry.readingTime}</span>
        </div>
      </header>

      <div className="glass-panel mt-8 rounded-3xl p-8 md:p-10">
        <article className="prose prose-invert prose-headings:font-editorial prose-headings:text-neutral-100 prose-h2:italic prose-p:leading-8 prose-p:text-neutral-200/85 prose-strong:text-[#d4af37]/85 prose-li:text-neutral-300/85 max-w-none">
          <MDXRemote source={entry.body} />
        </article>
      </div>
    </section>
  );
}
