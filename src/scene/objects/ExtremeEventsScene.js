import * as THREE from 'three';

/**
 * 3D Multi-Hazard Compounding Stress Instrument (Section 5: Extreme Events) - High Performance
 */
export class ExtremeEventsScene {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.position.set(0.8, -0.6, 0);

    this.stressLevel = 0.5;

    // 1. Optimized Topographical Terrain (16x16 geometry)
    const terrainGeo = new THREE.PlaneGeometry(6.5, 6.5, 16, 16);
    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = Math.sin(x * 1.2) * Math.cos(y * 1.2) * 0.45 + (x * 0.12);
      pos.setZ(i, z);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x181a24,
      roughness: 0.85,
      metalness: 0.1,
    });
    this.terrain = new THREE.Mesh(terrainGeo, terrainMat);
    this.terrain.rotation.x = -Math.PI / 2.3;
    this.group.add(this.terrain);

    // 2. High-Wind Particle Vector Field (Optimized count: 250)
    this.windParticleCount = 250;
    this.windGeo = new THREE.BufferGeometry();
    const windPositions = new Float32Array(this.windParticleCount * 3);
    const windSpeeds = new Float32Array(this.windParticleCount);

    for (let i = 0; i < this.windParticleCount; i++) {
      const i3 = i * 3;
      windPositions[i3] = (Math.random() - 0.5) * 5.0;
      windPositions[i3 + 1] = Math.random() * 1.8;
      windPositions[i3 + 2] = (Math.random() - 0.5) * 5.0;
      windSpeeds[i] = Math.random() * 1.5 + 1.0;
    }

    this.windGeo.setAttribute('position', new THREE.BufferAttribute(windPositions, 3));
    this.windSpeeds = windSpeeds;

    const windMat = new THREE.PointsMaterial({
      color: 0xf5f2ea,
      size: 0.05,
      transparent: true,
      opacity: 0.65,
    });
    this.windParticles = new THREE.Points(this.windGeo, windMat);
    this.group.add(this.windParticles);

    // 3. Thermal Heat Dome Canopy Wireframe
    const domeGeo = new THREE.SphereGeometry(3.0, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshBasicMaterial({
      color: 0xd9532f,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    this.heatDome = new THREE.Mesh(domeGeo, domeMat);
    this.group.add(this.heatDome);

    // 4. Wildfire Risk Contour Ribbon
    const fireCurve = new THREE.EllipseCurve(0, 0, 1.8, 1.4, 0, 2 * Math.PI, false, 0);
    const firePts = fireCurve.getPoints(36);
    const fireGeo = new THREE.BufferGeometry().setFromPoints(firePts);
    const fireMat = new THREE.LineDashedMaterial({
      color: 0xf56565,
      dashSize: 0.2,
      gapSize: 0.1,
      transparent: true,
      opacity: 0.8,
    });
    this.firePerimeter = new THREE.Line(fireGeo, fireMat);
    this.firePerimeter.computeLineDistances();
    this.firePerimeter.rotation.x = Math.PI / 2;
    this.firePerimeter.position.set(0.6, 0.4, 0);
    this.group.add(this.firePerimeter);

    this.scene.add(this.group);
  }

  setStress(stress) {
    this.stressLevel = stress;
    this.heatDome.material.opacity = 0.15 + stress * 0.45;
  }

  update(delta, time, scrollProgress) {
    if (scrollProgress >= 0.66 && scrollProgress <= 0.88) {
      this.group.visible = true;

      const posArray = this.windGeo.attributes.position.array;
      const speedMultiplier = 1.0 + this.stressLevel * 2.5;
      const count = this.windParticleCount;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        posArray[i3] += delta * this.windSpeeds[i] * speedMultiplier;
        if (posArray[i3] > 2.5) {
          posArray[i3] = -2.5;
        }
      }
      this.windGeo.attributes.position.needsUpdate = true;
    } else {
      this.group.visible = false;
    }
  }

  dispose() {
    this.scene.remove(this.group);
    this.terrain.geometry.dispose();
    this.terrain.material.dispose();
    this.windGeo.dispose();
    this.windParticles.material.dispose();
    this.heatDome.geometry.dispose();
    this.heatDome.material.dispose();
    this.firePerimeter.geometry.dispose();
    this.firePerimeter.material.dispose();
  }
}
