import React, { useState } from 'react';
import { Layers, Box, Cpu, Compass } from 'lucide-react';
import { audioEngine } from '../audio/SyntheticAudioEngine';

export function DimensionSection() {
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -14;
    setCardTilt({ x, y });
  };

  const handleMouseLeave = () => setCardTilt({ x: 0, y: 0 });

  return (
    <section
      id="section-dimension"
      className="relative min-h-[100dvh] flex flex-col justify-center px-6 md:px-16 py-28 z-10 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
        {/* Left Column */}
        <div className="max-w-xl flex flex-col gap-6">
          <div className="micro-pill">
            <div className="micro-pill-dot" />
            <span>PHASE 02 // GYROSCOPIC DECONSTRUCTION</span>
          </div>

          <h2 className="font-display font-black text-4xl sm:text-6xl text-white uppercase tracking-tight leading-[0.92]">
            ORTHOGONAL <br />
            <span className="text-slate-400">GIMBAL MATRIX</span>
          </h2>

          <p className="font-sans text-neutral-400 text-sm sm:text-base leading-relaxed">
            As your camera trajectory pierces the outer mantle, the core unlocks along three orthogonal gimbal planes. Concentric titanium rings rotate independently around a frosted optical quartz nucleus, maintaining stability across harmonic axes.
          </p>

          <div className="grid grid-cols-2 gap-4 font-mono text-xs text-neutral-300 pt-2">
            <div className="flex items-center gap-2">
              <Box className="w-4 h-4 text-slate-300" />
              <span>Octahedral Cage v3</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-400" />
              <span>Orthogonal Gimbal</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Double-Bezel Card */}
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={() => audioEngine.playHover()}
          style={{
            transform: `perspective(1000px) rotateX(${cardTilt.y}deg) rotateY(${cardTilt.x}deg)`,
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="double-bezel max-w-md w-full pointer-events-auto cursor-default"
          data-cursor="hover"
        >
          <div className="double-bezel-inner p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-white/8 pb-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-slate-300" />
                <span className="font-mono text-xs tracking-wider text-white font-semibold uppercase">
                  GYROSCOPIC TELEMETRY
                </span>
              </div>
              <span className="micro-pill text-[8.5px] text-slate-200">CALIBRATED</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center text-neutral-400">
                <span>Ring A (Equatorial Torus):</span>
                <span className="text-slate-200 font-bold">1.40 rad/s</span>
              </div>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className="bg-slate-300 h-full w-3/4 rounded-full" />
              </div>

              <div className="flex justify-between items-center text-neutral-400 pt-2">
                <span>Ring B (Polar Torus):</span>
                <span className="text-slate-300 font-bold">0.95 rad/s</span>
              </div>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className="bg-slate-400 h-full w-3/5 rounded-full" />
              </div>

              <div className="flex justify-between items-center text-neutral-400 pt-2">
                <span>Singularity Stability:</span>
                <span className="text-slate-100 font-bold">99.82%</span>
              </div>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className="bg-slate-200 h-full w-[99%] rounded-full" />
              </div>
            </div>

            <p className="text-[11px] text-neutral-400 border-t border-white/5 pt-4 leading-relaxed font-sans">
              Pointer coordinates dynamically deflect the gyroscopic momentum without breaking harmonic orbital synchronicity.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
