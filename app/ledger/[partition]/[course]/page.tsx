import Link from "next/link";
import { notFound } from "next/navigation";
import { getLedgerCourse } from "@/lib/ledger";
import { partitionTitle } from "@/lib/ledger-shared";

type CoursePageProps = {
  params: {
    partition: string;
    course: string;
  };
};

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const course = await getLedgerCourse(params.partition, params.course);
  if (!course) {
    notFound();
  }

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 pb-16">
      <header className="glass-panel rounded-3xl p-7 md:p-9">
        <p className="meta-text text-[10px]">{partitionTitle[course.partition]}</p>
        <h1 className="font-editorial pt-4 text-4xl italic text-neutral-100">{course.title.replace("Course: ", "")}</h1>
        <p className="pt-4 text-sm leading-8 tracking-[0.08em] text-neutral-200/80">
          Directory detail view for private assets. Select any row to jump to note pages or depository context.
        </p>
      </header>

      <div className="space-y-3">
        {course.assets.map((asset) => (
          <Link
            key={asset.id}
            href={asset.href}
            className="group glass-panel block rounded-2xl px-5 py-4 transition-all duration-700 ease-vault-ease hover:border-[var(--theme-accent)]/40"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm tracking-[0.08em] text-neutral-100">{asset.name}</p>
                <p className="pt-1 text-[11px] tracking-[0.12em] text-neutral-400/80">{asset.date}</p>
              </div>
              <div className="flex items-center gap-4 text-[11px] tracking-[0.14em]">
                <span className="rounded-full border border-white/10 px-3 py-1 text-neutral-300/85">{asset.type}</span>
                <span className="text-[var(--theme-accent)]/85">{asset.clearance}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
