import React, { useState } from 'react';
import { ArrowDown, Globe, Map, Compass, Sliders, MapPin, Activity } from 'lucide-react';
import { INTERACTIVE_LOCATIONS } from '../scene/objects/GlobeMapMorphMesh';
import { audioEngine } from '../audio/SyntheticAudioEngine';

export function GlobeMapSection({ scrollProgress, canvasRef }) {
  const [selectedLoc, setSelectedLoc] = useState(INTERACTIVE_LOCATIONS[0]);
  const [isManualOverride, setIsManualOverride] = useState(false);
  const [manualMorphVal, setManualMorphVal] = useState(0.0);

  // Compute live morph percentage
  let morphT = 0;
  if (isManualOverride) {
    morphT = manualMorphVal;
  } else if (scrollProgress > 0.15) {
    morphT = Math.min(Math.max((scrollProgress - 0.15) / 0.70, 0), 1);
  }

  const curvatureDeg = ((1.0 - morphT) * 360).toFixed(0);
  const isFullyFlat = morphT >= 0.95;

  const handleLocationHover = (loc) => {
    setSelectedLoc(loc);
    if (canvasRef.current && canvasRef.current.setHoveredLocation) {
      canvasRef.current.setHoveredLocation(loc ? loc.id : null);
    }
  };

  const handleManualSlider = (e) => {
    const val = parseFloat(e.target.value);
    setIsManualOverride(true);
    setManualMorphVal(val);
    if (canvasRef.current && canvasRef.current.setManualMorph) {
      canvasRef.current.setManualMorph(val);
    }
  };

  const handleResetScrollSync = () => {
    setIsManualOverride(false);
    if (canvasRef.current && canvasRef.current.setManualMorph) {
      canvasRef.current.setManualMorph(null);
    }
  };

  return (
    <div className="relative min-h-[380dvh] pointer-events-none">
      {/* 1. STAGE 1: HERO (0 - 30% scroll) */}
      <section className="sticky top-0 h-[100dvh] flex flex-col justify-between px-6 md:px-16 pt-28 pb-12 z-10 pointer-events-none">
        {/* Top Header Eyebrow */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 font-mono text-[10px] tracking-widest text-[#94a3b8] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>GEOMETRIC TRANSFORMATION PROTOCOL</span>
          </div>

          <div className="font-mono text-[10px] tracking-[0.2em] text-[#64748b] uppercase hidden sm:block">
            EQUATION: mix(Sphere(R,λ,φ), Map(x,y), smoothstep(0,1,morph))
          </div>
        </div>

        {/* Dynamic Editorial Headline (Crossfades naturally based on morph progress) */}
        <div className="my-auto max-w-4xl pointer-events-auto">
          {!isFullyFlat ? (
            <div className="space-y-3">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#94a3b8] block">
                MATHEMATICAL MANIFOLD
              </span>
              <h1 className="font-swiss-heading font-extrabold text-5xl sm:text-7xl md:text-8xl tracking-tight text-[#f8fafc] leading-[0.92]">
                SPHERE TO <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-300 to-slate-500">
                  WORLD MAP.
                </span>
              </h1>
              <p className="max-w-xl font-sans text-sm sm:text-base text-[#94a3b8] leading-relaxed pt-2">
                A single continuous GPU mesh physically unrolling from 3D spherical coordinates into a 2D equirectangular planar map. Longitude lines straighten; continental topology stretches with mathematical precision.
              </p>
            </div>
          ) : (
            <div className="space-y-3 animate-fade-in">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#d9532f] font-semibold block">
                PLANETARY TOPOLOGY RESOLVED
              </span>
              <h2 className="font-serif-editorial text-5xl sm:text-7xl md:text-8xl font-normal text-[#f8fafc] leading-[0.9]">
                One planet. <br />
                <span className="italic text-[#94a3b8]">Many systems.</span>
              </h2>
              <p className="max-w-xl font-sans text-sm sm:text-base text-[#94a3b8] leading-relaxed pt-2">
                The globe has flattened into an interactive coordinate continuum. Select any geographic node to inspect localized systemic telemetry.
              </p>
            </div>
          )}

          {/* Real-Time Geometric Telemetry Bar */}
          <div className="mt-8 flex flex-wrap items-center gap-6 pt-6 border-t border-white/8 font-mono text-[11px] text-[#94a3b8]">
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">MORPH STATE:</span>
              <span className="text-slate-200">{(morphT * 100).toFixed(0)}% ({isFullyFlat ? 'FLAT MAP' : morphT === 0 ? 'SPHERICAL GLOBE' : 'UNROLLING'})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">CURVATURE:</span>
              <span className="text-slate-200">{curvatureDeg}° ARC</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">TOPOLOGY:</span>
              <span className="text-slate-200">EQUIRECTANGULAR 2:1</span>
            </div>
          </div>
        </div>

        {/* Bottom Interactive HUD Dock */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 pt-6 border-t border-white/8 pointer-events-auto">
          {/* Manual Morph Scrubber */}
          <div className="flex items-center gap-4 bg-[#0e111a]/80 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full shadow-lg">
            <Sliders className="w-3.5 h-3.5 text-[#94a3b8]" />
            <div className="flex items-center gap-2 font-mono text-[10px] text-[#94a3b8]">
              <span>GLOBE</span>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.01"
                value={morphT}
                onChange={handleManualSlider}
                className="w-28 sm:w-44 accent-white bg-white/10 h-1 rounded-lg appearance-none cursor-pointer"
                data-cursor="hover"
              />
              <span>MAP</span>
            </div>

            {isManualOverride && (
              <button
                onClick={handleResetScrollSync}
                className="font-mono text-[9px] uppercase px-2 py-0.5 rounded bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                SYNC SCROLL
              </button>
            )}
          </div>

          {/* Interactive Geographic Node Selector (Active in map state or globe state) */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
            {INTERACTIVE_LOCATIONS.slice(0, 6).map((loc) => {
              const isSelected = selectedLoc?.id === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => handleLocationHover(loc)}
                  onMouseEnter={() => {
                    handleLocationHover(loc);
                    audioEngine.playHover();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[10.5px] whitespace-nowrap transition-all duration-300 ${
                    isSelected
                      ? 'bg-white text-black font-semibold shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                      : 'bg-white/[0.04] border border-white/8 text-[#94a3b8] hover:text-white hover:border-white/20'
                  }`}
                  data-cursor="hover"
                >
                  <MapPin className={`w-3 h-3 ${isSelected ? 'text-black' : 'text-[#94a3b8]'}`} />
                  <span>{loc.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Floating Hover Tooltip for Selected Node */}
      {selectedLoc && (
        <div className="fixed bottom-24 right-6 z-30 pointer-events-auto hidden sm:block">
          <div className="museum-card w-80 shadow-2xl">
            <div className="museum-card-inner p-4 flex flex-col gap-2.5">
              <div className="flex items-center justify-between border-b border-white/8 pb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#d9532f]" />
                  <span className="font-swiss text-xs font-semibold text-white uppercase tracking-wider">
                    {selectedLoc.name}
                  </span>
                </div>
                <span className="font-mono text-[9px] text-[#94a3b8]">{selectedLoc.region}</span>
              </div>

              <div className="space-y-1 font-mono text-[10.5px] text-[#94a3b8]">
                <div className="flex justify-between">
                  <span>NATION:</span>
                  <span className="text-white font-medium">{selectedLoc.country}</span>
                </div>
                <div className="flex justify-between">
                  <span>COORDINATES:</span>
                  <span className="text-white font-medium">
                    {Math.abs(selectedLoc.lat).toFixed(2)}°{selectedLoc.lat >= 0 ? 'N' : 'S'}, {Math.abs(selectedLoc.lon).toFixed(2)}°{selectedLoc.lon >= 0 ? 'E' : 'W'}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-white/5">
                  <span>SYSTEMIC ROLE:</span>
                  <span className="text-white font-bold">{selectedLoc.metric}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
