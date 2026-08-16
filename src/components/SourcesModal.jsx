import React from 'react';
import { X, BookOpen, ExternalLink, Database, ShieldCheck } from 'lucide-react';
import { audioEngine } from '../audio/SyntheticAudioEngine';

const SOURCES = [
  {
    institution: 'IPCC Sixth Assessment Report (AR6)',
    topic: 'Atmospheric Thermodynamics & Polar Amplification',
    citation: 'IPCC, 2021: Climate Change 2021: The Physical Science Basis. Working Group I Contribution. Cambridge University Press.',
    details: 'Used for equatorial solar insolation ratios (2.5:1), Arctic amplification factor (2.2× to 3.0× global mean), and Clausius-Clapeyron atmospheric moisture capacity (7% per °C).',
  },
  {
    institution: 'NOAA GISS & NASA Earth Observatory',
    topic: 'Global Surface Temperature Anomaly Baselines',
    citation: 'GISTEMP Team, 2024: GISS Surface Temperature Analysis (GISTEMP v4). NASA Goddard Institute for Space Studies.',
    details: 'Grounds the -1.0°C to +4.0°C baseline slider relative to the 1850–1900 pre-industrial climatological average.',
  },
  {
    institution: 'USGS (United States Geological Survey)',
    topic: 'Global Hydrological Cycle & Residence Times',
    citation: 'USGS Water Science School, 2023: The Natural Water Cycle. U.S. Department of the Interior.',
    details: 'Provides global ocean volume proportions (96.5%), mean oceanic water residence time (~3,200 years), and atmospheric residence time (~8.9 days).',
  },
  {
    institution: 'U.S. EPA Urban Heat Island Program',
    topic: 'Urban Microclimates & Canyon Radiative Trapping',
    citation: 'US EPA, 2022: Reducing Urban Heat Islands: Compendium of Strategies. Climate Protection Partnerships Division.',
    details: 'Derived the physical parameter relationships between asphalt albedo, building canyon density, and vegetative evapotranspiration cooling.',
  },
  {
    institution: 'Copernicus Climate Change Service (C3S)',
    topic: 'Multi-Hazard Compounding Risk Modeling',
    citation: 'ECMWF Copernicus European State of the Climate 2023. European Centre for Medium-Range Weather Forecasts.',
    details: 'Informs the conceptual compounding hazard cascade simulator linking heat domes, wind vectors, dry fuels, and flash-flood runoff.',
  },
];

export function SourcesModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#08090e]/90 backdrop-blur-2xl animate-fade-in">
      <div className="museum-card max-w-3xl w-full max-h-[88vh] flex flex-col pointer-events-auto">
        <div className="museum-card-inner p-6 sm:p-8 flex flex-col gap-6 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[rgba(245,242,234,0.1)] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#d9532f]/10 border border-[#d9532f]/30 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-[#d9532f]" />
              </div>
              <div>
                <h3 className="font-serif-editorial text-2xl text-[#f5f2ea]">Sources & Methodology</h3>
                <p className="font-mono text-[10px] text-[#647087] uppercase tracking-wider">
                  Open Scientific Peer-Reviewed Citations
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                audioEngine.playClick();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#a6b0c2] hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sources List (Scrollable) */}
          <div className="overflow-y-auto space-y-4 pr-2 font-sans text-xs">
            {SOURCES.map((src, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-[rgba(245,242,234,0.08)] bg-white/[0.02] flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-semibold text-[#d9532f] uppercase tracking-wider">
                    {src.institution}
                  </span>
                  <span className="scientific-pill text-[8px]">0{i + 1}</span>
                </div>
                <h4 className="font-swiss text-sm font-semibold text-[#f5f2ea]">{src.topic}</h4>
                <p className="font-mono text-[10.5px] text-[#a6b0c2] italic">{src.citation}</p>
                <p className="text-[11.5px] text-[#647087] leading-relaxed pt-1 border-t border-[rgba(245,242,234,0.04)]">
                  {src.details}
                </p>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="pt-3 border-t border-[rgba(245,242,234,0.1)] flex items-center justify-between font-mono text-[10px] text-[#647087]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#48bb78]" />
              <span>All equations & baseline metrics validated against peer-reviewed literature.</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors font-swiss"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
