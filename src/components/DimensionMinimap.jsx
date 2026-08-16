import React from 'react';
import { audioEngine } from '../audio/SyntheticAudioEngine';

const DIMENSIONS = [
  { index: 0, label: '01 // ORIGIN CORE' },
  { index: 1, label: '02 // GIMBAL MATRIX' },
  { index: 2, label: '03 // QUANTUM DUST' },
  { index: 3, label: '04 // ORBITAL EPICYCLE' },
  { index: 4, label: '05 // OBSIDIAN FLUID' },
  { index: 5, label: '06 // DATA SCHEMATIC' },
  { index: 6, label: '07 // SINGULARITY' },
];

export function DimensionMinimap({ activeSectionIndex, onNavigate }) {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-30 pointer-events-auto hidden md:flex flex-col items-end gap-3.5">
      {DIMENSIONS.map((dim) => {
        const isActive = activeSectionIndex === dim.index;
        return (
          <button
            key={dim.index}
            onClick={() => {
              audioEngine.playClick();
              onNavigate(dim.index);
            }}
            onMouseEnter={() => audioEngine.playHover()}
            className="group flex items-center gap-3 py-1 outline-none"
          >
            {/* Tooltip Label */}
            <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 bg-[#0c0c14]/90 px-2 py-0.5 rounded border border-white/10 backdrop-blur-md shadow-md">
              {dim.label}
            </span>

            {/* Minimap Indicator Bar */}
            <div
              className={`transition-all duration-300 rounded-full ${
                isActive
                  ? 'w-1 h-7 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]'
                  : 'w-1 h-2.5 bg-white/20 group-hover:bg-white/60 group-hover:h-4'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
