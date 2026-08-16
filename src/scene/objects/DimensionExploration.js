import * as THREE from 'three';

/**
 * 3D Object for Section 2: Dimension Exploration
 * Precision gyroscopic instrument, optical frosted quartz nucleus, and brushed titanium gimbal rings.
 */
export class DimensionExploration {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.position.set(0, -10, 0);

    // 1. Inner Frosted Quartz Nucleus
    const nucleusGeo = new THREE.IcosahedronGeometry(0.85, 4);
    const nucleusMat = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      emissive: 0x1e293b,
      emissiveIntensity: 0.4,
      roughness: 0.12,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    this.nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
    this.group.add(this.nucleus);

    // 2. Gimbal Ring A (Equatorial Brushed Titanium Torus)
    const ringAGeo = new THREE.TorusGeometry(2.2, 0.03, 16, 100);
    const ringMatA = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.95,
      roughness: 0.18,
      emissive: 0x334155,
      emissiveIntensity: 0.2,
    });
    this.ringA = new THREE.Mesh(ringAGeo, ringMatA);
    this.group.add(this.ringA);

    // 3. Gimbal Ring B (Polar Stainless Steel Torus)
    const ringBGeo = new THREE.TorusGeometry(2.7, 0.03, 16, 100);
    const ringMatB = new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      metalness: 0.92,
      roughness: 0.22,
      emissive: 0x1e293b,
      emissiveIntensity: 0.2,
    });
    this.ringB = new THREE.Mesh(ringBGeo, ringMatB);
    this.group.add(this.ringB);

    // 4. Outer Octahedral Crystal Lattice Cage
    const cageGeo = new THREE.OctahedronGeometry(3.4, 2);
    const cageMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      emissive: 0x0f172a,
      emissiveIntensity: 0.1,
    });
    this.cage = new THREE.Mesh(cageGeo, cageMat);
    this.group.add(this.cage);

    // 5. Floating Dimension Marker Nodes
    const nodeCount = 12;
    const nodeGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
    this.nodes = new THREE.InstancedMesh(nodeGeo, nodeMat, nodeCount);
    
    const dummy = new THREE.Object3D();
    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      dummy.position.setFromSphericalCoords(3.4, phi, theta);
      dummy.updateMatrix();
      this.nodes.setMatrixAt(i, dummy.matrix);
    }
    this.nodes.instanceMatrix.needsUpdate = true;
    this.group.add(this.nodes);

    this.scene.add(this.group);

    this.targetPointer = new THREE.Vector2(0, 0);
    this.currentPointer = new THREE.Vector2(0, 0);
  }

  setPointer(x, y) {
    this.targetPointer.set(x, y);
  }

  update(delta, time, scrollProgress, scrollVelocity) {
    this.currentPointer.lerp(this.targetPointer, Math.min(delta * 4.0, 1.0));

    if (scrollProgress >= 0.08 && scrollProgress <= 0.38) {
      this.group.visible = true;

      const localT = (scrollProgress - 0.12) / 0.16;
      const clampedT = Math.min(Math.max(localT, 0), 1);

      const targetY = (1.0 - clampedT) * 3.0 - clampedT * 2.5;
      this.group.position.y = targetY;
      this.group.position.z = -1.0 + Math.sin(clampedT * Math.PI) * 1.5;

      this.ringA.rotation.x = time * 0.6 + clampedT * 3.14 + this.currentPointer.y * 0.4;
      this.ringA.rotation.y = time * 0.3 + this.currentPointer.x * 0.4;

      this.ringB.rotation.y = time * 0.5 - clampedT * 2.0 + this.currentPointer.x * 0.5;
      this.ringB.rotation.z = time * 0.4 + this.currentPointer.y * 0.3;

      this.cage.rotation.x = -time * 0.2;
      this.cage.rotation.y = time * 0.18;

      const pulse = 1.0 + Math.sin(time * 3.0) * 0.05;
      this.nucleus.scale.set(pulse, pulse, pulse);
      this.nucleus.rotation.y = time * 0.8;
    } else {
      this.group.visible = false;
    }
  }

  dispose() {
    this.scene.remove(this.group);
    this.nucleus.geometry.dispose();
    this.nucleus.material.dispose();
    this.ringA.geometry.dispose();
    this.ringA.material.dispose();
    this.ringB.geometry.dispose();
    this.ringB.material.dispose();
    this.cage.geometry.dispose();
    this.cage.material.dispose();
    this.nodes.geometry.dispose();
    this.nodes.material.dispose();
  }
}
