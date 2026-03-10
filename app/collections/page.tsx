import { themeOptions } from "@/lib/themes";

export const metadata = {
  title: "Curated Collections",
  description: "Expanded partitions and editorial collections for old-money lifestyle archiving.",
};

const collectionCards = [
  { name: "Sartorial Ledger", detail: "高定西装版型、面料、搭配日志", tag: "Style" },
  { name: "Alpine Diary", detail: "滑雪度假路线、酒店、装备与照片", tag: "Travel" },
  { name: "Grand Touring Notes", detail: "跑车观感、试驾、保养与调校记录", tag: "Automotive" },
  { name: "Private Protocols", detail: "日程仪式、健身、阅读、饮食策略", tag: "Lifestyle" },
];

export default function CollectionsPage() {
  return (
    <section className="mx-auto w-full max-w-6xl space-y-8 pb-16">
      <div className="space-y-4">
        <p className="meta-text text-[11px]">Curated Collections · Expanded Partitions</p>
        <h1 className="font-editorial text-5xl italic text-neutral-100 md:text-6xl">House of Collections</h1>
        <p className="max-w-3xl text-sm leading-8 tracking-[0.08em] text-neutral-200/80">
          在核心四大板块之外，建立更精细的生活分区与主题档案，形成可长期沉淀的个人知识与风格资产库。
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {collectionCards.map((card) => (
          <article key={card.name} className="glass-panel rounded-3xl p-6 md:p-8">
            <p className="meta-text text-[10px]">{card.tag}</p>
            <h2 className="font-editorial pt-4 text-3xl italic text-neutral-100">{card.name}</h2>
            <p className="pt-3 text-sm leading-7 tracking-[0.06em] text-neutral-300/85">{card.detail}</p>
          </article>
        ))}
      </div>

      <div className="glass-panel rounded-3xl p-6 md:p-8">
        <p className="meta-text text-[10px]">Theme Sources</p>
        <div className="pt-4 space-y-2 text-sm tracking-[0.06em] text-neutral-300/85">
          {themeOptions.map((theme) => (
            <p key={theme.id}>
              {theme.label}:{" "}
              <a href={theme.sourceUrl} target="_blank" rel="noreferrer" className="text-[var(--theme-accent)]/90">
                reference
              </a>
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
