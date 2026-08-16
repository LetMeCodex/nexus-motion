import React from 'react';
import { audioEngine } from '../audio/SyntheticAudioEngine';

const PLATES = [
  { index: 0, label: '00 // ATLAS GLOBE' },
  { index: 1, label: '01 // HEAT ENGINE' },
  { index: 2, label: '02 // WATER LOOP' },
  { index: 3, label: '03 // URBAN HEAT' },
  { index: 4, label: '04 // LIFELINES' },
  { index: 5, label: '05 // MULTI-HAZARD' },
  { index: 6, label: '06 // CONNECTIONS' },
  { index: 7, label: '07 // SYNTHESIS' },
];

export function AtlasMinimap({ activeSectionIndex, onNavigate }) {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-30 pointer-events-auto hidden md:flex flex-col items-end gap-2.5">
      {PLATES.map((plate) => {
        const isActive = activeSectionIndex === plate.index;
        return (
          <button
            key={plate.index}
            onClick={() => {
              audioEngine.playClick();
              onNavigate(plate.index);
            }}
            onMouseEnter={() => audioEngine.playHover()}
            className="group flex items-center gap-3 py-1 outline-none"
          >
            {/* Tooltip */}
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#a6b0c2] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 bg-[#0e111a]/95 px-2 py-0.5 rounded border border-[rgba(245,242,234,0.12)] backdrop-blur-md shadow-md">
              {plate.label}
            </span>

            {/* Indicator Bar */}
            <div
              className={`transition-all duration-300 rounded-full ${
                isActive
                  ? 'w-1 h-6 bg-[#d9532f] shadow-[0_0_10px_rgba(217,83,47,0.8)]'
                  : 'w-1 h-2 bg-white/20 group-hover:bg-white/60 group-hover:h-3.5'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
