import React from 'react';
import { RotateCcw, BookOpen, Globe, Compass, ExternalLink } from 'lucide-react';
import { audioEngine } from '../audio/SyntheticAudioEngine';

export function AtlasConclusionSection({ onScrollToTop, onOpenSources }) {
  return (
    <section
      id="section-conclusion"
      className="relative min-h-[100dvh] flex flex-col justify-between px-6 md:px-16 pt-28 pb-12 z-10 pointer-events-none"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="scientific-pill">
          <div className="scientific-pill-dot" />
          <span>PLATE 07 // CONTINUUM CONCLUSION</span>
        </div>
        <span className="font-mono text-[10px] tracking-[0.22em] text-[#647087] uppercase hidden sm:block">
          SCIENTIFIC SYNTHESIS COMPLETED
        </span>
      </div>

      {/* Main Climax Editorial Statement */}
      <div className="my-auto max-w-3xl text-center mx-auto flex flex-col items-center gap-7 pointer-events-auto">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#d9532f] font-semibold">
          THE LIVING ATLAS
        </span>

        <h2 className="font-serif-editorial text-5xl sm:text-7xl md:text-8xl text-[#f5f2ea] font-normal leading-[0.9]">
          Not a static <br />
          <span className="italic text-[#a6b0c2]">planet.</span>
        </h2>

        <p className="max-w-lg font-sans text-sm sm:text-base text-[#a6b0c2] leading-relaxed">
          From atmospheric thermodynamic circulation to urban infrastructure conduits, our world is a single, interconnected, living information instrument.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => {
              audioEngine.playClick();
              onScrollToTop();
            }}
            onMouseEnter={() => audioEngine.playHover()}
            className="atlas-btn atlas-btn-primary group"
            data-cursor="hover"
          >
            <span>EXPLORE AGAIN</span>
            <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-90 transition-transform" />
          </button>

          <button
            onClick={() => {
              audioEngine.playClick();
              onOpenSources();
            }}
            onMouseEnter={() => audioEngine.playHover()}
            className="atlas-btn group bg-white/[0.04] border-[rgba(245,242,234,0.15)] hover:border-white/30"
            data-cursor="hover"
          >
            <span>VIEW SOURCES & METHODOLOGY</span>
            <BookOpen className="w-3.5 h-3.5 text-[#a6b0c2] group-hover:text-white" />
          </button>
        </div>
      </div>

      {/* Museum Exhibition Footer */}
      <footer className="pt-8 border-t border-[rgba(245,242,234,0.1)] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-[#647087] pointer-events-auto">
        <div className="flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-[#d9532f]" />
          <span className="text-[#f5f2ea] font-semibold">NEXUS // THE LIVING ATLAS</span>
          <span>© 2026 // OPEN SCIENTIFIC INSTRUMENT</span>
        </div>

        <div className="flex items-center gap-6 text-[10px]">
          <span>IPCC AR6 // NOAA GISS // USGS // EPA</span>
          <span className="text-[#a6b0c2]">SWISS EDITORIAL WEBGL 2.0</span>
        </div>
      </footer>
    </section>
  );
}
