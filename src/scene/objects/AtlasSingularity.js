import * as THREE from 'three';

/**
 * 3D Final Collapse Singularity Instrument (Section 07: Conclusion)
 * Models the systemic contraction of the 3D model into a single origin point.
 */
export class AtlasSingularity {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.position.set(0, 0, 0);

    const pointGeo = new THREE.SphereGeometry(0.2, 32, 32);
    const pointMat = new THREE.MeshBasicMaterial({
      color: 0xf5f2ea,
    });
    this.point = new THREE.Mesh(pointGeo, pointMat);
    this.group.add(this.point);

    const ringGeo = new THREE.RingGeometry(0.3, 0.45, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xd9532f,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
    });
    this.ring = new THREE.Mesh(ringGeo, ringMat);
    this.group.add(this.ring);

    this.scene.add(this.group);
  }

  update(delta, time, scrollProgress) {
    if (scrollProgress >= 0.90) {
      this.group.visible = true;
      const t = (scrollProgress - 0.90) / 0.10;
      const scale = THREE.MathUtils.lerp(0.1, 1.2, t);
      this.group.scale.set(scale, scale, scale);
      this.ring.rotation.z = time * 1.5;
    } else {
      this.group.visible = false;
    }
  }

  dispose() {
    this.scene.remove(this.group);
    this.point.geometry.dispose();
    this.point.material.dispose();
    this.ring.geometry.dispose();
    this.ring.material.dispose();
  }
}
