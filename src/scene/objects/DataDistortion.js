import * as THREE from 'three';
import { dataDistortionVertexShader, dataDistortionFragmentShader } from '../../shaders/dataDistortionShader';

/**
 * 3D Data Node Field for Section 6: Data / Time Distortion
 * 1,200 volumetric nodes restructuring from entropy into structured cylindrical schematics.
 */
export class DataDistortion {
  constructor(scene, count = 1200) {
    this.scene = scene;
    this.count = count;
    this.group = new THREE.Group();
    this.group.position.set(0, 0, 0);

    this.geometry = new THREE.BufferGeometry();

    const chaosPositions = new Float32Array(count * 3);
    const targetPositions = new Float32Array(count * 3);
    const randomOffsets = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    const white = new THREE.Color(0xf8fafc);
    const platinum = new THREE.Color(0xcbd5e1);
    const warmAmber = new THREE.Color(0xfde68a);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      chaosPositions[i3] = (Math.random() - 0.5) * 15.0;
      chaosPositions[i3 + 1] = (Math.random() - 0.5) * 15.0;
      chaosPositions[i3 + 2] = (Math.random() - 0.5) * 15.0;

      const ringT = i / count;
      const angle = ringT * Math.PI * 8.0;
      const radius = 3.5 + Math.sin(ringT * Math.PI * 4.0) * 0.5;
      const height = (ringT - 0.5) * 5.5;

      targetPositions[i3] = Math.cos(angle) * radius;
      targetPositions[i3 + 1] = height;
      targetPositions[i3 + 2] = Math.sin(angle) * radius;

      randomOffsets[i] = Math.random();

      const mixedColor = ringT < 0.6 ? white.clone().lerp(platinum, ringT * 1.5) : platinum.clone().lerp(warmAmber, (ringT - 0.6) * 2.5);
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(targetPositions, 3));
    this.geometry.setAttribute('aTargetPosition', new THREE.BufferAttribute(targetPositions, 3));
    this.geometry.setAttribute('aChaosPosition', new THREE.BufferAttribute(chaosPositions, 3));
    this.geometry.setAttribute('aRandomOffset', new THREE.BufferAttribute(randomOffsets, 1));
    this.geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));

    this.uniforms = {
      uTime: { value: 0 },
      uProgress: { value: 0.0 },
      uTimeDilation: { value: 1.0 },
      uPointer: { value: new THREE.Vector3(0, 0, 0) },
    };

    this.material = new THREE.ShaderMaterial({
      vertexShader: dataDistortionVertexShader,
      fragmentShader: dataDistortionFragmentShader,
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.points = new THREE.Points(this.geometry, this.material);
    this.group.add(this.points);

    this.scene.add(this.group);
    this.targetPointer = new THREE.Vector3(0, 0, 0);
  }

  setPointer(x, y) {
    this.targetPointer.set(x, y, 0);
  }

  update(delta, time, scrollProgress, scrollVelocity) {
    if (scrollProgress >= 0.68 && scrollProgress <= 0.95) {
      this.group.visible = true;

      this.uniforms.uTime.value = time;
      this.uniforms.uPointer.value.lerp(this.targetPointer, Math.min(delta * 4.0, 1.0));

      const localT = (scrollProgress - 0.72) / 0.16;
      const clampedProgress = Math.min(Math.max(localT, 0), 1);

      this.uniforms.uProgress.value = THREE.MathUtils.lerp(this.uniforms.uProgress.value, clampedProgress, delta * 5.0);

      this.group.rotation.y = time * 0.15 + this.targetPointer.x * 0.4;
      this.group.rotation.x = Math.sin(time * 0.12) * 0.08;
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
