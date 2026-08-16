import * as THREE from 'three';

/**
 * 3D Hydrological Engine Instrument (Section 2: Water) - High Performance
 * Models closed-loop water cycle: Ocean -> Evaporation -> Condensation -> Precipitation -> River Runoff -> Ocean.
 */
export class WaterCycleScene {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.position.set(0, 0, 0);

    this.activeStage = null;

    // 1. Mountain Watershed Terrain (Optimized 20x16 geometry)
    const terrainGeo = new THREE.PlaneGeometry(8, 6, 20, 16);
    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const height = Math.max((x + 3.0) * 0.45, 0.0) + Math.sin(x * 1.5) * Math.cos(y * 1.5) * 0.35;
      pos.setZ(i, height);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x1a242f,
      roughness: 0.8,
      metalness: 0.1,
    });
    this.terrain = new THREE.Mesh(terrainGeo, terrainMat);
    this.terrain.rotation.x = -Math.PI / 2.5;
    this.terrain.position.set(0, -1.2, 0);
    this.group.add(this.terrain);

    // Terrain Wireframe Contour Overlay
    const terrainWireMat = new THREE.MeshBasicMaterial({
      color: 0x4299e1,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    this.terrainWire = new THREE.Mesh(terrainGeo, terrainWireMat);
    this.terrainWire.rotation.copy(this.terrain.rotation);
    this.terrainWire.position.copy(this.terrain.position);
    this.group.add(this.terrainWire);

    // 2. Ocean Basin Surface (Left Side)
    const oceanGeo = new THREE.PlaneGeometry(4, 5, 8, 8);
    const oceanMat = new THREE.MeshStandardMaterial({
      color: 0x1a365d,
      roughness: 0.1,
      metalness: 0.7,
      transparent: true,
      opacity: 0.88,
    });
    this.ocean = new THREE.Mesh(oceanGeo, oceanMat);
    this.ocean.rotation.x = -Math.PI / 2.5;
    this.ocean.position.set(-2.2, -1.2, 0.5);
    this.group.add(this.ocean);

    // 3. Cloud (Condensation Zone aloft)
    this.cloudGroup = new THREE.Group();
    const cloudGeo = new THREE.DodecahedronGeometry(0.45, 0);
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xf5f2ea,
      roughness: 0.9,
      transparent: true,
      opacity: 0.65,
    });
    for (let c = 0; c < 4; c++) {
      const puff = new THREE.Mesh(cloudGeo, cloudMat);
      puff.position.set(0.8 + (c - 1.5) * 0.7, 1.8 + Math.sin(c) * 0.15, -0.5);
      puff.scale.set(1.1, 0.6, 0.8);
      this.cloudGroup.add(puff);
    }
    this.group.add(this.cloudGroup);

    // 4. Closed-Loop Water Particle Stream (Optimized count: 300)
    this.particleCount = 300;
    this.particlesGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(this.particleCount * 3);
    const particleProgress = new Float32Array(this.particleCount);
    const particleSpeeds = new Float32Array(this.particleCount);

    for (let i = 0; i < this.particleCount; i++) {
      particleProgress[i] = Math.random();
      particleSpeeds[i] = 0.08 + Math.random() * 0.06;
    }

    this.particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    this.particleProgress = particleProgress;
    this.particleSpeeds = particleSpeeds;

    const particlesMat = new THREE.PointsMaterial({
      color: 0x63b3ed,
      size: 0.06,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    this.particleSystem = new THREE.Points(this.particlesGeo, particlesMat);
    this.group.add(this.particleSystem);

    this.scene.add(this.group);
  }

  setStage(stageIndex) {
    this.activeStage = stageIndex;
  }

  update(delta, time, scrollProgress) {
    // Only compute when visible (0.24 to 0.44)
    if (scrollProgress >= 0.22 && scrollProgress <= 0.46) {
      this.group.visible = true;

      const posArray = this.particlesGeo.attributes.position.array;
      const count = this.particleCount;

      for (let i = 0; i < count; i++) {
        let p = (this.particleProgress[i] + delta * this.particleSpeeds[i]) % 1.0;
        this.particleProgress[i] = p;

        let x = 0, y = 0, z = 0;
        const jitter = Math.sin(i * 9.9 + time * 1.5) * 0.12;

        if (p < 0.25) {
          const t = p * 4.0;
          x = -2.5 + t * 3.0 + jitter;
          y = -0.8 + t * 2.6;
          z = jitter;
        } else if (p < 0.5) {
          const t = (p - 0.25) * 4.0;
          x = 0.5 + t * 2.0 + jitter;
          y = 1.8 + Math.sin(t * Math.PI) * 0.2;
          z = -0.5 + jitter;
        } else if (p < 0.75) {
          const t = (p - 0.5) * 4.0;
          x = 2.5 + jitter * 0.5;
          y = 1.8 - t * 1.6;
          z = -0.5 + t * 0.7;
        } else {
          const t = (p - 0.75) * 4.0;
          x = 2.5 - t * 5.0 + Math.sin(t * 8.0) * 0.2;
          y = 0.2 - t * 1.0;
          z = 0.2 + t * 0.3;
        }

        const i3 = i * 3;
        posArray[i3] = x;
        posArray[i3 + 1] = y;
        posArray[i3 + 2] = z;
      }
      this.particlesGeo.attributes.position.needsUpdate = true;
      this.cloudGroup.position.x = Math.sin(time * 0.4) * 0.15;
    } else {
      this.group.visible = false;
    }
  }

  dispose() {
    this.scene.remove(this.group);
    this.terrain.geometry.dispose();
    this.terrain.material.dispose();
    this.terrainWire.material.dispose();
    this.ocean.geometry.dispose();
    this.ocean.material.dispose();
    this.particlesGeo.dispose();
    this.particleSystem.material.dispose();
  }
}
