import * as THREE from 'three';
import { earthThermalVertexShader, earthThermalFragmentShader } from '../../shaders/earthThermalShader';

/**
 * 3D Scientific Earth Instrument (Ultra-Optimized)
 * Explains global thermodynamic latitude distribution, Hadley/Ferrel circulation cells, and polar amplification.
 */
export class EarthGlobe {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.position.set(0, 0, 0);

    // 1. Optimized Earth Thermal Globe Mesh
    this.geometry = new THREE.SphereGeometry(2.2, 36, 36);
    this.uniforms = {
      uTime: { value: 0 },
      uTempAnomaly: { value: 1.4 },
      uPointer: { value: new THREE.Vector2(0, 0) },
    };

    this.material = new THREE.ShaderMaterial({
      vertexShader: earthThermalVertexShader,
      fragmentShader: earthThermalFragmentShader,
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: true,
    });

    this.globe = new THREE.Mesh(this.geometry, this.material);
    this.group.add(this.globe);

    // 2. Graticules & Equator/Tropic Rings (Lightweight LineLoops)
    const createMarkerRing = (radius, yPos, color, opacity = 0.3) => {
      const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2 * Math.PI, false, 0);
      const pts = curve.getPoints(36);
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
      const ring = new THREE.LineLoop(geo, mat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = yPos;
      return ring;
    };

    this.equatorRing = createMarkerRing(2.25, 0, 0xd9532f, 0.5);
    this.cancerRing = createMarkerRing(2.05, 0.88, 0xf5f2ea, 0.2);
    this.capricornRing = createMarkerRing(2.05, -0.88, 0xf5f2ea, 0.2);
    this.group.add(this.equatorRing);
    this.group.add(this.cancerRing);
    this.group.add(this.capricornRing);

    // 3. Atmospheric Circulation Streamlines (Hadley, Ferrel, Polar Wind Bands)
    this.streamlines = new THREE.Group();
    const bandCount = 8;
    for (let i = 0; i < bandCount; i++) {
      const latAngle = ((i / (bandCount - 1)) - 0.5) * Math.PI * 0.82;
      const r = Math.cos(latAngle) * 2.36;
      const y = Math.sin(latAngle) * 2.36;
      const curve = new THREE.EllipseCurve(0, 0, r, r, 0, 2 * Math.PI, false, 0);
      const pts = curve.getPoints(36);
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineDashedMaterial({
        color: Math.abs(latAngle) < 0.4 ? 0xd9532f : 0x4299e1,
        transparent: true,
        opacity: 0.35,
        dashSize: 0.3,
        gapSize: 0.2,
      });
      const line = new THREE.Line(geo, mat);
      line.computeLineDistances();
      line.rotation.x = Math.PI / 2;
      line.position.y = y;
      line.userData = { speed: (i % 2 === 0 ? 0.3 : -0.25) * (1.0 + Math.abs(latAngle)) };
      this.streamlines.add(line);
    }
    this.group.add(this.streamlines);

    this.scene.add(this.group);
    this.targetPointer = new THREE.Vector2(0, 0);
    this.currentPointer = new THREE.Vector2(0, 0);
  }

  setPointer(x, y) {
    this.targetPointer.set(x, y);
  }

  setTempAnomaly(temp) {
    this.uniforms.uTempAnomaly.value = temp;
  }

  update(delta, time, scrollProgress, scrollVelocity) {
    if (scrollProgress < 0.30) {
      this.group.visible = true;
      this.currentPointer.lerp(this.targetPointer, Math.min(delta * 4.0, 1.0));
      this.uniforms.uTime.value = time;
      this.uniforms.uPointer.value.copy(this.currentPointer);

      this.globe.rotation.y = time * 0.1 + this.currentPointer.x * 0.25;
      this.globe.rotation.x = 0.2 + this.currentPointer.y * 0.15;

      // Rotate circulation wind bands
      const speedMult = 1.0 + this.uniforms.uTempAnomaly.value * 0.25;
      for (let i = 0; i < this.streamlines.children.length; i++) {
        const line = this.streamlines.children[i];
        line.rotation.z += line.userData.speed * delta * speedMult;
      }

      if (scrollProgress < 0.12) {
        this.group.position.set(0, 0, 0);
        const s = 0.95 + scrollProgress * 1.5;
        this.group.scale.set(s, s, s);
      } else {
        const t = (scrollProgress - 0.12) / 0.14;
        const clampedT = Math.min(Math.max(t, 0), 1);
        this.group.position.x = clampedT * 1.2;
        this.group.position.y = -clampedT * 0.2;
        const s = 1.15 - clampedT * 0.2;
        this.group.scale.set(s, s, s);
      }
    } else {
      this.group.visible = false;
    }
  }

  dispose() {
    this.scene.remove(this.group);
    this.geometry.dispose();
    this.material.dispose();
  }
}
