"use client";

import Link from "next/link";
import { animate, motion, useMotionValue, useMotionValueEvent } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const sectors = [
  {
    id: "01",
    title: "Academic Ledger",
    href: "/sector/academic-ledger",
    note: "Coursework, structured notes, and curated knowledge trails.",
    entries: "12 Notes",
    tracks: "2 Live Courses",
    revised: "03.10.2026",
  },
  {
    id: "02",
    title: "The Technical Matrix",
    href: "/sector/technical-matrix",
    note: "Architecture journals, implementation memos, and system blueprints.",
    entries: "18 Entries",
    tracks: "4 Active Tracks",
    revised: "03.08.2026",
  },
  {
    id: "03",
    title: "Research Pipeline",
    href: "/sector/research-pipeline",
    note: "Protocols, experiments, datasets, and emerging lines of inquiry.",
    entries: "9 Entries",
    tracks: "3 Open Lines",
    revised: "03.06.2026",
  },
  {
    id: "04",
    title: "Private Chronicle",
    href: "/sector/private-chronicle",
    note: "Personal records, reflections, and the quiet rhythm of daily life.",
    entries: "24 Records",
    tracks: "Daily Index",
    revised: "03.09.2026",
  },
] as const;

const spring = {
  type: "spring",
  mass: 5,
  damping: 40,
  stiffness: 100,
} as const;

export function VaultCarousel() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [maxDrag, setMaxDrag] = useState(0);
  const [snapPoints, setSnapPoints] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const wheelSnapTimeout = useRef<number | null>(null);
  const x = useMotionValue(0);

  const snapToIndex = (index: number) => {
    const safeIndex = Math.max(0, Math.min(index, snapPoints.length - 1));
    const target = snapPoints[safeIndex] ?? 0;
    setActiveIndex(safeIndex);
    animate(x, target, spring);
  };

  const getNearestIndex = (value: number) => {
    if (snapPoints.length === 0) return 0;
    return snapPoints.reduce(
      (closest, point, index) =>
        Math.abs(point - value) < Math.abs(snapPoints[closest] - value) ? index : closest,
      0,
    );
  };

  useLayoutEffect(() => {
    const update = () => {
      if (!wrapperRef.current || !trackRef.current) return;
      const nextMax = Math.max(0, trackRef.current.scrollWidth - wrapperRef.current.clientWidth);
      const cards = Array.from(trackRef.current.children) as HTMLDivElement[];
      const nextSnapPoints = cards.map((card) => {
        const centered = -(card.offsetLeft - (wrapperRef.current!.clientWidth - card.clientWidth) / 2);
        return Math.max(-nextMax, Math.min(0, centered));
      });

      setMaxDrag(nextMax);
      setSnapPoints(nextSnapPoints);

      const nextIndex =
        nextSnapPoints.length === 0
          ? 0
          : nextSnapPoints.reduce(
              (closest, point, index) =>
                Math.abs(point - x.get()) < Math.abs(nextSnapPoints[closest] - x.get()) ? index : closest,
              0,
            );

      setActiveIndex(nextIndex);
      x.set(nextSnapPoints[nextIndex] ?? Math.max(-nextMax, Math.min(0, x.get())));
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [x]);

  useMotionValueEvent(x, "change", (latest) => {
    if (snapPoints.length === 0) return;
    setActiveIndex(getNearestIndex(latest));
  });

  useEffect(() => {
    return () => {
      if (wheelSnapTimeout.current) {
        window.clearTimeout(wheelSnapTimeout.current);
      }
    };
  }, []);

  return (
    <section className="relative left-1/2 h-[calc(100vh-9rem)] w-screen -translate-x-1/2 overflow-hidden overscroll-x-none">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-black/45" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[38%] bg-[radial-gradient(circle_at_center,rgba(0,96,57,0.14),transparent_48%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[24vh] bg-gradient-to-t from-black/55 via-black/20 to-transparent" />

      <div className="mx-auto flex h-full w-full max-w-[100vw] flex-col px-6 pb-10 pt-6 md:px-10">
        <div className="relative z-30 space-y-3">
          <p className="meta-text text-[11px]">Vault Main Hall</p>
          <h1 className="font-editorial text-4xl italic text-[#f1ead7] md:text-5xl">Primary Navigation Gallery</h1>
          <p className="max-w-2xl text-sm tracking-[0.08em] text-neutral-300/72">
            Drag horizontally to explore the four principal sectors of the Archive.
          </p>
        </div>

        <div
          ref={wrapperRef}
          onWheel={(event) => {
            const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
            if (!delta || maxDrag === 0) return;
            event.preventDefault();
            const next = Math.max(-maxDrag, Math.min(0, x.get() - delta));
            x.set(next);

            if (wheelSnapTimeout.current) {
              window.clearTimeout(wheelSnapTimeout.current);
            }

            wheelSnapTimeout.current = window.setTimeout(() => {
              snapToIndex(getNearestIndex(x.get()));
            }, 140);
          }}
          className="hide-scrollbar relative mt-14 flex-1 overflow-visible overscroll-x-contain py-20 touch-pan-y md:mt-16"
          style={{ overscrollBehaviorX: "contain" }}
        >
          <div className="pointer-events-none absolute inset-x-0 top-1/2 z-0 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="pointer-events-none absolute left-1/2 top-[34%] z-0 h-[34vh] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#d4af37]/24 to-transparent" />
          <div className="pointer-events-none absolute left-1/2 top-[30%] z-[6] h-[42vh] w-[min(34vw,460px)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,244,214,0.08),rgba(0,96,57,0.06)_42%,transparent_72%)] blur-3xl" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[12] h-[16vh] bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

          <motion.div
            ref={trackRef}
            drag="x"
            dragMomentum={false}
            dragConstraints={{ left: -maxDrag, right: 0 }}
            dragElastic={0.02}
            onDragStart={() => {
              if (wheelSnapTimeout.current) {
                window.clearTimeout(wheelSnapTimeout.current);
              }
            }}
            onDragEnd={() => snapToIndex(getNearestIndex(x.get()))}
            style={{ x }}
            className="relative z-20 flex h-full translate-y-[2vh] cursor-grab items-center gap-6 px-[34vw] pb-[1vh] active:cursor-grabbing md:translate-y-[3vh] md:gap-8 md:px-[36vw]"
          >
            {sectors.map((sector, index) => (
              <motion.div
                key={sector.id}
                whileHover={{
                  borderColor: "rgba(212, 175, 55, 0.32)",
                  boxShadow: "0 26px 72px rgba(0,0,0,0.44), 0 0 24px rgba(212,175,55,0.05)",
                }}
                onMouseEnter={() => snapToIndex(index)}
                animate={{
                  scale: activeIndex === index ? 1.035 : 0.92,
                  opacity: activeIndex === index ? 1 : 0.56,
                  y: activeIndex === index ? -8 : 10,
                  filter: activeIndex === index ? "saturate(1.04) brightness(1.03)" : "saturate(0.78) brightness(0.82)",
                }}
                transition={spring}
                className={`relative h-[46vh] w-[min(24rem,26vw)] shrink-0 overflow-hidden rounded-[2.15rem] border-x border-white/10 border-b border-t border-white/10 bg-[#060708]/66 backdrop-blur-[30px] ${
                  activeIndex === index ? "z-50" : "z-10"
                }`}
              >
                <Link href={sector.href} className="flex h-full w-full flex-col p-6 md:p-7">
                  <div className="absolute inset-0 bg-[linear-gradient(165deg,rgba(255,255,255,0.025),rgba(10,10,10,0.02),rgba(212,175,55,0.035))]" />
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/12 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/12 to-transparent" />
                  <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#006039]/65 to-transparent" />
                  <div className="pointer-events-none absolute right-[-16%] top-[22%] h-28 w-28 rounded-full bg-[#006039]/10 blur-3xl" />
                  {activeIndex === index ? (
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,244,214,0.11),transparent_44%)]" />
                  ) : null}
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,96,57,0.04),transparent_24%,transparent_76%,rgba(212,175,55,0.03))]" />

                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <span className="font-editorial text-[7rem] italic leading-none text-[#d4af37]/[0.12] drop-shadow-[0_0_18px_rgba(212,175,55,0.05)] md:text-[8.5rem]">
                      {sector.id}
                    </span>
                  </div>

                  <div className="relative z-10 space-y-3">
                    <p className="meta-text text-[10px] text-[#b6ae9d]/82">Sector {sector.id}</p>
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-[#9f998e]/72">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#006039] shadow-[0_0_12px_rgba(0,96,57,0.85)]" />
                      <span>Last Modified {sector.revised}</span>
                    </div>
                  </div>

                  <div className="relative z-10 flex flex-1 flex-col justify-center space-y-5">
                    <h2
                      className={`font-editorial text-[2rem] font-semibold italic leading-tight md:text-[2.2rem] ${
                        activeIndex === index ? "text-[#f4ead0]" : "text-[#d8d0c2]"
                      }`}
                    >
                      {sector.title}
                    </h2>
                    <p
                      className={`max-w-[17rem] text-[13px] leading-7 tracking-[0.11em] ${
                        activeIndex === index ? "text-[#d6d0c3]/86" : "text-[#aaa294]/74"
                      }`}
                    >
                      {sector.note}
                    </p>
                    <span
                      className={`inline-flex text-[10px] uppercase tracking-[0.28em] ${
                        activeIndex === index ? "text-[#d4af37]/92" : "text-[#8f8779]/78"
                      }`}
                    >
                      Private Compartment
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
