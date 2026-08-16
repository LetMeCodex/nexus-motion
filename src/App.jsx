import React, { useRef, useState, useEffect, useCallback } from 'react';
import { WebGLCanvas } from './scene/WebGLCanvas';
import { useScrollVelocity } from './hooks/useScrollVelocity';
import { AtlasNavigation } from './components/AtlasNavigation';
import { ScientificHUD } from './components/ScientificHUD';
import { AtlasMinimap } from './components/AtlasMinimap';
import { PerformanceMeter } from './components/PerformanceMeter';
import { SourcesModal } from './components/SourcesModal';
import { CustomCursor } from './components/CustomCursor';

import { HeroAtlasSection } from './sections/HeroAtlasSection';
import { HeatSection } from './sections/HeatSection';
import { WaterSection } from './sections/WaterSection';
import { CityHeatSection } from './sections/CityHeatSection';
import { NetworkSection } from './sections/NetworkSection';
import { ExtremeSection } from './sections/ExtremeSection';
import { ConnectionsSection } from './sections/ConnectionsSection';
import { AtlasConclusionSection } from './sections/AtlasConclusionSection';

export default function App() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const scrollStateRef = useScrollVelocity();

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const activeIndexRef = useRef(0);

  // High-performance scroll listener: sends progress directly to WebGL, only sets state when plate changes
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;

          // Update active plate only when boundary is crossed
          const sectionIndex = Math.min(Math.floor(progress * 8), 7);
          if (sectionIndex !== activeIndexRef.current) {
            activeIndexRef.current = sectionIndex;
            setActiveSectionIndex(sectionIndex);
          }

          // Direct zero-overhead WebGL update
          if (canvasRef.current && canvasRef.current.setScrollProgress) {
            canvasRef.current.setScrollProgress(progress, scrollStateRef.current.velocity);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial sync
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollStateRef]);

  // Pointer coordination for 3D parallax
  const handleMouseMove = useCallback((e) => {
    const normX = (e.clientX / window.innerWidth) * 2 - 1;
    const normY = -(e.clientY / window.innerHeight) * 2 + 1;
    if (canvasRef.current && canvasRef.current.setPointer) {
      canvasRef.current.setPointer(normX, normY);
    }
  }, []);

  const handleNavigate = (index) => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const targetScroll = (index / 7) * docHeight;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-[#08090c] text-[#f8fafc] selection:bg-white/20 selection:text-white"
    >
      {/* Physical Paper Grain Overlay */}
      <div className="grain-overlay" />

      {/* Real-Time WebGL 3D Canvas Instrument */}
      <WebGLCanvas ref={canvasRef} />

      {/* Swiss Minimalist Floating Navigation */}
      <AtlasNavigation
        activeSectionIndex={activeSectionIndex}
        onNavigate={handleNavigate}
        onOpenSources={() => setSourcesOpen(true)}
      />

      {/* Scientific Telemetry HUD & Minimap */}
      <ScientificHUD
        activeSectionIndex={activeSectionIndex}
      />

      <AtlasMinimap
        activeSectionIndex={activeSectionIndex}
        onNavigate={handleNavigate}
      />

      <PerformanceMeter canvasRef={canvasRef} />

      <CustomCursor />

      {/* Sources & Methodology Modal */}
      <SourcesModal
        isOpen={sourcesOpen}
        onClose={() => setSourcesOpen(false)}
      />

      {/* Main Interactive Flow */}
      <main className="relative z-10">
        {/* HERO: 2D SVG Cartographic Earth -> 3D WebGL Earth */}
        <HeroAtlasSection
          onScrollToNext={() => handleNavigate(1)}
        />

        {/* SECTION 01: HEAT ("HOW DOES HEAT MOVE?") */}
        <HeatSection canvasRef={canvasRef} />

        {/* SECTION 02: WATER ("WHERE DOES WATER GO?") */}
        <WaterSection canvasRef={canvasRef} />

        {/* SECTION 03: CITIES ("WHY ARE CITIES HOTTER?") */}
        <CityHeatSection canvasRef={canvasRef} />

        {/* SECTION 04: THE HIDDEN NETWORK ("WHAT KEEPS A CITY ALIVE?") */}
        <NetworkSection canvasRef={canvasRef} />

        {/* SECTION 05: EXTREME EVENTS ("WHAT HAPPENS WHEN THE SYSTEM IS STRESSED?") */}
        <ExtremeSection canvasRef={canvasRef} />

        {/* SECTION 06: CONNECTIONS ("HOW ARE ALL SYSTEMS INTERCONNECTED?") */}
        <ConnectionsSection canvasRef={canvasRef} />

        {/* FINAL SECTION: ATLAS CONCLUSION ("NOT A STATIC PLANET.") */}
        <AtlasConclusionSection
          onScrollToTop={handleScrollToTop}
          onOpenSources={() => setSourcesOpen(true)}
        />
      </main>
    </div>
  );
}
