'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface StartingAnimationProps {
  onFinish?: () => void;
  durationMs?: number;
  showSkipButton?: boolean;
}

export const StartingAnimation: React.FC<StartingAnimationProps> = ({
  onFinish,
  durationMs = 2600,
  showSkipButton = true,
}) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing campus nutrition...');
  const [isExiting, setIsExiting] = useState(false);
  const [isRendered, setIsRendered] = useState(true);

  useEffect(() => {
    // Stage updates based on time
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(rawProgress);

      if (rawProgress < 30) {
        setStatusText('Loading campus mess menus...');
      } else if (rawProgress < 65) {
        setStatusText('Calibrating personalized macro goals...');
      } else if (rawProgress < 95) {
        setStatusText('Optimizing daily nutrition balance...');
      } else {
        setStatusText('Welcome to Mess Mate!');
      }

      if (elapsed >= durationMs) {
        clearInterval(interval);
        handleComplete();
      }
    }, 30);

    return () => clearInterval(interval);
  }, [durationMs]);

  const handleComplete = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsRendered(false);
      if (onFinish) onFinish();
    }, 600); // Wait for fade-out and scale transition
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!isRendered) return null;

  return (
    <div
      role="dialog"
      aria-label="Mess Mate Starting Screen"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between p-6 overflow-hidden select-none transition-all duration-700 ease-out font-sans ${isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
        }`}
      style={{
        background: 'radial-gradient(circle at center, #11382C 0%, #081B15 50%, #040E0B 100%)',
      }}
    >
      {/* Background ambient lighting effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Central glowing mint aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[500px] sm:h-[500px] rounded-full bg-[#1B5E4A]/30 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] rounded-full bg-[#AEF0D6]/15 blur-2xl" />

        {/* Floating subtle bokeh dust particles */}
        <div className="absolute top-1/4 left-1/5 w-2 h-2 rounded-full bg-[#AEF0D6]/40 blur-xs animate-ping" />
        <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-emerald-300/30 blur-xs animate-pulse" />
        <div className="absolute top-2/3 left-1/3 w-2 h-2 rounded-full bg-teal-200/20 blur-xs" />
      </div>

      {/* Top Header / Skip button */}
      <div className="w-full max-w-md flex items-center justify-between z-10 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-emerald-300 text-xs font-semibold tracking-wide shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>VIT-AP UNIVERSITY</span>
        </div>

        {showSkipButton && (
          <button
            onClick={handleSkip}
            className="text-xs font-medium text-emerald-200/70 hover:text-white px-3 py-1 rounded-full bg-white/5 hover:bg-white/15 backdrop-blur-md border border-white/10 transition-all cursor-pointer active:scale-95"
          >
            Skip &rarr;
          </button>
        )}
      </div>

      {/* Centerpiece: Animated App Logo with Pulse & Sheen */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto">
        {/* Pulsing Concentric Ripple Rings behind Logo */}
        <div className="absolute w-56 h-56 rounded-full border border-emerald-500/20 animate-ping opacity-30 pointer-events-none" />
        <div className="absolute w-72 h-72 rounded-full border border-[#AEF0D6]/15 animate-pulse opacity-40 pointer-events-none" />

        {/* Elevated Logo Container with Glass Effect and Spring Entry */}
        <div className="relative group animate-logo-entrance">
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-3xl bg-gradient-to-b from-[#FAF8F2] to-[#EFEBE0] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_40px_rgba(27,94,74,0.4)] border-2 border-white/80 flex items-center justify-center overflow-hidden transition-transform duration-300">
            {/* Logo Image */}
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src="/logo-optimized.png"
                alt="Mess Mate Logo"
                width={360}
                height={252}
                priority
                className="object-contain w-full h-full drop-shadow-md select-none transform transition-transform duration-500 hover:scale-105"
              />
            </div>

            {/* Diagonal Light Sweep / Sheen Animation across logo */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-25 animate-logo-sheen" />
            </div>
          </div>

          {/* Under-glow halo */}
          <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 via-[#AEF0D6]/20 to-teal-500/20 rounded-3xl blur-xl -z-10 opacity-75" />
        </div>

        {/* Brand Name with Staggered Reveal */}
        <div className="mt-8 text-center space-y-1.5 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-[#E1F7EC] to-[#AEF0D6] bg-clip-text text-transparent drop-shadow-sm font-sans">
            Mess Mate
          </h1>
          <p className="text-xs sm:text-sm font-medium text-emerald-200/80 tracking-wide uppercase">
            Intelligent Campus Nutrition
          </p>
        </div>
      </div>

      {/* Bottom: Progress Bar & Dynamic Status Pill */}
      <div className="w-full max-w-xs sm:max-w-sm flex flex-col items-center space-y-3 z-10 pb-4">
        {/* Status Message Pill */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-medium text-emerald-100 transition-all duration-300">
            {statusText}
          </span>
        </div>

        {/* Smooth Emerald Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-white/10 backdrop-blur-sm overflow-hidden p-[1px] border border-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-[#AEF0D6] to-teal-300 transition-all duration-100 ease-out shadow-[0_0_12px_rgba(174,240,214,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Micro Tagline */}
        <span className="text-[10px] text-emerald-400/60 font-medium tracking-wider uppercase">
          Smart Dining • Biomarker Tracking • Peak Health
        </span>
      </div>
    </div>
  );
};
