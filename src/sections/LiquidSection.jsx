import React from 'react';
import { Waves, Zap, Wind, Activity } from 'lucide-react';

export function LiquidSection({ scrollVelocity }) {
  const currentSpeed = Math.abs(Math.round(scrollVelocity));
  const waveAmplitude = (0.40 + Math.min(currentSpeed * 0.001, 1.2)).toFixed(2);

  return (
    <section
      id="section-liquid"
      className="relative min-h-[100dvh] flex flex-col justify-center px-6 md:px-16 py-28 z-10 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
        {/* Left Column */}
        <div className="max-w-xl flex flex-col gap-6">
          <div className="micro-pill">
            <div className="micro-pill-dot" />
            <span>PHASE 05 // FLUID DYNAMICS</span>
          </div>

          <h2 className="font-display font-black text-4xl sm:text-6xl text-white uppercase tracking-tight leading-[0.92]">
            LIQUID OBSIDIAN <br />
            <span className="text-slate-400">SURFACE DYNAMICS</span>
          </h2>

          <p className="font-sans text-neutral-400 text-sm sm:text-base leading-relaxed">
            A high-density subdivided plane executing multi-frequency wave interference and viscous fluid damping. Scroll momentum injects kinetic energy, generating specular swells and ripple reflections with natural spring recovery.
          </p>

          <div className="flex items-center gap-3 font-mono text-xs text-neutral-300">
            <Waves className="w-4 h-4 text-slate-300 animate-pulse" />
            <span>Wave Interference: z = sin(x·ω + t) · cos(y·ω + t) + simplex(x,y,t)</span>
          </div>
        </div>

        {/* Right Column: Live Velocity Sensors */}
        <div className="double-bezel max-w-md w-full pointer-events-auto">
          <div className="double-bezel-inner p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-white/8 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-slate-300" />
                <span className="font-mono text-xs uppercase tracking-widest text-white font-semibold">
                  MOMENTUM SENSORS
                </span>
              </div>
              <span className="micro-pill text-[8.5px] text-slate-200">ACTIVE</span>
            </div>

            {/* Velocity Gauge */}
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center text-neutral-300">
                <span>SCROLL MOMENTUM:</span>
                <span className="text-white font-bold">{currentSpeed} px/s</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-gradient-to-r from-slate-400 via-slate-200 to-white h-full rounded-full transition-all duration-100"
                  style={{ width: `${Math.min((currentSpeed / 2000) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Wave Elevation */}
            <div className="space-y-2 font-mono text-xs pt-2 border-t border-white/5">
              <div className="flex justify-between items-center text-neutral-300">
                <span>WAVE ELEVATION (z):</span>
                <span className="text-slate-200 font-bold">{waveAmplitude}m</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-slate-300 h-full rounded-full transition-all duration-100"
                  style={{ width: `${Math.min((parseFloat(waveAmplitude) / 1.6) * 100, 100)}%` }}
                />
              </div>
            </div>

            <p className="font-mono text-[10px] text-neutral-400 border-t border-white/5 pt-3 leading-relaxed">
              * Scroll rapidly to generate shockwave swells, or drag pointer across the canvas to inject localized disturbance ripples.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
