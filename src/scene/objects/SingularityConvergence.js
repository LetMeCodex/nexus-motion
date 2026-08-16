import * as THREE from 'three';

/**
 * 3D Singularity Convergence for Section 7: Final Transformation (High Performance)
 */
export class SingularityConvergence {
  constructor(scene, count = 400) {
    this.scene = scene;
    this.count = count;
    this.group = new THREE.Group();
    this.group.position.set(0, 0, 0);

    // 1. Incandescent Gravitational Core
    const coreGeo = new THREE.SphereGeometry(0.4, 20, 20);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });
    this.singularityPoint = new THREE.Mesh(coreGeo, coreMat);
    this.group.add(this.singularityPoint);

    // Platinum Photon Sphere Ring
    const photonGeo = new THREE.RingGeometry(0.65, 1.0, 36);
    const photonMat = new THREE.MeshBasicMaterial({
      color: 0xf8fafc,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    this.photonRing = new THREE.Mesh(photonGeo, photonMat);
    this.photonRing.rotation.x = Math.PI / 2.2;
    this.group.add(this.photonRing);

    // 2. Gravitational Inflow Dust (400 particles)
    this.particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const originalDistances = new Float32Array(count);
    const angles = new Float32Array(count);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const dist = Math.random() * 6.0 + 0.8;
      const angle = Math.random() * Math.PI * 2.0;
      const y = (Math.random() - 0.5) * 1.5 * (dist / 6.0);

      positions[i3] = Math.cos(angle) * dist;
      positions[i3 + 1] = y;
      positions[i3 + 2] = Math.sin(angle) * dist;

      originalDistances[i] = dist;
      angles[i] = angle;
      speeds[i] = Math.random() * 1.2 + 0.6;
    }

    this.particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.originalDistances = originalDistances;
    this.angles = angles;
    this.speeds = speeds;

    const particleMat = new THREE.PointsMaterial({
      color: 0xe2e8f0,
      size: 0.06,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    this.particles = new THREE.Points(this.particleGeo, particleMat);
    this.group.add(this.particles);

    this.scene.add(this.group);
  }

  update(delta, time, scrollProgress) {
    if (scrollProgress >= 0.88) {
      this.group.visible = true;

      const localT = (scrollProgress - 0.90) / 0.10;
      const clampedT = Math.min(Math.max(localT, 0), 1);
      const collapseFactor = THREE.MathUtils.lerp(1.1, 0.25, clampedT);

      this.photonRing.rotation.z = time * 1.5;

      const posAttr = this.particleGeo.attributes.position;
      const posArray = posAttr.array;
      const count = this.count;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        let currentDist = this.originalDistances[i] * collapseFactor;
        this.angles[i] += (delta * (3.0 / Math.max(currentDist, 0.4))) * this.speeds[i];

        posArray[i3] = Math.cos(this.angles[i]) * currentDist;
        posArray[i3 + 2] = Math.sin(this.angles[i]) * currentDist;
      }
      posAttr.needsUpdate = true;
    } else {
      this.group.visible = false;
    }
  }

  dispose() {
    this.scene.remove(this.group);
    this.singularityPoint.geometry.dispose();
    this.singularityPoint.material.dispose();
    this.photonRing.geometry.dispose();
    this.photonRing.material.dispose();
    this.particleGeo.dispose();
    this.particles.material.dispose();
  }
}
