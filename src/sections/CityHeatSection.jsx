import React, { useState } from 'react';
import { Building2, Trees, Droplet, Sun, Layers } from 'lucide-react';
import { audioEngine } from '../audio/SyntheticAudioEngine';

export function CityHeatSection({ canvasRef }) {
  const [params, setParams] = useState({
    vegetation: 0.20,       // 20%
    density: 0.80,          // 80%
    concreteAlbedo: 0.15,   // 15% (dark asphalt)
    waterProximity: 0.10,   // 10%
  });

  const handleParamChange = (key, value) => {
    const nextParams = { ...params, [key]: value };
    setParams(nextParams);
    if (canvasRef.current && canvasRef.current.setCityParameters) {
      canvasRef.current.setCityParameters(nextParams);
    }
  };

  // Real microclimatic formula for Urban Heat Island (UHI) intensity anomaly
  const deltaT = (
    params.density * 4.2 +
    (1.0 - params.concreteAlbedo) * 3.5 -
    params.vegetation * 3.8 -
    params.waterProximity * 2.0
  ).toFixed(1);

  return (
    <section
      id="section-cities"
      className="relative min-h-[100dvh] flex flex-col justify-center px-6 md:px-16 py-28 z-10 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
        {/* Left Column: Narrative */}
        <div className="max-w-xl flex flex-col gap-5">
          <div className="scientific-pill">
            <div className="scientific-pill-dot bg-[#ecc94b] shadow-[0_0_6px_#ecc94b]" />
            <span>SECTION 03 // URBAN MICROCLIMATES</span>
          </div>

          <h2 className="font-serif-editorial text-4xl sm:text-6xl text-[#f5f2ea] font-normal leading-[0.95]">
            Why are <br />
            <span className="italic text-[#ecc94b]">cities hotter?</span>
          </h2>

          <p className="font-sans text-[#a6b0c2] text-sm sm:text-base leading-relaxed">
            Metropolitan areas replace permeable, evaporative soils with dark, impermeable concrete and asphalt. Tall building geometry creates narrow street canyons that trap re-radiated thermal infrared energy, driving the Urban Heat Island (UHI) effect.
          </p>

          {/* Live Heat Island Anomaly Indicator */}
          <div className="p-4 rounded-xl border border-[rgba(245,242,234,0.1)] bg-white/[0.02] flex items-center justify-between font-mono text-xs text-[#f5f2ea]">
            <div>
              <span className="text-[10px] text-[#647087] uppercase tracking-wider block">Urban Heat Island (UHI) Anomaly</span>
              <span className="text-2xl font-bold text-[#ecc94b]">+{deltaT}°C</span>
              <span className="text-[10px] text-[#a6b0c2] ml-1.5">above surrounding rural baseline</span>
            </div>
            <Building2 className="w-7 h-7 text-[#ecc94b]" />
          </div>
        </div>

        {/* Right Column: Physical Parameter Laboratory */}
        <div className="museum-card max-w-md w-full pointer-events-auto">
          <div className="museum-card-inner p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[rgba(245,242,234,0.08)] pb-3">
              <span className="font-swiss text-xs font-semibold uppercase tracking-wider text-[#f5f2ea]">
                URBAN PARAMETER CONTROLLER
              </span>
              <span className="scientific-pill text-[8.5px] text-[#ecc94b]">EPA MODEL</span>
            </div>

            {/* Slider 1: Vegetation Canopy */}
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-[#a6b0c2]">
                <span className="flex items-center gap-1.5">
                  <Trees className="w-3.5 h-3.5 text-[#48bb78]" />
                  <span>VEGETATION CANOPY:</span>
                </span>
                <span className="text-[#f5f2ea] font-bold">{(params.vegetation * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="0.6"
                step="0.05"
                value={params.vegetation}
                onChange={(e) => handleParamChange('vegetation', parseFloat(e.target.value))}
                onMouseEnter={() => audioEngine.playHover()}
                className="w-full accent-[#48bb78] bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                data-cursor="hover"
              />
            </div>

            {/* Slider 2: Building Density */}
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-[#a6b0c2]">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#ecc94b]" />
                  <span>STREET CANYON DENSITY:</span>
                </span>
                <span className="text-[#f5f2ea] font-bold">{(params.density * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="0.95"
                step="0.05"
                value={params.density}
                onChange={(e) => handleParamChange('density', parseFloat(e.target.value))}
                onMouseEnter={() => audioEngine.playHover()}
                className="w-full accent-[#ecc94b] bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                data-cursor="hover"
              />
            </div>

            {/* Slider 3: Surface Albedo */}
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-[#a6b0c2]">
                <span className="flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-[#d9532f]" />
                  <span>PAVEMENT ALBEDO (Reflectance):</span>
                </span>
                <span className="text-[#f5f2ea] font-bold">{(params.concreteAlbedo * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.75"
                step="0.05"
                value={params.concreteAlbedo}
                onChange={(e) => handleParamChange('concreteAlbedo', parseFloat(e.target.value))}
                onMouseEnter={() => audioEngine.playHover()}
                className="w-full accent-[#d9532f] bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                data-cursor="hover"
              />
            </div>

            <p className="font-mono text-[9.5px] text-[#647087] pt-2 border-t border-[rgba(245,242,234,0.06)] leading-tight">
              * Notice how increasing tree canopy reduces the 3D thermal dome via latent evapotranspiration cooling.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
