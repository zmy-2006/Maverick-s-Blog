import Link from "next/link";
import ReactMarkdown from "react-markdown";

type PreviewPageProps = {
  searchParams: {
    url?: string;
    name?: string;
    type?: string;
  };
};

function isValidHttpUrl(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function isTextLike(mime: string, name: string) {
  return mime.startsWith("text/") || mime.includes("markdown") || name.endsWith(".md") || name.endsWith(".mdx");
}

export default async function PreviewPage({ searchParams }: PreviewPageProps) {
  const url = searchParams.url ?? "";
  const name = searchParams.name ?? "untitled";
  const mime = searchParams.type ?? "";

  if (!url || !isValidHttpUrl(url)) {
    return (
      <section className="mx-auto w-full max-w-4xl pb-16">
        <div className="glass-panel rounded-3xl p-8">
          <p className="meta-text text-[10px]">Preview</p>
          <h1 className="font-editorial pt-4 text-4xl italic text-neutral-100">Invalid file URL</h1>
        </div>
      </section>
    );
  }

  let textContent: string | null = null;
  if (isTextLike(mime, name)) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (response.ok) {
        textContent = await response.text();
      }
    } catch {
      textContent = null;
    }
  }

  return (
    <section className="mx-auto w-full max-w-5xl pb-16 space-y-6">
      <div className="glass-panel rounded-3xl p-7 md:p-9">
        <p className="meta-text text-[10px]">Online Preview</p>
        <h1 className="font-editorial pt-4 text-3xl italic text-neutral-100 md:text-4xl">{name}</h1>
        <p className="pt-2 text-xs tracking-[0.12em] text-neutral-300/75">{mime || "unknown mime"}</p>
        <div className="pt-5">
          <Link href="/depository" className="text-xs tracking-[0.14em] text-[var(--theme-accent)]/90">
            Return to Secure Depository
          </Link>
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-6 md:p-8">
        {textContent ? (
          <article className="prose prose-invert prose-headings:font-editorial prose-headings:italic prose-p:text-neutral-200/85 max-w-none">
            <ReactMarkdown>{textContent}</ReactMarkdown>
          </article>
        ) : mime.startsWith("image/") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={name} className="h-auto max-h-[80vh] w-full rounded-2xl object-contain" />
        ) : mime === "application/pdf" ? (
          <iframe src={url} className="h-[78vh] w-full rounded-2xl border border-white/10" title={name} />
        ) : (
          <div className="space-y-3">
            <p className="text-sm tracking-[0.06em] text-neutral-300/85">This file type does not support embedded preview.</p>
            <a href={url} target="_blank" rel="noreferrer" className="text-xs tracking-[0.14em] text-[var(--theme-accent)]/90">
              Open file in new tab
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
