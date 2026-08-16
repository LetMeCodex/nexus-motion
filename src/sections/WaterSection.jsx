import React, { useState } from 'react';
import { Droplet, Cloud, ArrowDown, Activity, RefreshCw } from 'lucide-react';
import { audioEngine } from '../audio/SyntheticAudioEngine';

const WATER_STAGES = [
  {
    id: 0,
    title: 'Ocean Reservoir',
    volume: '96.5% of total water',
    residence: '~3,200 years',
    desc: 'The primary planetary thermal and moisture sink, absorbing 90% of excess anthropogenic heat.',
  },
  {
    id: 1,
    title: 'Solar Evaporation',
    volume: '434,000 km³/year',
    residence: 'Instantaneous flux',
    desc: 'Solar energy breaks hydrogen bonds, absorbing 2.26 MJ/kg of latent heat from the ocean surface.',
  },
  {
    id: 2,
    title: 'Atmospheric Vapor',
    volume: '0.001% of total water',
    residence: '~8.9 days',
    desc: 'Acts as Earth’s most powerful greenhouse gas, transporting moisture globally via atmospheric rivers.',
  },
  {
    id: 3,
    title: 'Precipitation',
    volume: '505,000 km³/year',
    residence: 'Hours to days',
    desc: 'Condensation aloft releases stored latent heat back into the upper troposphere, driving storm dynamics.',
  },
  {
    id: 4,
    title: 'River Runoff',
    volume: '40,000 km³/year',
    residence: '~2 weeks to months',
    desc: 'Gravity-driven hydraulic return, transporting terrestrial mineral nutrients back into ocean basins.',
  },
];

export function WaterSection({ canvasRef }) {
  const [selectedStage, setSelectedStage] = useState(0);

  const handleStageClick = (index) => {
    setSelectedStage(index);
    audioEngine.playClick();
    if (canvasRef.current && canvasRef.current.setWaterStage) {
      canvasRef.current.setWaterStage(index);
    }
  };

  const activeInfo = WATER_STAGES[selectedStage];

  return (
    <section
      id="section-water"
      className="relative min-h-[100dvh] flex flex-col justify-center px-6 md:px-16 py-28 z-10 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
        {/* Left Column: Narrative */}
        <div className="max-w-xl flex flex-col gap-5">
          <div className="scientific-pill">
            <div className="scientific-pill-dot bg-[#4299e1] shadow-[0_0_6px_#4299e1]" />
            <span>SECTION 02 // HYDROLOGICAL CYCLE</span>
          </div>

          <h2 className="font-serif-editorial text-4xl sm:text-6xl text-[#f5f2ea] font-normal leading-[0.95]">
            Where does <br />
            <span className="italic text-[#4299e1]">water go?</span>
          </h2>

          <p className="font-sans text-[#a6b0c2] text-sm sm:text-base leading-relaxed">
            Every drop of water on Earth circulates through a closed, continuous thermodynamic loop. Solar radiation vaporizes seawater, transporting energy aloft before releasing it as precipitation that sculpts mountain watersheds and returns through river deltas.
          </p>

          {/* Flow Stepper Buttons */}
          <div className="flex flex-wrap gap-2 pt-2 pointer-events-auto">
            {WATER_STAGES.map((stg, i) => (
              <button
                key={stg.id}
                onClick={() => handleStageClick(i)}
                onMouseEnter={() => audioEngine.playHover()}
                className={`px-3 py-1.5 rounded-full font-mono text-xs transition-all duration-300 ${
                  selectedStage === i
                    ? 'bg-[#4299e1] text-white border border-white/20 shadow-[0_0_15px_rgba(66,153,225,0.4)]'
                    : 'bg-white/[0.03] border border-[rgba(245,242,234,0.1)] text-[#a6b0c2] hover:text-white hover:border-white/20'
                }`}
                data-cursor="hover"
              >
                0{i + 1} // {stg.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Stage Inspector Card */}
        <div className="museum-card max-w-md w-full pointer-events-auto">
          <div className="museum-card-inner p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[rgba(245,242,234,0.08)] pb-3">
              <div className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-[#4299e1]" />
                <span className="font-swiss text-xs font-semibold uppercase tracking-wider text-[#f5f2ea]">
                  STAGE INSPECTOR: {activeInfo.title}
                </span>
              </div>
              <span className="scientific-pill text-[8.5px] text-[#4299e1]">USGS DATA</span>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-white/[0.02] border border-[rgba(245,242,234,0.08)]">
                <span className="text-[9px] text-[#647087] uppercase tracking-wider block">Global Volume</span>
                <span className="text-sm font-bold text-[#f5f2ea] mt-1 block">{activeInfo.volume}</span>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-[rgba(245,242,234,0.08)]">
                <span className="text-[9px] text-[#647087] uppercase tracking-wider block">Residence Time</span>
                <span className="text-sm font-bold text-[#4299e1] mt-1 block">{activeInfo.residence}</span>
              </div>
            </div>

            <p className="font-sans text-xs text-[#a6b0c2] leading-relaxed pt-2 border-t border-[rgba(245,242,234,0.06)]">
              {activeInfo.desc}
            </p>

            <div className="font-mono text-[9.5px] text-[#647087] flex items-center gap-2 pt-2 border-t border-[rgba(245,242,234,0.06)]">
              <RefreshCw className="w-3 h-3 text-[#4299e1] animate-spin" style={{ animationDuration: '8s' }} />
              <span>Particles dynamically trace 3D evaporation and precipitation streams.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
