import * as THREE from 'three';

/**
 * 3D Orbital Scene for Section 4: Keplerian Multi-Body Dynamics
 * Central glowing incandescent core with 4 fine platinum orbital rings, relativistic trails, and precision satellites.
 */
export class OrbitalSystem {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.position.set(0, 0, 0);

    // 1. Central Incandescent Core
    const starGeo = new THREE.SphereGeometry(0.9, 32, 32);
    const starMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });
    this.centralStar = new THREE.Mesh(starGeo, starMat);
    this.group.add(this.centralStar);

    // Subtle Titanium Coronal Halo
    const coronaGeo = new THREE.SphereGeometry(1.25, 32, 32);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xe2e8f0,
      transparent: true,
      opacity: 0.18,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    this.corona = new THREE.Mesh(coronaGeo, coronaMat);
    this.group.add(this.corona);

    this.starLight = new THREE.PointLight(0xfffbeb, 3.0, 16);
    this.group.add(this.starLight);

    // 2. Multi-tier Keplerian Orbital Tiers (Calibrated Platinum & Steel)
    this.orbits = [
      { radius: 2.4, speed: 1.4, incX: 0.25, incZ: 0.1, color: 0xf8fafc, size: 0.16, phase: 0 },
      { radius: 3.8, speed: 0.95, incX: -0.35, incZ: 0.2, color: 0xe2e8f0, size: 0.22, phase: 1.5 },
      { radius: 5.4, speed: 0.65, incX: 0.45, incZ: -0.3, color: 0xcbd5e1, size: 0.25, phase: 3.2 },
      { radius: 7.2, speed: 0.45, incX: -0.15, incZ: -0.4, color: 0x94a3b8, size: 0.20, phase: 4.8 },
    ];

    this.orbitMeshes = [];

    this.orbits.forEach((orbit, index) => {
      const curve = new THREE.EllipseCurve(
        0, 0,
        orbit.radius, orbit.radius,
        0, 2 * Math.PI,
        false,
        0
      );
      const points = curve.getPoints(120);
      const trailGeo = new THREE.BufferGeometry().setFromPoints(points);
      const trailMat = new THREE.LineBasicMaterial({
        color: orbit.color,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending,
      });

      const trailLine = new THREE.Line(trailGeo, trailMat);
      trailLine.rotation.x = Math.PI / 2 + orbit.incX;
      trailLine.rotation.z = orbit.incZ;
      this.group.add(trailLine);

      let satGeo;
      if (index === 0) satGeo = new THREE.IcosahedronGeometry(orbit.size, 2);
      else if (index === 1) satGeo = new THREE.OctahedronGeometry(orbit.size, 1);
      else if (index === 2) satGeo = new THREE.TorusGeometry(orbit.size, orbit.size * 0.35, 12, 24);
      else satGeo = new THREE.DodecahedronGeometry(orbit.size, 0);

      const satMat = new THREE.MeshStandardMaterial({
        color: orbit.color,
        emissive: 0x1e293b,
        emissiveIntensity: 0.3,
        metalness: 0.9,
        roughness: 0.18,
      });

      const satellite = new THREE.Mesh(satGeo, satMat);
      this.group.add(satellite);

      this.orbitMeshes.push({
        orbit,
        trailLine,
        satellite,
      });
    });

    this.scene.add(this.group);
    this.targetPointer = new THREE.Vector2(0, 0);
    this.currentPointer = new THREE.Vector2(0, 0);
  }

  setPointer(x, y) {
    this.targetPointer.set(x, y);
  }

  update(delta, time, scrollProgress, scrollVelocity) {
    this.currentPointer.lerp(this.targetPointer, Math.min(delta * 4.0, 1.0));

    if (scrollProgress >= 0.38 && scrollProgress <= 0.68) {
      this.group.visible = true;

      const localT = (scrollProgress - 0.42) / 0.20;
      const clampedT = Math.min(Math.max(localT, 0), 1);

      const scale = 0.85 + clampedT * 0.4;
      this.group.scale.set(scale, scale, scale);

      const velocityMultiplier = 1.0 + Math.min(Math.abs(scrollVelocity) * 0.0012, 3.0);

      const starPulse = 1.0 + Math.sin(time * 2.5) * 0.04;
      this.centralStar.scale.set(starPulse, starPulse, starPulse);
      this.corona.scale.set(starPulse * 1.06, starPulse * 1.06, starPulse * 1.06);

      this.orbitMeshes.forEach(({ orbit, trailLine, satellite }) => {
        const currentAngle = (time * orbit.speed * velocityMultiplier) + orbit.phase;
        
        const localX = Math.cos(currentAngle) * orbit.radius;
        const localY = Math.sin(currentAngle) * orbit.radius;

        const pos = new THREE.Vector3(localX, 0, localY);
        pos.applyAxisAngle(new THREE.Vector3(1, 0, 0), orbit.incX);
        pos.applyAxisAngle(new THREE.Vector3(0, 0, 1), orbit.incZ);

        satellite.position.copy(pos);

        satellite.rotation.x = time * 1.5;
        satellite.rotation.y = time * 2.0;

        trailLine.material.opacity = 0.25 + (velocityMultiplier - 1.0) * 0.12;
      });

      this.group.rotation.x = this.currentPointer.y * 0.2;
      this.group.rotation.y = time * 0.04 + this.currentPointer.x * 0.3;
    } else {
      this.group.visible = false;
    }
  }

  dispose() {
    this.scene.remove(this.group);
    this.centralStar.geometry.dispose();
    this.centralStar.material.dispose();
    this.corona.geometry.dispose();
    this.corona.material.dispose();
    this.orbitMeshes.forEach(({ trailLine, satellite }) => {
      trailLine.geometry.dispose();
      trailLine.material.dispose();
      satellite.geometry.dispose();
      satellite.material.dispose();
    });
  }
}
