import React, { useState } from 'react';
import { AlertTriangle, Flame, Wind, Droplets, Info } from 'lucide-react';
import { audioEngine } from '../audio/SyntheticAudioEngine';

export function ExtremeSection({ canvasRef }) {
  const [stress, setStress] = useState(0.5);

  const handleStressChange = (e) => {
    const val = parseFloat(e.target.value);
    setStress(val);
    if (canvasRef.current && canvasRef.current.setExtremeStress) {
      canvasRef.current.setExtremeStress(val);
    }
  };

  const getRiskStatus = (lvl) => {
    if (lvl < 0.3) {
      return { status: 'Nominal Baseline', color: '#48bb78', cascade: 'Single-event local buffer capacity intact.' };
    } else if (lvl <= 0.7) {
      return { status: 'Compound Stress Warning', color: '#ecc94b', cascade: 'Simultaneous heat dome + dry wind vectors double wildfire ignition spread risk.' };
    } else {
      return { status: 'Severe Multi-Hazard Cascade', color: '#f56565', cascade: 'Thermal power grid curtailment + desiccated topsoil flash-flood runoff failure.' };
    }
  };

  const risk = getRiskStatus(stress);

  return (
    <section
      id="section-extreme"
      className="relative min-h-[100dvh] flex flex-col justify-center px-6 md:px-16 py-28 z-10 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
        {/* Left Column: Narrative */}
        <div className="max-w-xl flex flex-col gap-5">
          <div className="scientific-pill">
            <div className="scientific-pill-dot bg-[#f56565] shadow-[0_0_6px_#f56565]" />
            <span>SECTION 05 // SYSTEM STRESS & CASCADE</span>
          </div>

          <h2 className="font-serif-editorial text-4xl sm:text-6xl text-[#f5f2ea] font-normal leading-[0.95]">
            What happens when <br />
            <span className="italic text-[#f56565]">the system is stressed?</span>
          </h2>

          <p className="font-sans text-[#a6b0c2] text-sm sm:text-base leading-relaxed">
            Extreme events rarely occur in isolation. When persistent high-pressure heat domes trap stagnant air, soil moisture depletes rapidly. High wind vectors accelerate wildfire perimeters, while baked, impermeable soil turns subsequent storms into destructive flash-flood cascades.
          </p>

          {/* Educational Disclaimer Banner */}
          <div className="p-3.5 rounded-lg border border-[rgba(245,242,234,0.1)] bg-white/[0.02] flex items-start gap-2.5 font-mono text-[11px] text-[#a6b0c2] leading-normal">
            <Info className="w-4 h-4 text-[#d9532f] shrink-0 mt-0.5" />
            <span>
              <strong>Conceptual visualization — not a forecasting model.</strong> Demonstrates multi-hazard feedback physics and cascading vulnerabilities.
            </span>
          </div>
        </div>

        {/* Right Column: Interactive Multi-Hazard Simulator */}
        <div className="museum-card max-w-md w-full pointer-events-auto">
          <div className="museum-card-inner p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-[rgba(245,242,234,0.08)] pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" style={{ color: risk.color }} />
                <span className="font-swiss text-xs font-semibold uppercase tracking-wider text-[#f5f2ea]">
                  COMPOUND HAZARD STRESS
                </span>
              </div>
              <span className="scientific-pill text-[8.5px]" style={{ color: risk.color }}>
                {risk.status}
              </span>
            </div>

            {/* Stress Slider */}
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center text-[#a6b0c2]">
                <span>SYSTEM STRESS LEVEL:</span>
                <span className="text-[#f5f2ea] font-bold">{(stress * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={stress}
                onChange={handleStressChange}
                onMouseEnter={() => audioEngine.playHover()}
                className="w-full accent-[#f56565] bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                data-cursor="hover"
              />
              <div className="flex justify-between text-[9px] text-[#647087] pt-0.5">
                <span>0% (Stable)</span>
                <span>50% (Compound)</span>
                <span>100% (Cascade Failure)</span>
              </div>
            </div>

            {/* Cascade Breakdown */}
            <div className="p-3.5 rounded-lg bg-white/[0.02] border border-[rgba(245,242,234,0.08)] font-sans text-xs text-[#a6b0c2] leading-relaxed">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#f5f2ea] font-semibold block mb-1">
                Compound Risk Mechanism:
              </span>
              {risk.cascade}
            </div>

            {/* Multi-hazard factors */}
            <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-[#a6b0c2] pt-2 border-t border-[rgba(245,242,234,0.06)]">
              <div className="flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-[#a6b0c2]" />
                <span>{((stress * 90) + 10).toFixed(0)} km/h Wind</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#f56565]" />
                <span>{((stress * 80) + 15).toFixed(0)}% Fire</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-[#4299e1]" />
                <span>{((1.0 - stress) * 60 + 10).toFixed(0)}% Soil</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
