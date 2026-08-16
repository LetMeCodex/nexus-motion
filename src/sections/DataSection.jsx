import React, { useState } from 'react';
import { Binary, Clock, Cpu, RefreshCw } from 'lucide-react';
import { audioEngine } from '../audio/SyntheticAudioEngine';

export function DataSection() {
  const [dilationRate, setDilationRate] = useState(1.0);

  return (
    <section
      id="section-data"
      className="relative min-h-[100dvh] flex flex-col justify-center px-6 md:px-16 py-28 z-10 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
        {/* Left Column */}
        <div className="max-w-xl flex flex-col gap-6">
          <div className="micro-pill">
            <div className="micro-pill-dot" />
            <span>PHASE 06 // TOPOLOGICAL RESTRUCTURING</span>
          </div>

          <h2 className="font-display font-black text-4xl sm:text-6xl text-white uppercase tracking-tight leading-[0.92]">
            ENTROPY TO ORDER <br />
            <span className="text-slate-400">DATA MATRIX</span>
          </h2>

          <p className="font-sans text-neutral-400 text-sm sm:text-base leading-relaxed">
            1,200 volumetric data nodes undergo continuous mathematical interpolation. Stochastic entropy collapses progressively into ordered cylindrical arrays and quantum schematic rings as scroll depth approaches zero divergence.
          </p>

          <div className="flex flex-wrap gap-4 font-mono text-xs text-neutral-300">
            <div className="flex items-center gap-2">
              <Binary className="w-4 h-4 text-slate-300" />
              <span>P(t) = lerp(P_chaos, P_target, smoothstep(0,1,progress))</span>
            </div>
          </div>
        </div>

        {/* Right Column: Time Dilation & Telemetry */}
        <div className="double-bezel max-w-md w-full pointer-events-auto">
          <div className="double-bezel-inner p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-white/8 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-300" />
                <span className="font-mono text-xs uppercase tracking-widest text-white font-semibold">
                  TEMPORAL ENGINE
                </span>
              </div>
              <span className="micro-pill text-[8.5px] text-slate-200">SYNCHRONIZED</span>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="bg-white/[0.02] border border-white/8 p-3 rounded-lg">
                <span className="text-[8.5px] text-neutral-400 uppercase tracking-wider">VOLUMETRIC NODES</span>
                <p className="text-sm font-bold text-white mt-1">1,200 PTS</p>
              </div>
              <div className="bg-white/[0.02] border border-white/8 p-3 rounded-lg">
                <span className="text-[8.5px] text-neutral-400 uppercase tracking-wider">FORMATION STATE</span>
                <p className="text-sm font-bold text-slate-200 mt-1">CYLINDER</p>
              </div>
            </div>

            {/* Dilation Slider */}
            <div className="space-y-2 pt-2 border-t border-white/5 font-mono text-xs">
              <div className="flex justify-between items-center text-neutral-300">
                <span>TIME DILATION FACTOR:</span>
                <span className="text-slate-100 font-bold">{dilationRate.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.1"
                value={dilationRate}
                onChange={(e) => {
                  setDilationRate(parseFloat(e.target.value));
                  audioEngine.playHover();
                }}
                className="w-full accent-white bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                data-cursor="hover"
              />
            </div>

            <p className="font-mono text-[9.5px] text-neutral-400 leading-relaxed">
              * Scroll forward to initiate gravitational collapse into the final singularity.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
