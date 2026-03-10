"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const GOLD = "212, 175, 55";
const HOLD_MS = 2200;
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export function HeroIgnition() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const renderRafRef = useRef<number | null>(null);
  const fadeRef = useRef<number | null>(null);
  const holdTimerRef = useRef<number | null>(null);
  const holdRafRef = useRef<number | null>(null);
  const holdStartRef = useRef<number | null>(null);
  const enteredRef = useRef(false);
  const chargedRef = useRef(false);
  const committedRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const initializedRef = useRef(false);
  const visualizerOnRef = useRef(false);
  const resizeHandlerRef = useRef<(() => void) | null>(null);

  const [visualizerOn, setVisualizerOn] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [holdRatio, setHoldRatio] = useState(0);
  const [isEntering, setIsEntering] = useState(false);

  useEffect(() => {
    visualizerOnRef.current = visualizerOn;
  }, [visualizerOn]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (!committedRef.current) return;
      setVisualizerOn(false);
      setPressed(false);
      setIsEntering(true);
      window.setTimeout(() => {
        window.sessionStorage.setItem("vault-enter-transition", "1");
        router.push("/archives");
      }, 1100);
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [router]);

  const initializeVisualizer = async () => {
    const audio = audioRef.current;
    const canvas = canvasRef.current;
    if (!audio || !canvas) return;
  
    if (!initializedRef.current) {
      const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextCtor) return;
      const ctx = new AudioContextCtor();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.85;
      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      audioContextRef.current = ctx;
      analyserRef.current = analyser;
      sourceRef.current = source;
      initializedRef.current = true;
    }
  
    const currentAudioContext = audioContextRef.current;
    if (currentAudioContext && currentAudioContext.state === "suspended") {
      await currentAudioContext.resume();
    }
  
    const ctx = canvas.getContext("2d");
    if (!ctx || !analyserRef.current) return;
  
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const smoothDataArray = new Float32Array(bufferLength);
  
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
  
    const renderFrame = () => {
      renderRafRef.current = requestAnimationFrame(renderFrame);
      if (!analyserRef.current) return;
  
      // 关键：不显示时彻底清空，绝不叠加任何黑色
      if (!visualizerOnRef.current) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
  
      analyserRef.current.getByteFrequencyData(dataArray);
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const barWidth = 3;
      const gap = 10;
      const maxBarHeight = canvas.height * 0.45;
  
      ctx.fillStyle = "rgba(212, 175, 55, 0.7)";
      ctx.shadowBlur = 30;
      ctx.shadowColor = "rgba(212, 175, 55, 0.9)";
  
      for (let i = 0; i < bufferLength / 2; i += 1) {
        const targetValue = (dataArray[i] / 255) * maxBarHeight;
        smoothDataArray[i] += (targetValue - smoothDataArray[i]) * 0.15;
        const barHeight = smoothDataArray[i];
        if (barHeight > 5) {
          const xRight = centerX + i * (barWidth + gap) + 120;
          ctx.fillRect(xRight, centerY - barHeight / 2, barWidth, barHeight);
          const xLeft = centerX - i * (barWidth + gap) - 120 - barWidth;
          ctx.fillRect(xLeft, centerY - barHeight / 2, barWidth, barHeight);
        }
      }
      ctx.shadowBlur = 0;
    };
  
    if (renderRafRef.current) cancelAnimationFrame(renderRafRef.current);
    renderFrame();
  
    if (resizeHandlerRef.current) window.removeEventListener("resize", resizeHandlerRef.current);
    resizeHandlerRef.current = resizeCanvas;
    window.addEventListener("resize", resizeCanvas);
  };

  useEffect(() => {
    return () => {
      if (renderRafRef.current) cancelAnimationFrame(renderRafRef.current);
      if (fadeRef.current) cancelAnimationFrame(fadeRef.current);
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      if (holdRafRef.current) cancelAnimationFrame(holdRafRef.current);
      if (resizeHandlerRef.current) window.removeEventListener("resize", resizeHandlerRef.current);
      void audioContextRef.current?.close();
    };
  }, []);

  const fadeOutAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const startVolume = audio.volume;
    const start = performance.now();
    const duration = 500;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      audio.volume = clamp01(startVolume * (1 - t));
      if (t < 1) {
        fadeRef.current = requestAnimationFrame(tick);
      } else {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 1;
      }
    };

    if (fadeRef.current) cancelAnimationFrame(fadeRef.current);
    fadeRef.current = requestAnimationFrame(tick);
  };

  const runHoldProgress = () => {
    const start = holdStartRef.current ?? performance.now();
    holdStartRef.current = start;
    const elapsed = performance.now() - start;
    setHoldRatio(clamp01(elapsed / HOLD_MS));
    if (elapsed < HOLD_MS && !enteredRef.current) {
      holdRafRef.current = requestAnimationFrame(runHoldProgress);
    }
  };

  const completeCharge = () => {
    chargedRef.current = true;
    setHoldRatio(1);
  };

  const resetHold = () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (holdRafRef.current) cancelAnimationFrame(holdRafRef.current);
    holdTimerRef.current = null;
    holdRafRef.current = null;
    holdStartRef.current = null;
    chargedRef.current = false;
    setHoldRatio(0);
  };

  const onPressStart = async () => {
    if (enteredRef.current || committedRef.current) return;
    await initializeVisualizer();
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeRef.current) cancelAnimationFrame(fadeRef.current);
    audio.currentTime = 0;
    audio.volume = clamp01(1);
    void audio.play();
    setPressed(true);
    setVisualizerOn(true);
    holdStartRef.current = performance.now();
    holdRafRef.current = requestAnimationFrame(runHoldProgress);
    holdTimerRef.current = window.setTimeout(() => {
      completeCharge();
    }, HOLD_MS);
  };

  const onPressEnd = () => {
    if (enteredRef.current || committedRef.current) return;
    setPressed(false);
    if (chargedRef.current) {
      committedRef.current = true;
      enteredRef.current = true;
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      if (holdRafRef.current) cancelAnimationFrame(holdRafRef.current);
      holdTimerRef.current = null;
      holdRafRef.current = null;
      holdStartRef.current = null;
      return;
    }

    setVisualizerOn(false);
    resetHold();
    fadeOutAudio();
  };

  return (
    <>
    {/* 标题在 section 完全外部，不受任何 stacking context 影响 */}
    <div
      className="pointer-events-none fixed inset-x-0 top-[8%] flex flex-col items-center px-6 text-center"
      style={{ zIndex: 9999 }}
    >
      <h1 className="font-editorial bg-gradient-to-b from-[#f2dd9d] to-[#d4af37] bg-clip-text pt-2 text-5xl italic text-transparent drop-shadow-[0_8px_24px_rgba(0,0,0,0.55)] md:text-7xl">
        Welcome back to Maverick&apos;s Blog
      </h1>
      <p className="pt-4 text-[11px] tracking-[0.18em] text-[#d8c27a]/85">
        Press and hold to ignite.
      </p>
    </div>

    <motion.section
      animate={{
        opacity: isEntering ? 0 : 1,
        scale: isEntering ? 1.015 : 1,
        filter: isEntering ? "blur(2px)" : "blur(0px)",
      }}
      transition={{ duration: 0.88, ease: [0.18, 0.78, 0.1, 1] }}
      className="relative isolate h-screen w-full overflow-x-hidden"
    >
      <audio ref={audioRef} src="/audio/sound-engine.mp3" preload="auto" className="hidden" />

      {/* 背景 */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black to-[#0a0a0a]" />
      <Image
        src="/images/background_1023x1087.webp"
        alt="Aston background"
        fill
        priority
        className="z-0 object-cover opacity-65"
      />

      {/* 音频可视化画布 */}
      <motion.canvas
        ref={canvasRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: visualizerOn ? 1 : 0 }}
        transition={{ duration: 0.45, ease: [0.18, 0.78, 0.1, 1] }}
        className="pointer-events-none absolute inset-0 z-10 h-full w-full"
      />

      {/* 车图 */}
      <div className="absolute inset-x-0 bottom-[20%] z-20 flex justify-center px-6">
        <motion.div
          animate={{
            opacity: isEntering ? 0 : 1,
            y: isEntering ? 24 : 0,
            scale: isEntering ? 0.985 : 1,
          }}
          transition={{ duration: 1.05, ease: [0.18, 0.78, 0.1, 1] }}
          className="relative flex justify-center"
        >
          <div className="pointer-events-none absolute bottom-[9%] h-24 w-[min(60vw,520px)] rounded-[999px] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.55),rgba(0,0,0,0))] blur-xl" />
          <Image
            src="/images/20220901_Vantage_V12_668_Mobil.webp"
            alt="Aston Martin V12 Vantage"
            width={980}
            height={520}
            priority
            className="h-auto w-[min(72vw,560px)] object-contain drop-shadow-[0_16px_28px_rgba(0,0,0,0.5)] md:w-[min(54vw,620px)]"
          />
        </motion.div>
      </div>

      {/* 按钮 */}
      <div className="absolute inset-x-0 bottom-[17%] z-30 flex flex-col items-center gap-4">
        <motion.button
          type="button"
          onPointerDown={() => {
            void onPressStart();
          }}
          onPointerUp={onPressEnd}
          onPointerCancel={onPressEnd}
          whileTap={{ scale: 0.95 }}
          animate={{
            scale: pressed ? 0.95 : 1,
            boxShadow: pressed
              ? `0 0 0 1px rgba(${GOLD},0.65), 0 0 30px rgba(${GOLD},0.32)`
              : `0 0 0 1px rgba(${GOLD},0.35), 0 0 14px rgba(${GOLD},0.2)`,
          }}
          transition={{ duration: 0.5, ease: [0.18, 0.78, 0.1, 1] }}
          className="glass-panel relative h-24 w-24 rounded-full border border-[rgba(212,175,55,0.35)]"
        >
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="46" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" fill="none" />
            <circle
              cx="50"
              cy="50"
              r="46"
              stroke={`rgba(${GOLD},0.88)`}
              strokeWidth="1.9"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={289}
              strokeDashoffset={289 * (1 - holdRatio)}
            />
          </svg>
          <span className="meta-text relative z-10 text-[9px] text-neutral-200/90">LOGIN</span>
        </motion.button>
      </div>

      

    </motion.section>
    </>
  );
}
