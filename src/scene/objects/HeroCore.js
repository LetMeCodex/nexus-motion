import * as THREE from 'three';
import { heroCoreVertexShader, heroCoreFragmentShader } from '../../shaders/heroCoreShader';

/**
 * 3D Object for Section 1: Hero Core
 * Procedural metallic/crystalline sphere with multi-frequency simplex vertex displacement and iridescent Fresnel shading.
 */
export class HeroCore {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.position.set(0, 0, 0);

    // High density geometry for smooth vertex displacement (detail=4 is 5,120 faces)
    this.geometry = new THREE.IcosahedronGeometry(2.0, 4);

    // Uniforms
    this.uniforms = {
      uTime: { value: 0 },
      uDistortion: { value: 0.35 },
      uFrequency: { value: 1.2 },
      uSpeed: { value: 0.6 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uColorBase: { value: new THREE.Color(0x181a24) },
      uColorAccent: { value: new THREE.Color(0xe2e8f0) },
      uColorRim: { value: new THREE.Color(0x94a3b8) },
      uRoughness: { value: 0.22 },
      uIridescence: { value: 0.65 },
    };

    this.material = new THREE.ShaderMaterial({
      vertexShader: heroCoreVertexShader,
      fragmentShader: heroCoreFragmentShader,
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: true,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.group.add(this.mesh);

    // Internal soft light core
    this.innerLight = new THREE.PointLight(0xffffff, 2.0, 10);
    this.group.add(this.innerLight);

    // Studio 3-point softbox lights
    this.keyLight = new THREE.DirectionalLight(0xf1f5f9, 3.0);
    this.keyLight.position.set(6, 9, 6);
    this.group.add(this.keyLight);

    this.rimLight = new THREE.DirectionalLight(0x94a3b8, 2.0);
    this.rimLight.position.set(-6, -4, -5);
    this.group.add(this.rimLight);

    this.scene.add(this.group);

    // Damped pointer coordinates
    this.targetPointer = new THREE.Vector2(0, 0);
    this.currentPointer = new THREE.Vector2(0, 0);
  }

  setPointer(x, y) {
    this.targetPointer.set(x, y);
  }

  update(delta, time, scrollProgress, scrollVelocity) {
    // Smooth critically damped pointer interpolation
    this.currentPointer.lerp(this.targetPointer, Math.min(delta * 4.0, 1.0));

    this.uniforms.uTime.value = time;
    this.uniforms.uPointer.value.copy(this.currentPointer);

    // Dynamic distortion scaling with scroll velocity
    const velocityDistortion = Math.min(Math.abs(scrollVelocity) * 0.0004, 0.4);
    this.uniforms.uDistortion.value = 0.35 + velocityDistortion;

    // Base rotation + pointer inertia
    this.mesh.rotation.y = time * 0.25 + this.currentPointer.x * 0.4;
    this.mesh.rotation.x = time * 0.15 + this.currentPointer.y * 0.3;

    // Transition out as scroll moves past section 1 (progress > 0.14)
    if (scrollProgress < 0.25) {
      this.group.visible = true;
      const progress = scrollProgress / 0.18; // 0 to 1 in hero range
      
      // Enlarge, rotate and dissolve as user scrolls down
      const scale = 1.0 + progress * 2.8;
      this.group.scale.set(scale, scale, scale);
      this.group.position.z = progress * 4.0;
      this.material.opacity = Math.max(1.0 - progress * 1.5, 0.0);
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
