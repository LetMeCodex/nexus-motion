import React from 'react';
import { Compass, Globe, Thermometer, Droplet, Building2, Zap, AlertTriangle, Share2 } from 'lucide-react';

export function ScientificHUD({ activeSectionIndex }) {
  const plateTitles = [
    { title: 'PLATE 00 // GLOBAL EQUILIBRIUM', icon: Globe, metric: 'T_eq 15.0°C' },
    { title: 'PLATE 01 // HADLEY CIRCULATION', icon: Thermometer, metric: 'ΔT +1.4°C' },
    { title: 'PLATE 02 // HYDROLOGICAL LOOP', icon: Droplet, metric: 'Flux 505k km³' },
    { title: 'PLATE 03 // URBAN HEAT ISLAND', icon: Building2, metric: 'UHI +4.1°C' },
    { title: 'PLATE 04 // METABOLIC LIFELINES', icon: Zap, metric: '5 Layers' },
    { title: 'PLATE 05 // COMPOUND MULTI-HAZARD', icon: AlertTriangle, metric: 'Stress 50%' },
    { title: 'PLATE 06 // SYSTEMS CAUSALITY', icon: Share2, metric: '5 Feedback' },
    { title: 'PLATE 07 // PLANETARY SYNTHESIS', icon: Compass, metric: 'Equilibrium' },
  ];

  const current = plateTitles[activeSectionIndex] || plateTitles[0];
  const Icon = current.icon;

  return (
    <div className="fixed bottom-6 left-6 z-30 pointer-events-none hidden md:block">
      <div className="museum-card w-72">
        <div className="museum-card-inner p-3.5 flex flex-col gap-2.5">
          <div className="flex items-center justify-between border-b border-[rgba(245,242,234,0.08)] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d9532f] animate-pulse" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#f5f2ea] font-semibold">
                SCIENTIFIC TELEMETRY
              </span>
            </div>
            <span className="font-mono text-[9px] text-[#647087]">
              PLATE {String(activeSectionIndex).padStart(2, '0')} / 07
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-[#a6b0c2]">
              <Icon className="w-3.5 h-3.5 text-[#d9532f] shrink-0" />
              <span className="truncate text-[10px] font-medium text-[#f5f2ea]">
                {current.title}
              </span>
            </div>
            <span className="text-[10px] font-bold text-[#d9532f] ml-1">{current.metric}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
