import React, { useState } from 'react';
import { Globe, Disc, Grid, Radio, Activity } from 'lucide-react';
import { audioEngine } from '../audio/SyntheticAudioEngine';

const FORMATIONS = [
  { index: 0, label: 'Lattice Sphere', icon: Globe, desc: 'Fibonacci golden ratio distribution' },
  { index: 1, label: 'Logarithmic Spiral', icon: Disc, desc: 'Dual-arm galactic vortex' },
  { index: 2, label: 'Cartesian Matrix', icon: Grid, desc: '3D volumetric cubic array' },
  { index: 3, label: 'Quantum Field', icon: Radio, desc: 'Stochastic entropy dispersion' },
];

export function ParticleSection({ canvasRef }) {
  const [activeFormation, setActiveFormation] = useState(0);

  const handleSelectFormation = (index) => {
    setActiveFormation(index);
    audioEngine.playHover();
    if (canvasRef.current && canvasRef.current.setFormation) {
      canvasRef.current.setFormation(index);
    }
  };

  return (
    <section
      id="section-particle"
      className="relative min-h-[100dvh] flex flex-col justify-center px-6 md:px-16 py-28 z-10 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
        {/* Left Column */}
        <div className="max-w-xl flex flex-col gap-6">
          <div className="micro-pill">
            <div className="micro-pill-dot" />
            <span>PHASE 03 // QUANTUM DISPERSION</span>
          </div>

          <h2 className="font-display font-black text-4xl sm:text-6xl text-white uppercase tracking-tight leading-[0.92]">
            40,000 GPU <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400">
              LIGHT PARTICLES
            </span>
          </h2>

          <p className="font-sans text-neutral-400 text-sm sm:text-base leading-relaxed">
            A high-density particle universe rendered on the GPU with custom vertex displacement shaders. Points compute real-time optical bokeh, depth defocus, and four-way mathematical topology morphing.
          </p>

          <div className="flex flex-wrap gap-3 font-mono text-xs text-neutral-400">
            <div className="bg-white/[0.03] border border-white/8 px-3 py-1.5 rounded-full">
              <span className="text-white font-semibold">40,000</span> Instanced Points
            </div>
            <div className="bg-white/[0.03] border border-white/8 px-3 py-1.5 rounded-full">
              <span className="text-slate-300 font-semibold">Zero GC</span> Render Loop
            </div>
            <div className="bg-white/[0.03] border border-white/8 px-3 py-1.5 rounded-full">
              <span className="text-slate-200 font-semibold">60 FPS</span> Synchronous
            </div>
          </div>
        </div>

        {/* Right Column: Formation Selector */}
        <div className="double-bezel max-w-md w-full pointer-events-auto">
          <div className="double-bezel-inner p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/8 pb-3">
              <span className="font-mono text-xs uppercase tracking-widest text-slate-200 font-semibold">
                TOPOLOGY CONTROLLER
              </span>
              <Activity className="w-4 h-4 text-slate-300" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FORMATIONS.map((form) => {
                const Icon = form.icon;
                const isActive = activeFormation === form.index;
                return (
                  <button
                    key={form.index}
                    onClick={() => handleSelectFormation(form.index)}
                    className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all duration-300 ${
                      isActive
                        ? 'bg-white/15 border-white/30 text-white shadow-[0_0_20px_rgba(255,255,255,0.06)]'
                        : 'bg-white/[0.02] border-white/8 hover:border-white/20 text-neutral-400 hover:text-white'
                    }`}
                    data-cursor="hover"
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                      <span className="font-mono text-[9px] text-slate-300">0{form.index + 1}</span>
                    </div>
                    <span className="font-display font-bold text-xs uppercase text-slate-100">{form.label}</span>
                    <span className="font-mono text-[9.5px] text-neutral-400 mt-1 leading-tight">
                      {form.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="font-mono text-[10px] text-neutral-400 pt-2 border-t border-white/5">
              * Scroll through section 03 to automatically blend through all 4 mathematical states.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
