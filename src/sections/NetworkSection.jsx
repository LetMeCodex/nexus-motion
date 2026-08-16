import React, { useState } from 'react';
import { Zap, Droplets, Compass, Wifi, ShieldAlert, Layers } from 'lucide-react';
import { audioEngine } from '../audio/SyntheticAudioEngine';

const NETWORKS = [
  { id: 'all', label: 'All Lifelines', icon: Layers, color: '#f5f2ea', desc: 'Holistic overlay of the city’s 5 interdependent urban metabolic systems.' },
  { id: 'power', label: 'Electrical Grid', icon: Zap, color: '#ecc94b', desc: 'High-voltage transmission substations distributing gigawatts of power to cooling and transit.' },
  { id: 'water', label: 'Water Mains', icon: Droplets, color: '#4299e1', desc: 'Pressurized subterranean hydraulic network delivering millions of liters of treated water.' },
  { id: 'transport', label: 'Transit Arteries', icon: Compass, color: '#f59e0b', desc: 'Multi-modal transit loops moving millions of commuters across commercial cores.' },
  { id: 'fiber', label: 'Fiber Telecommunication', icon: Wifi, color: '#f8fafc', desc: 'Underground optical conduits carrying terabits per second of algorithmic routing data.' },
  { id: 'emergency', label: 'Emergency Logistics', icon: ShieldAlert, color: '#f56565', desc: 'Optimized 8-minute response radii from trauma hospitals and fire rescue depots.' },
];

export function NetworkSection({ canvasRef }) {
  const [activeLayer, setActiveLayer] = useState('all');

  const handleSelectLayer = (id) => {
    setActiveLayer(id);
    audioEngine.playClick();
    if (canvasRef.current && canvasRef.current.setNetworkLayer) {
      canvasRef.current.setNetworkLayer(id);
    }
  };

  const currentInfo = NETWORKS.find((n) => n.id === activeLayer) || NETWORKS[0];

  return (
    <section
      id="section-network"
      className="relative min-h-[100dvh] flex flex-col justify-center px-6 md:px-16 py-28 z-10 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
        {/* Left Column: Narrative */}
        <div className="max-w-xl flex flex-col gap-5">
          <div className="scientific-pill">
            <div className="scientific-pill-dot bg-[#48bb78] shadow-[0_0_6px_#48bb78]" />
            <span>SECTION 04 // URBAN METABOLISM</span>
          </div>

          <h2 className="font-serif-editorial text-4xl sm:text-6xl text-[#f5f2ea] font-normal leading-[0.95]">
            What keeps a <br />
            <span className="italic text-[#48bb78]">city alive?</span>
          </h2>

          <p className="font-sans text-[#a6b0c2] text-sm sm:text-base leading-relaxed">
            Beneath building facades lies a dense web of hidden conduits. A modern city is not a static collection of concrete structures, but an active thermodynamic organism sustained by continuous flows of power, clean water, commuters, and data.
          </p>

          {/* Layer Selector Pills */}
          <div className="flex flex-wrap gap-2 pt-2 pointer-events-auto">
            {NETWORKS.map((net) => {
              const Icon = net.icon;
              const isActive = activeLayer === net.id;
              return (
                <button
                  key={net.id}
                  onClick={() => handleSelectLayer(net.id)}
                  onMouseEnter={() => audioEngine.playHover()}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-xs transition-all duration-300 ${
                    isActive
                      ? 'bg-white/15 text-white border border-white/30 shadow-md'
                      : 'bg-white/[0.03] border border-[rgba(245,242,234,0.1)] text-[#a6b0c2] hover:text-white hover:border-white/20'
                  }`}
                  data-cursor="hover"
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: net.color }} />
                  <span>{net.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Layer Inspector Card */}
        <div className="museum-card max-w-md w-full pointer-events-auto">
          <div className="museum-card-inner p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[rgba(245,242,234,0.08)] pb-3">
              <div className="flex items-center gap-2">
                <currentInfo.icon className="w-4 h-4" style={{ color: currentInfo.color }} />
                <span className="font-swiss text-xs font-semibold uppercase tracking-wider text-[#f5f2ea]">
                  INFRASTRUCTURE ISOLATION
                </span>
              </div>
              <span className="scientific-pill text-[8.5px]">LAYER 0{NETWORKS.findIndex((n) => n.id === activeLayer) + 1}</span>
            </div>

            <h3 className="font-serif-editorial text-lg text-[#f5f2ea]">{currentInfo.label}</h3>
            <p className="font-sans text-xs text-[#a6b0c2] leading-relaxed">
              {currentInfo.desc}
            </p>

            <div className="p-3 rounded-lg bg-white/[0.02] border border-[rgba(245,242,234,0.08)] font-mono text-[11px] text-[#a6b0c2] space-y-1">
              <div className="flex justify-between">
                <span>SYSTEM INTERDEPENDENCE:</span>
                <span className="text-[#f5f2ea] font-bold">99.98%</span>
              </div>
              <div className="flex justify-between text-[10px] text-[#647087]">
                <span>Failure in power cascade triggers water pump stoppage within 45 min.</span>
              </div>
            </div>

            <p className="font-mono text-[9.5px] text-[#647087] pt-2 border-t border-[rgba(245,242,234,0.06)] leading-tight">
              * Click any layer above to isolate its volumetric 3D conduits and node pulses.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
