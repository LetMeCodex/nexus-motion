import React, { useState, useEffect } from 'react';
import { Compass, Sparkles } from 'lucide-react';
import { audioEngine } from '../audio/SyntheticAudioEngine';

export function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const logs = [
    'CALIBRATING WEBGL CONTEXT & ACES TONEMAP...',
    'SYNTHESIZING 40,000 GPU FIBONACCI VECTORS...',
    'COMPILING SIMPLEX NOISE GLSL SHADERS...',
    'ALIGNING KEPLERIAN ORBITAL VELOCITIES...',
    'INITIALIZING 7-DIMENSIONAL CONTINUUM...',
  ];

  useEffect(() => {
    // Fast automatic progress sequence
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 12) + 8;
        if (next > 20 && next < 40) setLogIndex(1);
        else if (next >= 40 && next < 65) setLogIndex(2);
        else if (next >= 65 && next < 85) setLogIndex(3);
        else if (next >= 85) setLogIndex(4);
        return Math.min(next, 100);
      });
    }, 35);

    // Auto dismiss as soon as progress reaches 100% or after 800ms
    const autoDismiss = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => {
        onComplete();
      }, 500);
    }, 750);

    return () => {
      clearInterval(timer);
      clearTimeout(autoDismiss);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#040407] flex flex-col items-center justify-center px-6 transition-all duration-500 ${
        isFading ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="max-w-md w-full flex flex-col items-center text-center gap-6">
        {/* Animated Brand Core */}
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center animate-pulse">
            <Compass className="w-7 h-7 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-ping" />
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1">
          <h1 className="font-display font-bold text-2xl tracking-tight text-white flex items-center justify-center gap-2">
            NEXUS <span className="text-cyan-400 font-mono text-lg">// MOTION</span>
          </h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">
            Intelligent Dimensional Continuum
          </p>
        </div>

        {/* Progress Bar & Numerical Counter */}
        <div className="w-full flex flex-col gap-2">
          <div className="flex items-center justify-between font-mono text-xs text-cyan-400">
            <span className="text-[10px] tracking-wider text-neutral-400">INITIALIZING</span>
            <span className="font-bold">{progress}%</span>
          </div>

          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-amber-400 rounded-full transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Real-time Loading Subtext */}
          <div className="h-5 flex items-center justify-center">
            <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-wider animate-pulse">
              {logs[logIndex]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
