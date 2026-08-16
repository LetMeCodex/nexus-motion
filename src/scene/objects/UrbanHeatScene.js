import * as THREE from 'three';
import { urbanThermalVertexShader, urbanThermalFragmentShader } from '../../shaders/urbanThermalShader';

/**
 * 3D Urban Heat Island Physics Instrument (Section 3: Cities) - High Performance
 */
export class UrbanHeatScene {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.position.set(1.2, -0.6, 0);
    this.group.rotation.y = Math.PI / 6;
    this.group.rotation.x = Math.PI / 10;

    this.parameters = {
      vegetation: 0.2,
      density: 0.8,
      waterProximity: 0.1,
      concreteAlbedo: 0.15,
    };

    // 1. Procedural Instanced City Blocks (64 buildings: 8x8 grid)
    const buildingGeo = new THREE.BoxGeometry(0.35, 1.0, 0.35);
    const buildingMat = new THREE.ShaderMaterial({
      vertexShader: urbanThermalVertexShader,
      fragmentShader: urbanThermalFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uDensity: { value: this.parameters.density },
        uVegetation: { value: this.parameters.vegetation },
        uConcreteAlbedo: { value: this.parameters.concreteAlbedo },
        uWaterProximity: { value: this.parameters.waterProximity },
      },
    });
    this.buildingMat = buildingMat;

    this.gridSize = 8;
    this.totalBuildings = this.gridSize * this.gridSize;
    this.buildings = new THREE.InstancedMesh(buildingGeo, buildingMat, this.totalBuildings);

    const dummy = new THREE.Object3D();
    const spacing = 0.55;
    const offset = (this.gridSize * spacing) / 2;

    for (let x = 0; x < this.gridSize; x++) {
      for (let z = 0; z < this.gridSize; z++) {
        const index = x * this.gridSize + z;
        const posX = x * spacing - offset;
        const posZ = z * spacing - offset;
        const dist = Math.sqrt(posX * posX + posZ * posZ);
        const height = Math.max(2.2 - dist * 0.7 + (Math.sin(x * 2.5) * 0.35), 0.3);

        dummy.position.set(posX, height / 2, posZ);
        dummy.scale.set(1.0, height, 1.0);
        dummy.updateMatrix();
        this.buildings.setMatrixAt(index, dummy.matrix);
      }
    }
    this.buildings.instanceMatrix.needsUpdate = true;
    this.group.add(this.buildings);

    // 2. Ground Base Plane
    const groundGeo = new THREE.PlaneGeometry(6.0, 6.0);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x111319,
      roughness: 0.9,
    });
    this.ground = new THREE.Mesh(groundGeo, groundMat);
    this.ground.rotation.x = -Math.PI / 2;
    this.group.add(this.ground);

    // 3. Thermal Plume Radiative Dome (Optimized 16x8 segments)
    const domeGeo = new THREE.SphereGeometry(3.2, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshBasicMaterial({
      color: 0xd9532f,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    this.thermalDome = new THREE.Mesh(domeGeo, domeMat);
    this.group.add(this.thermalDome);

    this.scene.add(this.group);
  }

  setParameters(params) {
    Object.assign(this.parameters, params);
    this.buildingMat.uniforms.uDensity.value = this.parameters.density;
    this.buildingMat.uniforms.uVegetation.value = this.parameters.vegetation;
    this.buildingMat.uniforms.uConcreteAlbedo.value = this.parameters.concreteAlbedo;
    this.buildingMat.uniforms.uWaterProximity.value = this.parameters.waterProximity;

    const deltaT = (this.parameters.density * 4.2) + ((1.0 - this.parameters.concreteAlbedo) * 3.5) - (this.parameters.vegetation * 3.8);
    this.thermalDome.material.opacity = Math.max(0.08, Math.min(deltaT / 12.0, 0.45));
  }

  update(delta, time, scrollProgress) {
    if (scrollProgress >= 0.38 && scrollProgress <= 0.60) {
      this.group.visible = true;
      this.buildingMat.uniforms.uTime.value = time;
      this.group.rotation.y = Math.PI / 6 + time * 0.04;
    } else {
      this.group.visible = false;
    }
  }

  dispose() {
    this.scene.remove(this.group);
    this.buildings.geometry.dispose();
    this.buildingMat.dispose();
    this.ground.geometry.dispose();
    this.ground.material.dispose();
    this.thermalDome.geometry.dispose();
    this.thermalDome.material.dispose();
  }
}
