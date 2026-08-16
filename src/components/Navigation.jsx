import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, Compass, Disc } from 'lucide-react';
import { audioEngine } from '../audio/SyntheticAudioEngine';

const SECTIONS = [
  { id: 'section-hero', num: '01', title: 'ORIGIN' },
  { id: 'section-dimension', num: '02', title: 'GIMBAL' },
  { id: 'section-particle', num: '03', title: 'PARTICLES' },
  { id: 'section-orbital', num: '04', title: 'ORBITAL' },
  { id: 'section-liquid', num: '05', title: 'FLUID' },
  { id: 'section-data', num: '06', title: 'DATA' },
  { id: 'section-singularity', num: '07', title: 'SINGULARITY' },
];

export function Navigation({ activeSectionIndex, onNavigate }) {
  const [isMuted, setIsMuted] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAudioToggle = () => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleNavClick = (index) => {
    audioEngine.playClick();
    onNavigate(index);
    setMenuOpen(false);
  };

  return (
    <>
      {/* Detached Floating Island Navbar */}
      <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav
          className={`pointer-events-auto flex items-center justify-between gap-6 px-5 py-2.5 rounded-full transition-all duration-500 ${
            scrolled
              ? 'bg-[#0c0c14]/85 backdrop-blur-2xl border border-white/12 shadow-[0_20px_40px_rgba(0,0,0,0.8)] ring-1 ring-white/5'
              : 'bg-white/[0.03] backdrop-blur-xl border border-white/[0.08]'
          }`}
        >
          {/* Brand Monogram */}
          <button
            onClick={() => handleNavClick(0)}
            className="flex items-center gap-2.5 text-left group outline-none"
            onMouseEnter={() => audioEngine.playHover()}
          >
            <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center transition-transform group-hover:scale-105">
              <Compass className="w-3.5 h-3.5 text-slate-200 animate-spin" style={{ animationDuration: '24s' }} />
            </div>
            <div className="flex items-center gap-1.5 font-display font-bold text-xs tracking-wider text-white">
              <span>NEXUS</span>
              <span className="text-neutral-500">/</span>
              <span className="font-mono text-[10px] text-neutral-300 font-normal">MOTION</span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {SECTIONS.map((sec, idx) => {
              const isActive = activeSectionIndex === idx;
              return (
                <button
                  key={sec.id}
                  onClick={() => handleNavClick(idx)}
                  onMouseEnter={() => audioEngine.playHover()}
                  className={`px-3 py-1 rounded-full font-mono text-[11px] uppercase tracking-wider transition-all duration-300 ${
                    isActive
                      ? 'bg-white/15 text-white border border-white/25 shadow-[0_0_15px_rgba(255,255,255,0.08)]'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <span className="opacity-40 mr-1 text-[9px]">{sec.num}</span>
                  {sec.title}
                </button>
              );
            })}
          </div>

          {/* Audio Synthesizer Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleAudioToggle}
              onMouseEnter={() => audioEngine.playHover()}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono transition-all duration-300 ${
                !isMuted
                  ? 'bg-white/15 border-white/30 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
              }`}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-neutral-400" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
              <span className="hidden sm:inline text-[9px] tracking-widest uppercase font-mono">
                {isMuted ? 'MUTE' : 'LIVE'}
              </span>
              {!isMuted && (
                <div className="flex items-end gap-0.5 h-2.5 ml-0.5">
                  <div className="w-0.5 bg-white animate-pulse h-full" style={{ animationDelay: '0ms' }} />
                  <div className="w-0.5 bg-white animate-pulse h-2/3" style={{ animationDelay: '150ms' }} />
                  <div className="w-0.5 bg-white animate-pulse h-4/5" style={{ animationDelay: '300ms' }} />
                </div>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => {
                audioEngine.playClick();
                setMenuOpen(!menuOpen);
              }}
              className="lg:hidden w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white"
            >
              {menuOpen ? <X className="w-3.5 h-3.5 text-white" /> : <Menu className="w-3.5 h-3.5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[#060608]/95 backdrop-blur-3xl flex flex-col justify-center px-8 lg:hidden animate-fade-in">
          <div className="flex flex-col gap-3 max-w-sm mx-auto w-full">
            <div className="text-[10px] font-mono tracking-[0.25em] text-neutral-400 uppercase mb-2">
              Dimensional Coordinates
            </div>
            {SECTIONS.map((sec, idx) => (
              <button
                key={sec.id}
                onClick={() => handleNavClick(idx)}
                onMouseEnter={() => audioEngine.playHover()}
                className="flex items-center justify-between py-3 border-b border-white/10 text-left group"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-neutral-400">{sec.num}</span>
                  <span className="font-display font-bold text-xl text-white group-hover:text-neutral-300 transition-colors">
                    {sec.title}
                  </span>
                </div>
                <span className="font-mono text-xs text-neutral-400 group-hover:text-white">↗</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
