import React, { useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { audioEngine } from '../audio/SyntheticAudioEngine';

export function HeroAtlasSection({ onScrollToNext }) {
  const svgRef = useRef(null);
  const svgGroupRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const heroHeight = window.innerHeight * 0.9;
          const progress = Math.min(Math.max(scrollY / heroHeight, 0), 1);

          if (svgRef.current) {
            const opacity = Math.max(1.0 - progress * 1.5, 0.0);
            const scale = 1.0 + progress * 0.45;
            svgRef.current.style.opacity = opacity.toFixed(3);
            svgRef.current.style.transform = `scale(${scale.toFixed(3)})`;
            svgRef.current.style.display = opacity <= 0.01 ? 'none' : 'flex';
          }

          if (svgGroupRef.current) {
            const rot = progress * 65;
            svgGroupRef.current.style.transform = `rotate(${rot.toFixed(1)}deg)`;
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="section-hero"
      className="relative min-h-[100dvh] flex flex-col justify-between px-6 md:px-16 pt-28 pb-12 z-10 pointer-events-none"
    >
      {/* Top Cartographic Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="scientific-pill">
          <div className="scientific-pill-dot" />
          <span>PLATE 00 // THE LIVING ATLAS</span>
        </div>
        <div className="font-mono text-[10px] tracking-[0.22em] text-[#a6b0c2] uppercase hidden sm:block">
          COORDINATES: 00°00′N, 00°00′E — CONTINUOUS 2D → 3D CONTINUUM
        </div>
      </div>

      {/* Center 2D SVG Cartographic Illustration of Earth (Direct DOM update) */}
      <div
        ref={svgRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none will-change-transform"
      >
        <svg
          viewBox="0 0 600 600"
          className="w-[360px] h-[360px] sm:w-[480px] sm:h-[480px] max-w-full text-[#f5f2ea]"
        >
          <g
            ref={svgGroupRef}
            style={{
              transformOrigin: '300px 300px',
            }}
          >
            {/* Outer Graticule Ring */}
            <circle cx="300" cy="300" r="240" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
            <circle cx="300" cy="300" r="236" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.45" />

            {/* Latitude Grid Lines (Ellipses) */}
            <ellipse cx="300" cy="300" rx="236" ry="180" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.25" />
            <ellipse cx="300" cy="300" rx="236" ry="100" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.25" />
            <line x1="64" y1="300" x2="536" y2="300" stroke="#d9532f" strokeWidth="1.2" opacity="0.7" /> {/* Equator */}

            {/* Longitude Grid Lines */}
            <ellipse cx="300" cy="300" rx="160" ry="236" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.25" />
            <ellipse cx="300" cy="300" rx="80" ry="236" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.25" />
            <line x1="300" y1="64" x2="300" y2="536" stroke="currentColor" strokeWidth="0.75" opacity="0.35" />

            {/* Expanding Contour Lines (Topographic Elevation Lines) */}
            <path
              d="M 220 170 Q 250 140 300 180 T 360 220 T 320 280 T 250 260 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              opacity="0.8"
              strokeDasharray="4 2"
            />
            <path
              d="M 210 160 Q 250 130 310 170 T 380 220 T 330 290 T 240 270 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.75"
              opacity="0.4"
            />

            {/* Hand-Drawn Continent Contour Paths */}
            <path
              d="M 330 250 Q 380 270 410 330 T 370 410 T 310 360 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              opacity="0.85"
            />
            <path
              d="M 170 220 Q 210 250 190 320 T 160 380 T 130 300 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              opacity="0.85"
            />

            {/* Animated Atmospheric Streamlines */}
            <path
              d="M 70 275 C 130 255, 210 265, 290 275 S 450 285, 530 265"
              fill="none"
              stroke="#d9532f"
              strokeWidth="1.6"
              className="animate-streamline"
              opacity="0.9"
            />
            <path
              d="M 90 325 C 170 340, 270 330, 350 320 S 470 335, 510 345"
              fill="none"
              stroke="#4299e1"
              strokeWidth="1.6"
              className="animate-streamline"
              opacity="0.9"
            />

            {/* Scientific Data Points & Annotations */}
            <circle cx="290" cy="180" r="3.5" fill="#d9532f" />
            <text x="302" y="184" fill="#a6b0c2" fontSize="9" fontFamily="monospace" letterSpacing="1">
              HADLEY CONVERGENCE [ITCZ]
            </text>

            <circle cx="370" cy="390" r="3.5" fill="#4299e1" />
            <text x="382" y="394" fill="#a6b0c2" fontSize="9" fontFamily="monospace" letterSpacing="1">
              SOUTHERN OCEAN SINK
            </text>

            <circle cx="160" cy="270" r="3" fill="#f5f2ea" />
            <text x="70" y="260" fill="#647087" fontSize="8" fontFamily="monospace" letterSpacing="0.8">
              PACIFIC COLD TONGUE
            </text>
          </g>
        </svg>
      </div>

      {/* Main Asymmetric Editorial Lockup */}
      <div className="my-auto max-w-3xl pointer-events-auto">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#d9532f] font-semibold block mb-3">
          AN INTERACTIVE SCIENTIFIC ATLAS
        </span>

        {/* Exact Prompt Headline */}
        <h1 className="font-swiss-heading font-extrabold text-6xl sm:text-8xl md:text-9xl tracking-tight leading-[0.88] text-[#f5f2ea]">
          EARTH<br />
          IS NOT<br />
          <span className="italic text-[#d9532f]">STATIC.</span>
        </h1>

        {/* Exact Prompt Subheading */}
        <p className="mt-6 max-w-lg font-sans text-base sm:text-lg text-[#a6b0c2] leading-relaxed">
          An interactive atlas of the systems that shape our planet.
        </p>
      </div>

      {/* Bottom Action Prompt (Scroll to Explore) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pt-6 border-t border-[rgba(245,242,234,0.1)] pointer-events-auto">
        <button
          onClick={() => {
            audioEngine.playClick();
            onScrollToNext();
          }}
          onMouseEnter={() => audioEngine.playHover()}
          className="atlas-btn atlas-btn-primary group"
          data-cursor="hover"
        >
          <span>SCROLL TO EXPLORE</span>
          <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
        </button>

        <div className="font-mono text-[10px] text-[#a6b0c2] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#d9532f] animate-pulse" />
          <span className="tracking-widest uppercase">
            ILLUSTRATION → SCIENTIFIC DIAGRAM → PHYSICAL WORLD
          </span>
        </div>
      </div>
    </section>
  );
}
