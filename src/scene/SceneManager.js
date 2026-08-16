import * as THREE from 'three';
import { EarthGlobe } from './objects/EarthGlobe';
import { WaterCycleScene } from './objects/WaterCycleScene';
import { UrbanHeatScene } from './objects/UrbanHeatScene';
import { UrbanNetworkScene } from './objects/UrbanNetworkScene';
import { ExtremeEventsScene } from './objects/ExtremeEventsScene';
import { SystemsFeedbackScene } from './objects/SystemsFeedbackScene';
import { SingularityConvergence } from './objects/SingularityConvergence';
import { CameraRig } from './CameraRig';

export class SceneManager {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.width = canvas.clientWidth || window.innerWidth;
    this.height = canvas.clientHeight || window.innerHeight;
    
    // Performance: Cap DPR strictly to 1.25 on high-DPI screens to prevent fill-rate lag
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.25);

    // 1. Core Scene Setup
    this.scene = new THREE.Scene();
    this.scene.background = null;

    // 2. Camera & Choreography Rig
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 80);
    this.cameraRig = new CameraRig(this.camera);

    // 3. WebGL Renderer with High-Performance Settings
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
      precision: 'mediump',
    });
    this.renderer.setSize(this.width, this.height, false);
    this.renderer.setPixelRatio(this.dpr);

    // 4. Museum Lighting Setup (Lightweight)
    this.ambientLight = new THREE.AmbientLight(0xf5f2ea, 0.85);
    this.scene.add(this.ambientLight);

    this.mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
    this.mainLight.position.set(5, 8, 6);
    this.scene.add(this.mainLight);

    // 5. Scientific 3D Instruments
    this.earthGlobe = new EarthGlobe(this.scene);
    this.waterCycle = new WaterCycleScene(this.scene);
    this.urbanHeat = new UrbanHeatScene(this.scene);
    this.urbanNetwork = new UrbanNetworkScene(this.scene);
    this.extremeEvents = new ExtremeEventsScene(this.scene);
    this.systemsFeedback = new SystemsFeedbackScene(this.scene);
    this.singularity = new SingularityConvergence(this.scene);

    // Clock & Performance Tracking
    this.clock = new THREE.Clock();
    this.targetProgress = 0;
    this.currentProgress = 0;
    this.scrollVelocity = 0;
    this.fps = 60;
    this.frameCount = 0;
    this.lastFpsTime = performance.now();

    this.isRunning = false;
    this.rafId = null;

    this.onResize = this.onResize.bind(this);
    window.addEventListener('resize', this.onResize, { passive: true });

    this.start();
  }

  setScrollProgress(progress, velocity = 0) {
    this.targetProgress = progress;
    this.scrollVelocity = velocity;
  }

  setPointer(x, y) {
    this.cameraRig.setPointer(x, y);
    if (this.earthGlobe) this.earthGlobe.setPointer(x, y);
  }

  setGlobalTempAnomaly(val) {
    if (this.earthGlobe) this.earthGlobe.setTempAnomaly(val);
  }

  setWaterStage(index) {
    if (this.waterCycle) this.waterCycle.setStage(index);
  }

  setCityParameters(params) {
    if (this.urbanHeat) this.urbanHeat.setParameters(params);
  }

  setNetworkLayer(layerId) {
    if (this.urbanNetwork) this.urbanNetwork.setIsolatedLayer(layerId);
  }

  setExtremeStress(val) {
    if (this.extremeEvents) this.extremeEvents.setStress(val);
  }

  highlightSystemNode(index) {
    if (this.systemsFeedback) this.systemsFeedback.highlightNode(index);
  }

  onResize() {
    this.width = this.canvas.clientWidth || window.innerWidth;
    this.height = this.canvas.clientHeight || window.innerHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height, false);
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }

  stop() {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  animate() {
    if (!this.isRunning) return;
    this.rafId = requestAnimationFrame(() => this.animate());

    const delta = Math.min(this.clock.getDelta(), 0.05);
    const time = this.clock.getElapsedTime();

    // FPS Meter
    this.frameCount++;
    const now = performance.now();
    if (now - this.lastFpsTime >= 500) {
      this.fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsTime));
      this.frameCount = 0;
      this.lastFpsTime = now;
    }

    // Smooth exponential damping on scroll progress
    this.currentProgress += (this.targetProgress - this.currentProgress) * Math.min(delta * 7.5, 1.0);
    const p = this.currentProgress;
    const v = this.scrollVelocity;

    // Update Camera Rig & Trajectory
    this.cameraRig.update(delta, time, p, v);

    // Section-Gated Selective Updates (Zero CPU waste on invisible sections)
    if (p < 0.32) {
      this.earthGlobe.update(delta, time, p, v);
    } else {
      this.earthGlobe.group.visible = false;
    }

    if (p >= 0.20 && p <= 0.48) {
      this.waterCycle.update(delta, time, p);
    } else {
      this.waterCycle.group.visible = false;
    }

    if (p >= 0.36 && p <= 0.62) {
      this.urbanHeat.update(delta, time, p);
    } else {
      this.urbanHeat.group.visible = false;
    }

    if (p >= 0.50 && p <= 0.76) {
      this.urbanNetwork.update(delta, time, p);
    } else {
      this.urbanNetwork.group.visible = false;
    }

    if (p >= 0.64 && p <= 0.90) {
      this.extremeEvents.update(delta, time, p);
    } else {
      this.extremeEvents.group.visible = false;
    }

    if (p >= 0.76 && p <= 0.96) {
      this.systemsFeedback.update(delta, time, p);
    } else {
      this.systemsFeedback.group.visible = false;
    }

    if (p >= 0.86) {
      this.singularity.update(delta, time, p);
    } else {
      this.singularity.group.visible = false;
    }

    this.renderer.render(this.scene, this.camera);
  }

  getFps() {
    return this.fps;
  }

  dispose() {
    this.stop();
    window.removeEventListener('resize', this.onResize);

    if (this.earthGlobe) this.earthGlobe.dispose();
    if (this.waterCycle) this.waterCycle.dispose();
    if (this.urbanHeat) this.urbanHeat.dispose();
    if (this.urbanNetwork) this.urbanNetwork.dispose();
    if (this.extremeEvents) this.extremeEvents.dispose();
    if (this.systemsFeedback) this.systemsFeedback.dispose();
    if (this.singularity) this.singularity.dispose();

    if (this.renderer) this.renderer.dispose();
  }
}
