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
        // Unmute on screen tap if currently muted
        if (isMuted && videoRef.current) {
          videoRef.current.muted = false;
          setIsMuted(false);
        }
      }}
      className={`fixed inset-0 z-[9999] bg-white select-none transition-all duration-500 ease-out font-sans overflow-hidden flex items-center justify-center ${
        isExiting ? 'opacity-0 scale-98 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Floating Top Controls: Sound toggle & Skip button */}
      <div className="absolute top-4 inset-x-4 max-w-5xl mx-auto flex items-center justify-between z-30 pointer-events-auto">
        {/* Sound Toggle Button */}
        <button
          type="button"
          onClick={toggleSound}
          title={isMuted ? 'Unmute video audio' : 'Mute audio'}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 hover:bg-black/10 text-[#143026] text-xs font-semibold shadow-2xs border border-[#A9BFB5]/30 transition-all cursor-pointer active:scale-95 backdrop-blur-xs"
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
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#143026] hover:text-[#004534] bg-black/5 hover:bg-black/10 border border-[#A9BFB5]/30 px-3.5 py-1.5 rounded-full shadow-2xs transition-all cursor-pointer active:scale-95 backdrop-blur-xs"
          >
            <span>Skip</span>
            <ArrowRight className="w-3 h-3 text-[#1B5E4A]" />
          </button>
        )}
      </div>

      {/* Fullscreen Centered Video */}
      <div className="w-full h-full flex items-center justify-center">
        <video
          ref={videoRef}
          src="/animation1.mp4"
          autoPlay
          muted={isMuted}
          playsInline
          onEnded={handleComplete}
          onError={handleComplete}
          className="w-full h-full max-w-4xl max-h-screen object-contain bg-white"
        />
      </div>
    </div>
  );
};
