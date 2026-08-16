import React from 'react';
import { Activity, Radio, Cpu, Compass } from 'lucide-react';

export function TelemetryHUD({ scrollProgress, scrollVelocity, activeSectionIndex }) {
  const dimensionNames = [
    'ORIGIN // TITANIUM CORE',
    'GIMBAL // QUARTZ MATRIX',
    'PARTICLES // 40K DISPERSION',
    'ORBITAL // CELESTIAL MECHANICS',
    'FLUID // VISCOUS SURFACE',
    'DATA // SCHEMATIC RESTRUCTURE',
    'SINGULARITY // ACCRETION',
  ];

  const entropy = ((1.0 - Math.abs(scrollProgress - 0.5) * 2) * 98.4 + 1.2).toFixed(1);
  const curvature = (1.0 + scrollProgress * 2.85).toFixed(2);
  const flux = (72.0 + Math.abs(scrollVelocity) * 0.05).toFixed(1);

  return (
    <div className="fixed bottom-6 left-6 z-30 pointer-events-none hidden md:block">
      <div className="double-bezel w-72">
        <div className="double-bezel-inner p-3.5 flex flex-col gap-2.5">
          {/* Header & Status Indicator */}
          <div className="flex items-center justify-between border-b border-white/8 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-300 font-semibold">
                SYSTEM TELEMETRY
              </span>
            </div>
            <span className="font-mono text-[9px] text-neutral-400">
              DEPTH {((scrollProgress * 100).toFixed(0)).padStart(3, '0')}%
            </span>
          </div>

          {/* Active Dimension Layer */}
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-300">
            <Compass className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="truncate text-[10px] font-medium text-slate-200">
              {dimensionNames[activeSectionIndex] || dimensionNames[0]}
            </span>
          </div>

          {/* Live System Metrics Grid */}
          <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-white/5 font-mono text-[10px]">
            <div className="flex flex-col bg-white/[0.02] p-1.5 rounded border border-white/5">
              <span className="text-[7.5px] text-neutral-400 uppercase tracking-wider">Curvature</span>
              <span className="text-slate-200 font-medium">{curvature}κ</span>
            </div>
            <div className="flex flex-col bg-white/[0.02] p-1.5 rounded border border-white/5">
              <span className="text-[7.5px] text-neutral-400 uppercase tracking-wider">Entropy</span>
              <span className="text-amber-200/90 font-medium">{entropy}%</span>
            </div>
            <div className="flex flex-col bg-white/[0.02] p-1.5 rounded border border-white/5">
              <span className="text-[7.5px] text-neutral-400 uppercase tracking-wider">Flux</span>
              <span className="text-slate-200 font-medium">{flux} MHz</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
