'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, ArrowRight } from 'lucide-react';

interface StartingAnimationProps {
  onFinish?: () => void;
  showSkipButton?: boolean;
}

export const StartingAnimation: React.FC<StartingAnimationProps> = ({
  onFinish,
  showSkipButton = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [isRendered, setIsRendered] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    // Attempt autoplay immediately
    if (videoRef.current) {
      videoRef.current
        .play()
        .catch(() => {
          // If browser policy blocks autoplay with audio, ensure muted and retry
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        });
    }

    // Safety fallback: if video doesn't end within 11s, automatically proceed
    const safetyTimer = setTimeout(() => {
      handleComplete();
    }, 11000);

    return () => clearTimeout(safetyTimer);
  }, []);

  const handleComplete = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      setIsRendered(false);
      if (onFinish) onFinish();
    }, 500); // 500ms smooth fade-out
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  if (!isRendered) return null;

  return (
    <div
      role="dialog"
      aria-label="Mess Mate Startup Animation"
      onClick={() => {
        // Unmute on first screen tap if currently muted
        if (isMuted && videoRef.current) {
          videoRef.current.muted = false;
          setIsMuted(false);
        }
      }}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between p-4 sm:p-6 select-none bg-[#FBF9F4] transition-all duration-500 ease-out font-sans ${
        isExiting ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Top Controls: Sound toggle & Skip button */}
      <div className="w-full max-w-md flex items-center justify-between z-20 pt-2">
        {/* Sound Toggle Button */}
        <button
          type="button"
          onClick={toggleSound}
          title={isMuted ? 'Unmute video audio' : 'Mute audio'}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-[#143026] text-xs font-semibold shadow-xs border border-[#A9BFB5]/30 transition-all cursor-pointer active:scale-95 backdrop-blur-xs"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-[11px] text-gray-600">Tap for Sound</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#1B5E4A] animate-pulse" />
              <span className="text-[11px] text-[#1B5E4A] font-bold">Sound On</span>
            </>
          )}
        </button>

        {/* Skip Button */}
        {showSkipButton && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleComplete();
            }}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#143026] hover:text-[#004534] bg-white/80 hover:bg-white border border-[#A9BFB5]/30 px-3.5 py-1.5 rounded-full shadow-xs transition-all cursor-pointer active:scale-95 backdrop-blur-xs"
          >
            <span>Skip</span>
            <ArrowRight className="w-3 h-3 text-[#1B5E4A]" />
          </button>
        )}
      </div>

      {/* Center Video Container Box */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto w-full max-w-sm sm:max-w-md">
        <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(20,48,38,0.08)] bg-white border border-[#A9BFB5]/20 flex items-center justify-center">
          <video
            ref={videoRef}
            src="/animation1.mp4"
            autoPlay
            muted={isMuted}
            playsInline
            onEnded={handleComplete}
            onError={handleComplete}
            className="w-full h-full object-contain bg-white"
          />
        </div>
      </div>

      {/* Spacer to keep video perfectly centered */}
      <div className="w-full max-w-xs h-6 z-10" />
    </div>
  );
};
