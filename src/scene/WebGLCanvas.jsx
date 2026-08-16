import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { SceneManager } from './SceneManager';
import { useDeviceTier } from '../hooks/useDeviceTier';

/**
 * WebGLCanvas - React component bridging DOM events and the Three.js SceneManager
 */
export const WebGLCanvas = forwardRef((props, ref) => {
  const canvasRef = useRef(null);
  const managerRef = useRef(null);
  const tier = useDeviceTier();

  useImperativeHandle(ref, () => ({
    setScrollProgress: (progress, velocity) => {
      if (managerRef.current) managerRef.current.setScrollProgress(progress, velocity);
    },
    setPointer: (x, y) => {
      if (managerRef.current) managerRef.current.setPointer(x, y);
    },
    setGlobalTempAnomaly: (val) => {
      if (managerRef.current) managerRef.current.setGlobalTempAnomaly(val);
    },
    setWaterStage: (index) => {
      if (managerRef.current) managerRef.current.setWaterStage(index);
    },
    setCityParameters: (params) => {
      if (managerRef.current) managerRef.current.setCityParameters(params);
    },
    setNetworkLayer: (layerId) => {
      if (managerRef.current) managerRef.current.setNetworkLayer(layerId);
    },
    setExtremeStress: (val) => {
      if (managerRef.current) managerRef.current.setExtremeStress(val);
    },
    highlightSystemNode: (index) => {
      if (managerRef.current) managerRef.current.highlightSystemNode(index);
    },
    getFps: () => (managerRef.current ? managerRef.current.getFps() : 60),
  }));

  useEffect(() => {
    if (!canvasRef.current) return;

    let manager = null;
    try {
      manager = new SceneManager(canvasRef.current, tier);
      managerRef.current = manager;
    } catch (err) {
      console.warn('Could not initialize WebGL SceneManager:', err);
    }

    return () => {
      if (manager) {
        manager.dispose();
      }
      managerRef.current = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ display: 'block' }}
    />
  );
});

WebGLCanvas.displayName = 'WebGLCanvas';
