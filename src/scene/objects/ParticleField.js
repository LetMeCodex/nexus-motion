import * as THREE from 'three';
import { particleVertexShader, particleFragmentShader } from '../../shaders/particleShader';

/**
 * 3D Particle System for Section 3: Quantum Particle Field
 * 25,000 - 38,000 GPU points morphing smoothly across 4 distinct mathematical formations:
 * A: Fibonacci Sphere | B: Double-Arm Spiral Galaxy | C: Cyber Matrix Grid | D: Exploded Quantum Nebula
 */
export class ParticleField {
  constructor(scene, count = 32000) {
    this.scene = scene;
    this.count = count;
    this.activeFormationIndex = 0;
    this.targetFormationIndex = 0;
    this.formationTransition = 0;

    this.geometry = new THREE.BufferGeometry();

    const positionsA = new Float32Array(count * 3);
    const positionsB = new Float32Array(count * 3);
    const positionsC = new Float32Array(count * 3);
    const positionsD = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    // High-end monochromatic & titanium color palette
    const colorPalette = [
      new THREE.Color(0xf8fafc), // Titanium White
      new THREE.Color(0xe2e8f0), // Platinum
      new THREE.Color(0x94a3b8), // Cool Slate
      new THREE.Color(0xfde68a), // Champagne Dust
      new THREE.Color(0xcbd5e1), // Pale Steel
    ];

    const gridSize = Math.cbrt(count) | 0;
    const gridSpacing = 0.35;
    const gridOffset = (gridSize * gridSpacing) / 2;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // FORMATION A: Fibonacci Lattice Sphere
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const sphereRadius = 3.8 + (Math.random() - 0.5) * 0.3;
      positionsA[i3] = sphereRadius * Math.sin(phi) * Math.cos(theta);
      positionsA[i3 + 1] = sphereRadius * Math.sin(phi) * Math.sin(theta);
      positionsA[i3 + 2] = sphereRadius * Math.cos(phi);

      // FORMATION B: Double-Arm Logarithmic Spiral Galaxy
      const arm = i % 2;
      const armOffset = (arm * Math.PI);
      const distFromCenter = Math.pow(Math.random(), 1.5) * 6.5 + 0.3;
      const spinAngle = distFromCenter * 1.6 + armOffset;
      const spreadX = (Math.random() - 0.5) * (0.6 / (distFromCenter + 0.5));
      const spreadY = (Math.random() - 0.5) * 0.3 * (1.0 / (distFromCenter * 0.5 + 1.0));
      const spreadZ = (Math.random() - 0.5) * (0.6 / (distFromCenter + 0.5));

      positionsB[i3] = Math.cos(spinAngle) * distFromCenter + spreadX;
      positionsB[i3 + 1] = spreadY;
      positionsB[i3 + 2] = Math.sin(spinAngle) * distFromCenter + spreadZ;

      // FORMATION C: Cyber Matrix Grid
      const gx = i % gridSize;
      const gy = Math.floor(i / gridSize) % gridSize;
      const gz = Math.floor(i / (gridSize * gridSize));
      positionsC[i3] = gx * gridSpacing - gridOffset + (Math.random() - 0.5) * 0.04;
      positionsC[i3 + 1] = gy * gridSpacing - gridOffset + (Math.random() - 0.5) * 0.04;
      positionsC[i3 + 2] = gz * gridSpacing - gridOffset + (Math.random() - 0.5) * 0.04;

      // FORMATION D: Exploded Quantum Nebula Field
      const explodeDist = Math.random() * 8.5 + 1.0;
      const u = Math.random();
      const v = Math.random();
      const expTheta = u * 2.0 * Math.PI;
      const expPhi = Math.acos(2.0 * v - 1.0);
      positionsD[i3] = explodeDist * Math.sin(expPhi) * Math.cos(expTheta);
      positionsD[i3 + 1] = explodeDist * Math.sin(expPhi) * Math.sin(expTheta);
      positionsD[i3 + 2] = explodeDist * Math.cos(expPhi);

      // Scales & Colors
      scales[i] = Math.random() * 0.7 + 0.3;
      const selectedColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i3] = selectedColor.r;
      colors[i3 + 1] = selectedColor.g;
      colors[i3 + 2] = selectedColor.b;
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(positionsA, 3));
    this.geometry.setAttribute('aPositionB', new THREE.BufferAttribute(positionsB, 3));
    this.geometry.setAttribute('aPositionC', new THREE.BufferAttribute(positionsC, 3));
    this.geometry.setAttribute('aPositionD', new THREE.BufferAttribute(positionsD, 3));
    this.geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    this.geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));

    this.uniforms = {
      uTime: { value: 0 },
      uSize: { value: 20.0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2.0) },
      uMorphA: { value: 1.0 },
      uMorphB: { value: 0.0 },
      uMorphC: { value: 0.0 },
      uMorphD: { value: 0.0 },
      uPointer: { value: new THREE.Vector3(0, 0, 0) },
      uPointerRadius: { value: 2.4 },
      uPointerStrength: { value: 0.5 },
      uScrollVelocity: { value: 0 },
      uColorA: { value: new THREE.Color(0xf8fafc) },
      uColorB: { value: new THREE.Color(0xe2e8f0) },
    };

    this.material = new THREE.ShaderMaterial({
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.points = new THREE.Points(this.geometry, this.material);
    this.points.position.set(0, 0, 0);
    this.scene.add(this.points);

    this.targetPointer = new THREE.Vector3(0, 0, 0);
  }

  setPointer(x, y, z = 0) {
    this.targetPointer.set(x * 5.0, y * 5.0, z);
  }

  setFormation(index) {
    this.targetFormationIndex = index;
  }

  update(delta, time, scrollProgress, scrollVelocity) {
    this.uniforms.uTime.value = time;
    this.uniforms.uScrollVelocity.value = scrollVelocity;
    this.uniforms.uPointer.value.lerp(this.targetPointer, Math.min(delta * 4.0, 1.0));

    let morphA = 0, morphB = 0, morphC = 0, morphD = 0;

    if (scrollProgress < 0.28) {
      morphA = 1.0;
    } else if (scrollProgress >= 0.28 && scrollProgress < 0.36) {
      const t = (scrollProgress - 0.28) / 0.08;
      morphA = 1.0 - t;
      morphB = t;
    } else if (scrollProgress >= 0.36 && scrollProgress < 0.44) {
      const t = (scrollProgress - 0.36) / 0.08;
      morphB = 1.0 - t;
      morphC = t;
    } else if (scrollProgress >= 0.44 && scrollProgress < 0.54) {
      const t = (scrollProgress - 0.44) / 0.10;
      morphC = 1.0 - t;
      morphD = t;
    } else {
      morphD = 1.0;
    }

    this.uniforms.uMorphA.value = THREE.MathUtils.lerp(this.uniforms.uMorphA.value, morphA, delta * 6.0);
    this.uniforms.uMorphB.value = THREE.MathUtils.lerp(this.uniforms.uMorphB.value, morphB, delta * 6.0);
    this.uniforms.uMorphC.value = THREE.MathUtils.lerp(this.uniforms.uMorphC.value, morphC, delta * 6.0);
    this.uniforms.uMorphD.value = THREE.MathUtils.lerp(this.uniforms.uMorphD.value, morphD, delta * 6.0);

    this.points.rotation.y = time * 0.06;
    this.points.rotation.x = Math.sin(time * 0.04) * 0.1;
  }

  dispose() {
    this.scene.remove(this.points);
    this.geometry.dispose();
    this.material.dispose();
  }
}
