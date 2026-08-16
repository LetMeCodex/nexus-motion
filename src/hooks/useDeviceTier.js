import { useState, useEffect } from 'react';

/**
 * Hook to detect device capability, hardware tier, and accessibility preferences
 */
export function useDeviceTier() {
  const [tier, setTier] = useState({
    isMobile: false,
    isLowPower: false,
    reducedMotion: false,
    dpr: 1.5,
    maxParticles: 35000,
    deviceMemory: 8,
    hardwareConcurrency: 8,
  });

  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const memory = navigator.deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;

    const isLowPower = memory < 4 || cores < 4 || isMobile;
    
    // Pixel ratio capping (benchmark safeguard)
    const targetDpr = isMobile ? Math.min(window.devicePixelRatio, 1.25) : Math.min(window.devicePixelRatio, 2.0);
    const particleBudget = isLowPower ? 12000 : (isMobile ? 20000 : 38000);

    setTier({
      isMobile,
      isLowPower,
      reducedMotion,
      dpr: targetDpr,
      maxParticles: particleBudget,
      deviceMemory: memory,
      hardwareConcurrency: cores,
    });

    const handleResize = () => {
      const mobileCheck = window.innerWidth < 768;
      setTier(prev => ({
        ...prev,
        isMobile: mobileCheck,
        dpr: mobileCheck ? Math.min(window.devicePixelRatio, 1.25) : Math.min(window.devicePixelRatio, 2.0),
        maxParticles: mobileCheck ? 20000 : (prev.isLowPower ? 12000 : 38000),
      }));
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return tier;
}
