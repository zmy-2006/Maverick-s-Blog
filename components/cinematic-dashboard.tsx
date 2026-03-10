"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { MouseEvent, useMemo } from "react";

type VaultCard = {
  title: string;
  subtitle: string;
  metric: string;
};

const cards: VaultCard[] = [
  {
    title: "Daily Chronicle",
    subtitle: "Life reflections and daily fragments.",
    metric: "24 entries",
  },
  {
    title: "Research Ledger",
    subtitle: "Experiments, references, and timeline notes.",
    metric: "08 active tracks",
  },
  {
    title: "Technical Dossier",
    subtitle: "Architecture notes and deep implementation memos.",
    metric: "36 archived pages",
  },
];

const heroTransition = {
  duration: 1.6,
  ease: [0.18, 0.78, 0.1, 1],
} as const;

export function CinematicDashboard() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useMotionValue(0), { stiffness: 70, damping: 26, mass: 1.4 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 70, damping: 26, mass: 1.4 });

  const cardShine = useMotionTemplate`radial-gradient(520px circle at ${mouseX}px ${mouseY}px, rgba(212,175,55,0.14), transparent 36%)`;

  const maxTilt = useMemo(() => 4, []);

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    mouseX.set(x);
    mouseY.set(y);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const turnY = ((x - centerX) / rect.width) * maxTilt;
    const turnX = ((centerY - y) / rect.height) * maxTilt;

    rotateX.set(turnX);
    rotateY.set(turnY);
  };

  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 py-8 md:gap-16 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={heroTransition}
        className="max-w-4xl space-y-8"
      >
        <p className="meta-text text-[11px]">Private Ledger · Since 2026</p>
        <h1 className="font-editorial text-5xl font-semibold leading-[1.02] text-neutral-100 md:text-7xl lg:text-8xl">
          A Quiet Vault For
          <span className="ml-4 inline-block italic text-[#d4af37]/90">Memory, Method, Meaning.</span>
        </h1>
        <p className="max-w-2xl text-sm leading-8 tracking-[0.08em] text-neutral-200/78 md:text-base">
          Designed as a private salon for daily records, research milestones, and technical depth. Every fragment is
          archived with restraint, precision, and permanence.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...heroTransition, delay: 0.22 }}
        className="grid gap-5 md:grid-cols-3"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ perspective: 1600 }}
      >
        {cards.map((card, index) => (
          <motion.article
            key={card.title}
            className="glass-panel relative overflow-hidden rounded-3xl p-7 md:p-8"
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            whileHover={{ y: -4, transition: { duration: 0.9, ease: [0.18, 0.78, 0.1, 1] } }}
          >
            <motion.div className="pointer-events-none absolute inset-0" style={{ background: cardShine }} />
            <div className="gold-hairline pointer-events-none absolute inset-[1px] rounded-[22px]" />
            <div className="relative z-10 space-y-4">
              <p className="meta-text text-[10px]">{`Tier 0${index + 1}`}</p>
              <h2 className="font-editorial text-2xl font-medium italic text-neutral-100">{card.title}</h2>
              <p className="text-sm leading-7 tracking-[0.06em] text-neutral-300/80">{card.subtitle}</p>
              <p className="pt-4 text-xs tracking-[0.2em] text-[#d4af37]/85">{card.metric}</p>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
