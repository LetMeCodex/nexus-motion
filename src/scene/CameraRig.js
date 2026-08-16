import * as THREE from 'three';

/**
 * CameraRig - Smooth Cinematic Trajectory across the 8 Planetary Plates:
 * Earth Globe -> Atmosphere/Heat -> Watershed/Water -> Urban Canyon -> Network Lifelines -> Extreme Landscape -> Systems Graph -> Singularity.
 */
export class CameraRig {
  constructor(camera) {
    this.camera = camera;
    this.targetPos = new THREE.Vector3(0, 0, 7.0);
    this.currentPos = new THREE.Vector3(0, 0, 7.0);
    this.targetLookAt = new THREE.Vector3(0, 0, 0);
    this.currentLookAt = new THREE.Vector3(0, 0, 0);

    this.pointer = new THREE.Vector2(0, 0);
    this.smoothedPointer = new THREE.Vector2(0, 0);
    this.reducedMotion = false;
  }

  setPointer(x, y) {
    this.pointer.set(x, y);
  }

  setReducedMotion(enabled) {
    this.reducedMotion = enabled;
  }

  update(delta, time, scrollProgress, scrollVelocity) {
    const parallaxDamp = Math.min(delta * 3.5, 1.0);
    this.smoothedPointer.lerp(this.pointer, parallaxDamp);

    const pX = this.reducedMotion ? 0 : this.smoothedPointer.x * 0.35;
    const pY = this.reducedMotion ? 0 : this.smoothedPointer.y * 0.25;

    // Velocity pullback damping
    const velOffset = Math.min(Math.abs(scrollVelocity) * 0.0002, 0.4);

    // Continuous 8-Plate Trajectory Interpolation
    if (scrollProgress < 0.14) {
      // Plate 0: Hero 2D/3D Globe Centered
      const t = scrollProgress / 0.14;
      this.targetPos.set(pX, pY, 7.0 - t * 0.4 + velOffset);
      this.targetLookAt.set(0, 0, 0);
    } else if (scrollProgress < 0.28) {
      // Plate 1: Section 01 Heat (Right aligned for Swiss text)
      const t = (scrollProgress - 0.14) / 0.14;
      const posX = THREE.MathUtils.lerp(0, -0.9, t) + pX;
      const lookX = THREE.MathUtils.lerp(0, 0.9, t);
      this.targetPos.set(posX, pY, 6.0 + velOffset);
      this.targetLookAt.set(lookX, 0, 0);
    } else if (scrollProgress < 0.42) {
      // Plate 2: Section 02 Water Cycle (Downhill watershed dive)
      const t = (scrollProgress - 0.28) / 0.14;
      const posX = THREE.MathUtils.lerp(-0.9, -0.6, t) + pX;
      const posY = THREE.MathUtils.lerp(0, 1.1, t) + pY;
      const posZ = THREE.MathUtils.lerp(6.0, 5.2, t) + velOffset;
      const lookX = THREE.MathUtils.lerp(0.9, 0.7, t);
      const lookY = THREE.MathUtils.lerp(0, -0.3, t);
      this.targetPos.set(posX, posY, posZ);
      this.targetLookAt.set(lookX, lookY, 0);
    } else if (scrollProgress < 0.56) {
      // Plate 3: Section 03 Cities (Isometric canyon view)
      const t = (scrollProgress - 0.42) / 0.14;
      const posX = THREE.MathUtils.lerp(-0.6, -0.6, t) + pX;
      const posY = THREE.MathUtils.lerp(1.1, 0.9, t) + pY;
      const posZ = THREE.MathUtils.lerp(5.2, 4.8, t) + velOffset;
      const lookX = THREE.MathUtils.lerp(0.7, 0.9, t);
      const lookY = THREE.MathUtils.lerp(-0.3, -0.1, t);
      this.targetPos.set(posX, posY, posZ);
      this.targetLookAt.set(lookX, lookY, 0);
    } else if (scrollProgress < 0.70) {
      // Plate 4: Section 04 Urban Network Lifelines
      const t = (scrollProgress - 0.56) / 0.14;
      const posX = THREE.MathUtils.lerp(-0.6, -0.6, t) + pX;
      const posY = THREE.MathUtils.lerp(0.9, 1.3, t) + pY;
      const posZ = THREE.MathUtils.lerp(4.8, 5.0, t) + velOffset;
      const lookX = THREE.MathUtils.lerp(0.9, 0.8, t);
      const lookY = THREE.MathUtils.lerp(-0.1, -0.2, t);
      this.targetPos.set(posX, posY, posZ);
      this.targetLookAt.set(lookX, lookY, 0);
    } else if (scrollProgress < 0.84) {
      // Plate 5: Section 05 Extreme Events
      const t = (scrollProgress - 0.70) / 0.14;
      const posX = THREE.MathUtils.lerp(-0.6, -0.5, t) + pX;
      const posY = THREE.MathUtils.lerp(1.3, 1.1, t) + pY;
      const posZ = THREE.MathUtils.lerp(5.0, 5.2, t) + velOffset;
      const lookX = THREE.MathUtils.lerp(0.8, 0.7, t);
      const lookY = THREE.MathUtils.lerp(-0.2, -0.2, t);
      this.targetPos.set(posX, posY, posZ);
      this.targetLookAt.set(lookX, lookY, 0);
    } else if (scrollProgress < 0.94) {
      // Plate 6: Section 06 Systems Graph (Pull back to centered macro view)
      const t = (scrollProgress - 0.84) / 0.10;
      const posX = THREE.MathUtils.lerp(-0.5, 0, t) + pX;
      const posY = THREE.MathUtils.lerp(1.1, 0, t) + pY;
      const posZ = THREE.MathUtils.lerp(5.2, 6.4, t) + velOffset;
      const lookX = THREE.MathUtils.lerp(0.7, 0, t);
      const lookY = THREE.MathUtils.lerp(-0.2, 0, t);
      this.targetPos.set(posX, posY, posZ);
      this.targetLookAt.set(lookX, lookY, 0);
    } else {
      // Plate 7: Final Singularity Convergence
      const t = (scrollProgress - 0.94) / 0.06;
      const posZ = THREE.MathUtils.lerp(6.4, 4.8, t) + velOffset;
      this.targetPos.set(pX, pY, posZ);
      this.targetLookAt.set(0, 0, 0);
    }

    const cameraLerp = Math.min(delta * 3.8, 1.0);
    this.currentPos.lerp(this.targetPos, cameraLerp);
    this.currentLookAt.lerp(this.targetLookAt, cameraLerp);

    this.camera.position.copy(this.currentPos);
    this.camera.lookAt(this.currentLookAt);
  }
}
