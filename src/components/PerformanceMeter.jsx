import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { useDeviceTier } from '../hooks/useDeviceTier';

export function PerformanceMeter({ canvasRef }) {
  const tier = useDeviceTier();
  const [fps, setFps] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      if (canvasRef.current && canvasRef.current.getFps) {
        setFps(canvasRef.current.getFps());
      }
    }, 400);
    return () => clearInterval(interval);
  }, [canvasRef]);

  return (
    <div className="fixed bottom-6 right-6 z-30 pointer-events-none hidden lg:block">
      <div className="bg-[#0b0b10]/70 backdrop-blur-xl border border-white/8 rounded-full px-3 py-1.5 flex items-center gap-3 font-mono text-[9.5px] text-neutral-400 shadow-md">
        <div className="flex items-center gap-1.5">
          <Zap className="w-3 h-3 text-slate-300" />
          <span className="font-semibold text-slate-200">{fps} FPS</span>
        </div>
        <span className="text-white/15">|</span>
        <div className="flex items-center gap-1">
          <span className="text-neutral-400">GPU BUFFER:</span>
          <span className="text-slate-300">{(tier.maxParticles / 1000).toFixed(0)}k</span>
        </div>
        <span className="text-white/15">|</span>
        <div className="flex items-center gap-1">
          <span className="text-neutral-400">DPR:</span>
          <span className="text-slate-300">{tier.dpr.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}
