import React from 'react';
import { Orbit, Compass, Radio, Disc } from 'lucide-react';
import { audioEngine } from '../audio/SyntheticAudioEngine';

const ORBIT_TIERS = [
  { name: 'Tier 01: Alpha Core Probe', radius: '2.4 AU', velocity: '1.40 rad/s', inc: '+14.3°' },
  { name: 'Tier 02: Resonant Prism', radius: '3.8 AU', velocity: '0.95 rad/s', inc: '-20.1°' },
  { name: 'Tier 03: Torus Ring Satellite', radius: '5.4 AU', velocity: '0.65 rad/s', inc: '+25.8°' },
  { name: 'Tier 04: Dodeca Outer Node', radius: '7.2 AU', velocity: '0.45 rad/s', inc: '-08.6°' },
];

export function OrbitalSection() {
  return (
    <section
      id="section-orbital"
      className="relative min-h-[100dvh] flex flex-col justify-center px-6 md:px-16 py-28 z-10 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
        {/* Left Column */}
        <div className="max-w-xl flex flex-col gap-6">
          <div className="micro-pill">
            <div className="micro-pill-dot" />
            <span>PHASE 04 // CELESTIAL MECHANICS</span>
          </div>

          <h2 className="font-display font-black text-4xl sm:text-6xl text-white uppercase tracking-tight leading-[0.92]">
            RELATIVISTIC <br />
            <span className="text-slate-400">ORBITAL SYSTEM</span>
          </h2>

          <p className="font-sans text-neutral-400 text-sm sm:text-base leading-relaxed">
            Concentric Keplerian orbital tracks governed by gravitational equations. Satellite probes accelerate with scroll momentum, projecting relativistic light ribbons and harmonic Doppler shifts across four distinct inclination planes.
          </p>

          <div className="flex items-center gap-3 font-mono text-xs text-neutral-300">
            <Orbit className="w-4 h-4 text-slate-300 animate-spin" style={{ animationDuration: '18s' }} />
            <span>Keplerian Harmonics: v = √(GM / r)</span>
          </div>
        </div>

        {/* Right Column: 4 Orbital Tier Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full pointer-events-auto">
          {ORBIT_TIERS.map((tier, idx) => (
            <div
              key={idx}
              onMouseEnter={() => audioEngine.playHover()}
              className="double-bezel cursor-default transition-transform hover:-translate-y-1 duration-300"
              data-cursor="hover"
            >
              <div className="double-bezel-inner p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">EPICYCLE // 0{idx + 1}</span>
                  <span className="font-mono text-[9px] px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-slate-300">
                    {tier.inc}
                  </span>
                </div>
                <span className="font-display font-bold text-xs text-slate-100">{tier.name}</span>
                <div className="flex items-center justify-between font-mono text-[10px] text-neutral-400 pt-2 border-t border-white/5">
                  <span>R: <strong className="text-slate-200">{tier.radius}</strong></span>
                  <span>V: <strong className="text-slate-100">{tier.velocity}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
