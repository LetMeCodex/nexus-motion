import * as THREE from 'three';
import { liquidEnergyVertexShader, liquidEnergyFragmentShader } from '../../shaders/liquidEnergyShader';

/**
 * 3D Liquid Obsidian & Mercurial Surface for Section 5
 * Dense vertex-displaced fluid plane reacting to scroll velocity with physical spring decay.
 */
export class LiquidEnergyField {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.position.set(0, -1.8, -4.0);
    this.group.rotation.x = -Math.PI / 2.8;

    this.geometry = new THREE.PlaneGeometry(26, 26, 120, 120);

    this.uniforms = {
      uTime: { value: 0 },
      uSpeed: { value: 0.7 },
      uVelocity: { value: 0 },
      uBaseAmplitude: { value: 0.4 },
      uFrequency: { value: 0.32 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPointerDistort: { value: 0.5 },
      uColorDeep: { value: new THREE.Color(0x07080f) },
      uColorCrest: { value: new THREE.Color(0x94a3b8) },
      uColorSpecular: { value: new THREE.Color(0xf8fafc) },
    };

    this.material = new THREE.ShaderMaterial({
      vertexShader: liquidEnergyVertexShader,
      fragmentShader: liquidEnergyFragmentShader,
      uniforms: this.uniforms,
      wireframe: false,
      transparent: true,
      side: THREE.DoubleSide,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.group.add(this.mesh);

    this.scene.add(this.group);
    this.targetPointer = new THREE.Vector2(0, 0);
    this.currentPointer = new THREE.Vector2(0, 0);
  }

  setPointer(x, y) {
    this.targetPointer.set(x, y);
  }

  update(delta, time, scrollProgress, scrollVelocity) {
    this.currentPointer.lerp(this.targetPointer, Math.min(delta * 4.0, 1.0));

    if (scrollProgress >= 0.54 && scrollProgress <= 0.86) {
      this.group.visible = true;

      this.uniforms.uTime.value = time;
      this.uniforms.uPointer.value.copy(this.currentPointer);

      const normalizedVel = Math.min(Math.abs(scrollVelocity) * 0.001, 1.2);
      this.uniforms.uVelocity.value = normalizedVel;

      this.group.rotation.z = Math.sin(time * 0.15) * 0.03 + this.currentPointer.x * 0.08;
      this.group.rotation.x = -Math.PI / 2.8 + this.currentPointer.y * 0.06;
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
