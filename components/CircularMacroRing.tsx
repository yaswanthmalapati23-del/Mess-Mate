'use client';

import React from 'react';

interface CircularMacroRingProps {
  calorieTarget: number;
  calorieConsumed: number;
  proteinTarget: number;
  proteinConsumed: number;
  carbsTarget: number;
  carbsConsumed: number;
  isDark?: boolean;
}

export const CircularMacroRing: React.FC<CircularMacroRingProps> = ({
  calorieTarget,
  calorieConsumed,
  proteinTarget,
  proteinConsumed,
  carbsTarget,
  carbsConsumed,
  isDark = false,
}) => {
  const size = 200;
  const strokeWidth = 10;
  const center = size / 2;

  // Radii for concentric rings
  const radiusCal = center - strokeWidth - 4; // ~86
  const radiusProt = radiusCal - strokeWidth - 6; // ~70
  const radiusCarb = radiusProt - strokeWidth - 6; // ~54

  const circCal = 2 * Math.PI * radiusCal;
  const circProt = 2 * Math.PI * radiusProt;
  const circCarb = 2 * Math.PI * radiusCarb;

  const calProgress = Math.min(1.0, Math.max(0, calorieConsumed / Math.max(1, calorieTarget)));
  const protProgress = Math.min(1.0, Math.max(0, proteinConsumed / Math.max(1, proteinTarget)));
  const carbProgress = Math.min(1.0, Math.max(0, carbsConsumed / Math.max(1, carbsTarget)));

  const offsetCal = circCal - calProgress * circCal;
  const offsetProt = circProt - protProgress * circProt;
  const offsetCarb = circCarb - carbProgress * circCarb;

  const remainingKcal = Math.max(0, calorieTarget - calorieConsumed);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            {/* Orange Gradient for Calories */}
            <linearGradient id="terracottaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#E04F16" />
            </linearGradient>
            {/* Blue Gradient for Protein */}
            <linearGradient id="saffronGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
            {/* Amber Gradient for Carbs */}
            <linearGradient id="oliveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          {/* Background Track Rings */}
          <circle
            cx={center}
            cy={center}
            r={radiusCal}
            stroke={isDark ? '#1C2129' : '#F1F5F9'}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={center}
            cy={center}
            r={radiusProt}
            stroke={isDark ? '#1C2129' : '#F1F5F9'}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={center}
            cy={center}
            r={radiusCarb}
            stroke={isDark ? '#1C2129' : '#F1F5F9'}
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Active Progress Rings */}
          <circle
            cx={center}
            cy={center}
            r={radiusCal}
            stroke="url(#terracottaGrad)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circCal}
            strokeDashoffset={offsetCal}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
          <circle
            cx={center}
            cy={center}
            r={radiusProt}
            stroke="url(#saffronGrad)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circProt}
            strokeDashoffset={offsetProt}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
          <circle
            cx={center}
            cy={center}
            r={radiusCarb}
            stroke="url(#oliveGrad)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circCarb}
            strokeDashoffset={offsetCarb}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Typography */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
          <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
            {remainingKcal > 0 ? 'Remaining' : 'Target Met'}
          </span>
          <span className="text-3xl font-extrabold tracking-tight text-gray-900 mt-0.5">
            {remainingKcal > 0 ? remainingKcal : calorieConsumed}
          </span>
          <span className="text-[11px] font-semibold text-gray-500">
            kcal of {calorieTarget}
          </span>
        </div>
      </div>

      {/* Minimalist Macro Pills underneath */}
      <div className="flex items-center space-x-4 mt-3.5 text-xs">
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E04F16] shadow-xs" />
          <span className="text-gray-500 font-medium">Energy:</span>
          <strong className="text-gray-900 font-bold">{calorieConsumed} kcal</strong>
        </div>

        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] shadow-xs" />
          <span className="text-gray-500 font-medium">Protein:</span>
          <strong className="text-gray-900 font-bold">{Math.round(proteinConsumed)}g</strong>
        </div>

        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shadow-xs" />
          <span className="text-gray-500 font-medium">Carbs:</span>
          <strong className="text-gray-900 font-bold">{Math.round(carbsConsumed)}g</strong>
        </div>
      </div>
    </div>
  );
};
