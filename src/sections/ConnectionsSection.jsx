import React, { useState } from 'react';
import { Network, ArrowRight, Share2, Sparkles } from 'lucide-react';
import { audioEngine } from '../audio/SyntheticAudioEngine';

const SYSTEM_NODES = [
  {
    index: 0,
    name: 'HEAT ENGINE',
    color: '#d9532f',
    affects: 'WATER & CITIES',
    mechanism: 'Rising tropospheric temperatures increase the atmosphere’s water vapor holding capacity by 7% per 1°C (Clausius-Clapeyron relation), intensifying both droughts and downpours.',
  },
  {
    index: 1,
    name: 'WATER ENGINE',
    color: '#4299e1',
    affects: 'ECOSYSTEMS & ENERGY',
    mechanism: 'Depleted river reservoirs directly constrain hydroelectric generation and thermoelectric power plant cooling, triggering rolling grid blackouts during peak summer heat waves.',
  },
  {
    index: 2,
    name: 'URBAN CENTERS',
    color: '#ecc94b',
    affects: 'ENERGY DEMAND',
    mechanism: 'Every 1°C increase in urban air temperature drives a 2–4% surge in electrical air conditioning demand, increasing thermal grid strain and urban exhaust heat emissions.',
  },
  {
    index: 3,
    name: 'ENERGY GRIDS',
    color: '#f56565',
    affects: 'HEAT EMISSIONS',
    mechanism: 'Fossil combustion for peak cooling load generates carbon emissions that trap additional planetary heat, establishing a self-reinforcing positive feedback loop.',
  },
  {
    index: 4,
    name: 'ECOSYSTEMS',
    color: '#48bb78',
    affects: 'HEAT & ALBEDO',
    mechanism: 'Intact forest canopies shade soils and pump moisture aloft via evapotranspiration, acting as planetary air conditioners that cool regional climate by up to 2.5°C.',
  },
];

export function ConnectionsSection({ canvasRef }) {
  const [activeNode, setActiveNode] = useState(0);

  const handleNodeClick = (index) => {
    setActiveNode(index);
    audioEngine.playHover();
    if (canvasRef.current && canvasRef.current.highlightSystemNode) {
      canvasRef.current.highlightSystemNode(index);
    }
  };

  const current = SYSTEM_NODES[activeNode];

  return (
    <section
      id="section-connections"
      className="relative min-h-[100dvh] flex flex-col justify-center px-6 md:px-16 py-28 z-10 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
        {/* Left Column: Narrative */}
        <div className="max-w-xl flex flex-col gap-5">
          <div className="scientific-pill">
            <div className="scientific-pill-dot bg-[#f5f2ea]" />
            <span>SECTION 06 // SYSTEMS THINKING</span>
          </div>

          <h2 className="font-serif-editorial text-4xl sm:text-6xl text-[#f5f2ea] font-normal leading-[0.95]">
            How is everything <br />
            <span className="italic text-[#a6b0c2]">interconnected?</span>
          </h2>

          <p className="font-sans text-[#a6b0c2] text-sm sm:text-base leading-relaxed">
            Earth is not a series of isolated silos. A change in atmospheric heat alters rainfall patterns, which stresses agricultural soil, surges city cooling loads, strains power grids, and feeds back into planetary temperature.
          </p>

          {/* Node Switcher Pills */}
          <div className="flex flex-wrap gap-2 pt-2 pointer-events-auto">
            {SYSTEM_NODES.map((node) => (
              <button
                key={node.index}
                onClick={() => handleNodeClick(node.index)}
                onMouseEnter={() => audioEngine.playHover()}
                className={`px-3 py-1.5 rounded-full font-mono text-xs transition-all duration-300 ${
                  activeNode === node.index
                    ? 'bg-white/20 text-white border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.15)]'
                    : 'bg-white/[0.03] border border-[rgba(245,242,234,0.1)] text-[#a6b0c2] hover:text-white hover:border-white/20'
                }`}
                data-cursor="hover"
              >
                <span className="w-2 h-2 rounded-full inline-block mr-2" style={{ backgroundColor: node.color }} />
                {node.name}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Feedback Loop Inspector */}
        <div className="museum-card max-w-md w-full pointer-events-auto">
          <div className="museum-card-inner p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[rgba(245,242,234,0.08)] pb-3">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#f5f2ea]" />
                <span className="font-swiss text-xs font-semibold uppercase tracking-wider text-[#f5f2ea]">
                  CAUSAL FEEDBACK LOOP
                </span>
              </div>
              <span className="scientific-pill text-[8.5px]">FEEDBACK DYNAMICS</span>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-[#a6b0c2]">
              <span className="font-bold text-[#f5f2ea]">{current.name}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#d9532f]" />
              <span className="font-bold text-[#f5f2ea]">{current.affects}</span>
            </div>

            <div className="p-3.5 rounded-lg bg-white/[0.02] border border-[rgba(245,242,234,0.08)] font-sans text-xs text-[#a6b0c2] leading-relaxed">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#d9532f] font-semibold block mb-1">
                Mechanism:
              </span>
              {current.mechanism}
            </div>

            <p className="font-mono text-[9.5px] text-[#647087] pt-2 border-t border-[rgba(245,242,234,0.06)] leading-tight">
              * Notice how 3D causal connection lines illuminate when selecting nodes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
