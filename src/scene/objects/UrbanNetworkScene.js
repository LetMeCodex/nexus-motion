import * as THREE from 'three';

/**
 * 3D Urban Network Instrument (Section 4: The Hidden Network) - High Performance
 */
export class UrbanNetworkScene {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.position.set(1.0, -0.4, 0);
    this.group.rotation.x = Math.PI / 8;
    this.group.rotation.y = -Math.PI / 10;

    this.activeLayer = 'all';

    this.layers = {
      power: new THREE.Group(),
      water: new THREE.Group(),
      transport: new THREE.Group(),
      fiber: new THREE.Group(),
      emergency: new THREE.Group(),
    };

    // 1. Base Wireframe City Grid
    const baseGeo = new THREE.GridHelper(6, 12, 0xf5f2ea, 0x334155);
    baseGeo.position.y = -0.2;
    this.group.add(baseGeo);

    // 2. POWER GRID (10 nodes)
    const powerNodesCount = 10;
    const powerNodeGeo = new THREE.OctahedronGeometry(0.12, 0);
    const powerNodeMat = new THREE.MeshBasicMaterial({ color: 0xecc94b });
    this.powerNodes = new THREE.InstancedMesh(powerNodeGeo, powerNodeMat, powerNodesCount);

    const dummy = new THREE.Object3D();
    const powerCoords = [];
    for (let i = 0; i < powerNodesCount; i++) {
      const px = (Math.random() - 0.5) * 4.0;
      const pz = (Math.random() - 0.5) * 4.0;
      const py = 0.4 + Math.random() * 0.7;
      dummy.position.set(px, py, pz);
      dummy.updateMatrix();
      this.powerNodes.setMatrixAt(i, dummy.matrix);
      powerCoords.push(new THREE.Vector3(px, py, pz));
    }
    this.powerNodes.instanceMatrix.needsUpdate = true;
    this.layers.power.add(this.powerNodes);

    for (let i = 0; i < powerNodesCount - 1; i++) {
      const linePts = [powerCoords[i], powerCoords[i + 1]];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(linePts);
      const lineMat = new THREE.LineDashedMaterial({
        color: 0xecc94b,
        dashSize: 0.25,
        gapSize: 0.15,
        transparent: true,
        opacity: 0.8,
      });
      const powerLine = new THREE.Line(lineGeo, lineMat);
      powerLine.computeLineDistances();
      this.layers.power.add(powerLine);
    }

    // 3. WATER HYDRAULICS (6 lines)
    for (let w = 0; w < 6; w++) {
      const wx = (w - 2.5) * 0.8;
      const pts = [new THREE.Vector3(wx, -0.3, -2.2), new THREE.Vector3(wx, -0.3, 2.2)];
      const pipeGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const pipeMat = new THREE.LineBasicMaterial({ color: 0x4299e1, transparent: true, opacity: 0.75 });
      this.layers.water.add(new THREE.Line(pipeGeo, pipeMat));
    }

    // 4. TRANSIT ARTERIES
    const transitCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.0, 0.05, -2.0),
      new THREE.Vector3(2.0, 0.05, -1.8),
      new THREE.Vector3(1.8, 0.05, 2.0),
      new THREE.Vector3(-1.8, 0.05, 1.8),
    ], true);
    const transitPts = transitCurve.getPoints(36);
    const transitGeo = new THREE.BufferGeometry().setFromPoints(transitPts);
    const transitMat = new THREE.LineBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.85 });
    this.layers.transport.add(new THREE.Line(transitGeo, transitMat));

    // 5. FIBER OPTIC TELECOMS (10 lines)
    const fiberPts = [];
    for (let f = 0; f < 12; f++) {
      fiberPts.push(
        new THREE.Vector3((Math.random() - 0.5) * 3.8, 0.1 + Math.random() * 0.3, (Math.random() - 0.5) * 3.8)
      );
    }
    const fiberGeo = new THREE.BufferGeometry().setFromPoints(fiberPts);
    const fiberMat = new THREE.LineBasicMaterial({ color: 0xf8fafc, transparent: true, opacity: 0.65 });
    this.layers.fiber.add(new THREE.Line(fiberGeo, fiberMat));

    // 6. EMERGENCY RESPONSE
    for (let e = 0; e < 3; e++) {
      const ringGeo = new THREE.RingGeometry(0.35, 0.4, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xf56565,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.set((e - 1) * 1.5, 0.05, (e === 1 ? -0.8 : 0.8));
      this.layers.emergency.add(ringMesh);
    }

    Object.values(this.layers).forEach((layer) => this.group.add(layer));
    this.scene.add(this.group);
  }

  setIsolatedLayer(layerName) {
    this.activeLayer = layerName;
    Object.keys(this.layers).forEach((key) => {
      if (layerName === 'all' || layerName === key) {
        this.layers[key].visible = true;
      } else {
        this.layers[key].visible = false;
      }
    });
  }

  update(delta, time, scrollProgress) {
    if (scrollProgress >= 0.52 && scrollProgress <= 0.74) {
      this.group.visible = true;
      this.group.rotation.y = -Math.PI / 10 + time * 0.04;
    } else {
      this.group.visible = false;
    }
  }

  dispose() {
    this.scene.remove(this.group);
    this.powerNodes.geometry.dispose();
    this.powerNodes.material.dispose();
  }
}
