import React from 'react';
import { ArrowDown, Disc, Compass, Cpu, Layers } from 'lucide-react';
import { audioEngine } from '../audio/SyntheticAudioEngine';

export function HeroSection({ onScrollToNext }) {
  return (
    <section
      id="section-hero"
      className="relative min-h-[100dvh] flex flex-col justify-between px-6 md:px-16 pt-32 pb-16 z-10 pointer-events-none"
    >
      {/* Top Eyebrow Badging */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="micro-pill">
          <div className="micro-pill-dot" />
          <span>PHASE 01 // CONTINUOUS MANIFOLD</span>
        </div>
        <div className="font-mono text-[10px] tracking-[0.22em] text-neutral-400 uppercase hidden sm:block">
          CHOREOGRAPHY: DETERMINISTIC GLSL / 60 FPS
        </div>
      </div>

      {/* Main Asymmetric Editorial Typography */}
      <div className="my-auto max-w-4xl">
        <div className="space-y-1">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400 block mb-2">
            RESEARCH & COMPUTATIONAL MOTION
          </span>
          <h1 className="font-display font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl uppercase tracking-tighter leading-[0.88] text-white">
            KINETIC <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-300 to-slate-500">
              DIMENSION
            </span>
          </h1>
        </div>

        <p className="mt-8 max-w-xl font-sans font-normal text-sm md:text-base text-neutral-400 leading-relaxed">
          An autonomous digital continuum driven by single-viewport WebGL rendering, continuous 4D simplex vertex displacement, 40,000 GPU-instanced quantum particles, and relativistic orbital physics.
        </p>

        {/* Technical Parameter Dock */}
        <div className="mt-8 flex flex-wrap items-center gap-6 pt-6 border-t border-white/8 font-mono text-[11px] text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">DISPERSION:</span>
            <span className="text-neutral-400">IOR 1.54</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">VERTICES:</span>
            <span className="text-neutral-400">5,120 NODES</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">PASS TIME:</span>
            <span className="text-neutral-400">0.42 ms</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Action & Scroll Prompt */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pt-8 border-t border-white/8">
        <div className="flex items-center gap-4 pointer-events-auto">
          <button
            onClick={() => {
              audioEngine.playClick();
              onScrollToNext();
            }}
            onMouseEnter={() => audioEngine.playHover()}
            className="island-btn group"
            data-cursor="hover"
          >
            <span>INITIATE TRAJECTORY</span>
            <div className="island-btn-icon">
              <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform text-slate-200" />
            </div>
          </button>
        </div>

        <div className="flex items-center gap-3 font-mono text-[10px] text-neutral-400">
          <div className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center animate-bounce">
            <ArrowDown className="w-2.5 h-2.5 text-slate-300" />
          </div>
          <span className="tracking-widest uppercase">SCROLL TO ADVANCE CONTINUOUS SHOT</span>
        </div>
      </div>
    </section>
  );
}
