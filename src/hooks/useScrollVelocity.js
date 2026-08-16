import { useEffect, useRef } from 'react';
import { audioEngine } from '../audio/SyntheticAudioEngine';

/**
 * High-precision Scroll & Velocity Tracker (Ref-based, zero React re-render overhead)
 */
export function useScrollVelocity() {
  const stateRef = useRef({
    scrollY: 0,
    progress: 0,
    velocity: 0,
    normalizedVelocity: 0,
    previousScroll: 0,
    lastTime: performance.now(),
  });

  useEffect(() => {
    let animId;

    const onScroll = () => {
      stateRef.current.scrollY = window.scrollY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    const updateLoop = (now) => {
      const state = stateRef.current;
      const dt = Math.max((now - state.lastTime) / 1000, 0.001);
      state.lastTime = now;

      const totalScrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      state.progress = Math.min(Math.max(state.scrollY / totalScrollable, 0), 1);

      const instantVelocity = (state.scrollY - state.previousScroll) / dt;
      state.previousScroll = state.scrollY;

      const dampingFactor = Math.min(dt * 8.0, 1.0);
      state.velocity += (instantVelocity - state.velocity) * dampingFactor;
      state.normalizedVelocity = Math.min(Math.abs(state.velocity) / 2500, 1.0);

      // Audio engine update without React state thrashing
      audioEngine.updateScrollTension(state.normalizedVelocity);

      animId = requestAnimationFrame(updateLoop);
    };

    animId = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  return stateRef;
}
