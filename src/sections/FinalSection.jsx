import React, { useState } from 'react';
import { Sparkles, RotateCcw, Compass } from 'lucide-react';
import { audioEngine } from '../audio/SyntheticAudioEngine';

export function FinalSection({ canvasRef, onScrollToTop }) {
  const [pulsed, setPulsed] = useState(false);

  const handleRebirth = () => {
    audioEngine.playSingularityPulse();
    if (canvasRef.current && canvasRef.current.triggerRebirth) {
      canvasRef.current.triggerRebirth();
    }
    setPulsed(true);
    setTimeout(() => setPulsed(false), 2000);
  };

  return (
    <section
      id="section-singularity"
      className="relative min-h-[100dvh] flex flex-col justify-between px-6 md:px-16 pt-24 pb-12 z-10 pointer-events-none"
    >
      {/* Top Eyebrow */}
      <div className="flex items-center justify-between">
        <div className="micro-pill">
          <div className="micro-pill-dot" />
          <span>PHASE 07 // SINGULARITY CONVERGENCE</span>
        </div>
        <span className="font-mono text-[9.5px] tracking-[0.22em] text-neutral-400 uppercase hidden sm:block">
          ZERO GRAVITATIONAL DIVERGENCE
        </span>
      </div>

      {/* Climax Message */}
      <div className="my-auto max-w-4xl text-center mx-auto flex flex-col items-center gap-8 pointer-events-auto">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-400">
            FINAL CONVERGENCE
          </span>
          <h2 className="font-display font-black text-4xl sm:text-6xl md:text-8xl text-white uppercase tracking-tight leading-[0.92]">
            THE DIMENSION <br />
            WAS ALWAYS <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]">
              YOU.
            </span>
          </h2>
        </div>

        <p className="max-w-md font-sans text-sm sm:text-base text-neutral-400 leading-relaxed">
          The boundaries of the digital continuum collapse into a single harmonic singularity point. The journey repeats infinitely across all dimensional vectors.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={handleRebirth}
            onMouseEnter={() => audioEngine.playHover()}
            className={`island-btn group transition-all duration-500 ${
              pulsed ? 'bg-white text-black border-white shadow-[0_0_40px_rgba(255,255,255,0.8)]' : ''
            }`}
            data-cursor="hover"
          >
            <span>{pulsed ? 'SINGULARITY DETONATING...' : 'INITIATE REBIRTH PULSE'}</span>
            <div className="island-btn-icon">
              <Sparkles className="w-3.5 h-3.5 text-slate-200" />
            </div>
          </button>

          <button
            onClick={() => {
              audioEngine.playClick();
              onScrollToTop();
            }}
            onMouseEnter={() => audioEngine.playHover()}
            className="island-btn group bg-white/[0.03] border-white/8 hover:border-white/20"
            data-cursor="hover"
          >
            <span>RETURN TO ORIGIN</span>
            <div className="island-btn-icon">
              <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-90 transition-transform text-slate-300" />
            </div>
          </button>
        </div>
      </div>

      {/* Luxury Footer Dock */}
      <footer className="pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10.5px] text-neutral-500 pointer-events-auto">
        <div className="flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-neutral-300 font-semibold">NEXUS / MOTION</span>
          <span>© 2026 // COMPUTATIONAL DIMENSIONS PRESERVED</span>
        </div>

        <div className="flex items-center gap-6 text-[10px]">
          <span>WEBGL 2.0 // GLSL // THREE.JS // GSAP</span>
          <span className="text-slate-300">60 FPS SYNCHRONOUS</span>
        </div>
      </footer>
    </section>
  );
}
