import React, { useState } from 'react';
import { Sun, Thermometer, Wind, AlertCircle } from 'lucide-react';
import { audioEngine } from '../audio/SyntheticAudioEngine';

export function HeatSection({ canvasRef }) {
  const [tempAnomaly, setTempAnomaly] = useState(1.4);

  const handleSliderChange = (e) => {
    const val = parseFloat(e.target.value);
    setTempAnomaly(val);
    if (canvasRef.current && canvasRef.current.setGlobalTempAnomaly) {
      canvasRef.current.setGlobalTempAnomaly(val);
    }
  };

  // Real IPCC scientific consequences based on anomaly value
  const getConsequenceText = (temp) => {
    if (temp < 0.0) {
      return 'Pre-industrial baseline condition (-1.0°C to 0.0°C). Stable cryosphere and predictable polar vortex confinement.';
    } else if (temp <= 1.5) {
      return 'Current planetary range (+1.1°C to +1.5°C). 2.2× Arctic polar amplification, moderate Hadley cell poleward migration.';
    } else if (temp <= 2.5) {
      return 'Critical threshold (+1.6°C to +2.5°C). 3.0× Arctic amplification, destabilized jet stream Rossby waves, severe mid-latitude heat domes.';
    } else {
      return 'Extreme disruption scenario (+2.6°C to +4.0°C). Deep tropical atmospheric expansion, persistent multi-month mega-droughts, collapsed polar sea ice.';
    }
  };

  return (
    <section
      id="section-heat"
      className="relative min-h-[100dvh] flex flex-col justify-center px-6 md:px-16 py-28 z-10 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
        {/* Left Column: Scientific Narrative & Question */}
        <div className="max-w-xl flex flex-col gap-5">
          <div className="scientific-pill">
            <div className="scientific-pill-dot" />
            <span>SECTION 01 // THERMODYNAMICS</span>
          </div>

          <h2 className="font-serif-editorial text-4xl sm:text-6xl text-[#f5f2ea] font-normal leading-[0.95]">
            How does <br />
            <span className="italic text-[#d9532f]">heat move?</span>
          </h2>

          <p className="font-sans text-[#a6b0c2] text-sm sm:text-base leading-relaxed">
            The equator receives 2.5× more direct solar insolation than the poles. Earth acts as a giant thermodynamic heat engine, using atmospheric circulation cells (Hadley, Ferrel, Polar) and ocean conveyor currents to transport surplus tropical heat toward the Arctic and Antarctic.
          </p>

          {/* Key Metric Callout */}
          <div className="p-4 rounded-xl border border-[rgba(245,242,234,0.1)] bg-white/[0.02] flex items-center justify-between font-mono text-xs text-[#f5f2ea]">
            <div>
              <span className="text-[10px] text-[#647087] uppercase tracking-wider block">Global Temperature Anomaly</span>
              <span className="text-xl font-bold text-[#d9532f]">+{tempAnomaly.toFixed(1)}°C</span>
              <span className="text-[10px] text-[#a6b0c2] ml-1.5">(vs. 1850–1900 baseline)</span>
            </div>
            <Thermometer className="w-6 h-6 text-[#d9532f]" />
          </div>
        </div>

        {/* Right Column: Interactive Scientific Instrument */}
        <div className="museum-card max-w-md w-full pointer-events-auto">
          <div className="museum-card-inner p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-[rgba(245,242,234,0.08)] pb-3">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-[#d9532f]" />
                <span className="font-swiss text-xs font-semibold uppercase tracking-wider text-[#f5f2ea]">
                  THERMAL ANOMALY SIMULATOR
                </span>
              </div>
              <span className="scientific-pill text-[8.5px] text-[#d9532f]">IPCC AR6 DATA</span>
            </div>

            {/* Slider Control */}
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center text-[#a6b0c2]">
                <span>BASELINE ADJUSTMENT:</span>
                <span className="text-[#f5f2ea] font-bold">
                  {tempAnomaly > 0 ? `+${tempAnomaly.toFixed(1)}°C` : `${tempAnomaly.toFixed(1)}°C`}
                </span>
              </div>
              <input
                type="range"
                min="-1.0"
                max="4.0"
                step="0.1"
                value={tempAnomaly}
                onChange={handleSliderChange}
                onMouseEnter={() => audioEngine.playHover()}
                className="w-full accent-[#d9532f] bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                data-cursor="hover"
              />
              <div className="flex justify-between text-[9px] text-[#647087] pt-0.5">
                <span>-1.0°C (Pre-ind)</span>
                <span>+1.5°C (Target)</span>
                <span>+4.0°C (Extreme)</span>
              </div>
            </div>

            {/* Scientific Explanation of the Number */}
            <div className="p-3.5 rounded-lg bg-[rgba(217,83,47,0.06)] border border-[rgba(217,83,47,0.2)] font-sans text-xs text-[#a6b0c2] leading-relaxed">
              <div className="flex items-center gap-1.5 text-[#f5f2ea] font-mono text-[10px] uppercase font-semibold mb-1">
                <AlertCircle className="w-3.5 h-3.5 text-[#d9532f]" />
                <span>Atmospheric Response</span>
              </div>
              {getConsequenceText(tempAnomaly)}
            </div>

            <p className="font-mono text-[10px] text-[#647087] border-t border-[rgba(245,242,234,0.06)] pt-3 leading-tight">
              * Shaders calculate polar amplification and Hadley circulation velocity in real time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
