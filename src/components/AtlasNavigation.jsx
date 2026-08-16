import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, BookOpen, Compass } from 'lucide-react';
import { audioEngine } from '../audio/SyntheticAudioEngine';

const PLATES = [
  { id: 'section-hero', num: '00', title: 'ATLAS' },
  { id: 'section-heat', num: '01', title: 'HEAT' },
  { id: 'section-water', num: '02', title: 'WATER' },
  { id: 'section-cities', num: '03', title: 'CITIES' },
  { id: 'section-network', num: '04', title: 'NETWORK' },
  { id: 'section-extreme', num: '05', title: 'EXTREME' },
  { id: 'section-connections', num: '06', title: 'SYSTEMS' },
  { id: 'section-conclusion', num: '07', title: 'SYNTHESIS' },
];

export function AtlasNavigation({ activeSectionIndex, onNavigate, onOpenSources }) {
  const [isMuted, setIsMuted] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
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
      <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav
          className={`pointer-events-auto flex items-center justify-between gap-4 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-500 ${
            scrolled
              ? 'bg-[#0e111a]/90 backdrop-blur-2xl border border-[rgba(245,242,234,0.12)] shadow-[0_20px_45px_rgba(0,0,0,0.85)]'
              : 'bg-white/[0.03] backdrop-blur-xl border border-[rgba(245,242,234,0.08)]'
          }`}
        >
          {/* Brand Monogram */}
          <button
            onClick={() => handleNavClick(0)}
            className="flex items-center gap-2 text-left group outline-none"
            onMouseEnter={() => audioEngine.playHover()}
          >
            <div className="w-6 h-6 rounded-full bg-[#d9532f]/15 border border-[#d9532f]/40 flex items-center justify-center transition-transform group-hover:scale-105">
              <Compass className="w-3.5 h-3.5 text-[#d9532f]" />
            </div>
            <div className="flex items-center gap-1.5 font-swiss font-bold text-xs tracking-wider text-[#f5f2ea]">
              <span>NEXUS</span>
              <span className="text-[#647087]">/</span>
              <span className="font-serif-editorial italic text-xs text-[#a6b0c2] font-normal hidden sm:inline">Living Atlas</span>
            </div>
          </button>

          {/* Desktop Plate Links */}
          <div className="hidden lg:flex items-center gap-1">
            {PLATES.map((plate, idx) => {
              const isActive = activeSectionIndex === idx;
              return (
                <button
                  key={plate.id}
                  onClick={() => handleNavClick(idx)}
                  onMouseEnter={() => audioEngine.playHover()}
                  className={`px-2.5 py-1 rounded-full font-mono text-[10.5px] uppercase tracking-wider transition-all duration-300 ${
                    isActive
                      ? 'bg-[#d9532f] text-white border border-white/20 shadow-[0_0_15px_rgba(217,83,47,0.35)] font-semibold'
                      : 'text-[#a6b0c2] hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <span className="opacity-50 mr-1 text-[8.5px]">{plate.num}</span>
                  {plate.title}
                </button>
              );
            })}
          </div>

          {/* Actions: Sources & Audio */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                audioEngine.playClick();
                onOpenSources();
              }}
              onMouseEnter={() => audioEngine.playHover()}
              title="View Scientific Sources"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[rgba(245,242,234,0.1)] bg-white/5 text-xs font-mono text-[#a6b0c2] hover:text-white hover:border-white/20 transition-all duration-300"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#d9532f]" />
              <span className="hidden sm:inline text-[9px] tracking-widest uppercase">SOURCES</span>
            </button>

            <button
              onClick={handleAudioToggle}
              onMouseEnter={() => audioEngine.playHover()}
              title={isMuted ? 'Unmute Audio Synthesizer' : 'Mute Audio Synthesizer'}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono transition-all duration-300 ${
                !isMuted
                  ? 'bg-white/15 border-white/30 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  : 'bg-white/5 border-[rgba(245,242,234,0.1)] text-[#a6b0c2] hover:text-white hover:border-white/20'
              }`}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-[#a6b0c2]" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
              <span className="hidden sm:inline text-[9px] tracking-widest uppercase font-mono">
                {isMuted ? 'MUTE' : 'LIVE'}
              </span>
            </button>

            {/* Mobile Menu */}
            <button
              onClick={() => {
                audioEngine.playClick();
                setMenuOpen(!menuOpen);
              }}
              className="lg:hidden w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white"
            >
              {menuOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[#08090e]/95 backdrop-blur-3xl flex flex-col justify-center px-8 lg:hidden animate-fade-in">
          <div className="flex flex-col gap-3 max-w-sm mx-auto w-full">
            <div className="text-[10px] font-mono tracking-[0.25em] text-[#647087] uppercase mb-2">
              Earth System Plates
            </div>
            {PLATES.map((plate, idx) => (
              <button
                key={plate.id}
                onClick={() => handleNavClick(idx)}
                className="flex items-center justify-between py-3 border-b border-white/10 text-left group"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-[#d9532f]">{plate.num}</span>
                  <span className="font-swiss font-bold text-lg text-white group-hover:text-[#f5f2ea] transition-colors">
                    {plate.title}
                  </span>
                </div>
                <span className="font-mono text-xs text-[#647087] group-hover:text-white">↗</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
