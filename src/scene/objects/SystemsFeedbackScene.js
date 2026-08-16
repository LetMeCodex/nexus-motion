import * as THREE from 'three';

/**
 * 3D Global Systems Causal Graph Instrument (Section 6: Connections) - High Performance
 */
export class SystemsFeedbackScene {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.position.set(0, 0, 0);

    this.activeNodeIndex = null;

    // 5 Macro System Node Coordinates (Pentagonal arrangement in 3D)
    this.nodeData = [
      { name: 'HEAT', color: 0xd9532f, pos: new THREE.Vector3(0, 2.2, 0) },
      { name: 'WATER', color: 0x4299e1, pos: new THREE.Vector3(2.1, 0.7, 0.5) },
      { name: 'CITIES', color: 0xecc94b, pos: new THREE.Vector3(1.3, -1.8, -0.4) },
      { name: 'ENERGY', color: 0xf56565, pos: new THREE.Vector3(-1.3, -1.8, 0.4) },
      { name: 'ECOSYSTEMS', color: 0x48bb78, pos: new THREE.Vector3(-2.1, 0.7, -0.5) },
    ];

    this.nodes = [];
    this.edges = [];

    // Create 3D Nodes (detail 1)
    const nodeGeo = new THREE.IcosahedronGeometry(0.32, 1);
    this.nodeData.forEach((data) => {
      const mat = new THREE.MeshStandardMaterial({
        color: data.color,
        emissive: data.color,
        emissiveIntensity: 0.4,
        roughness: 0.25,
        metalness: 0.7,
      });
      const mesh = new THREE.Mesh(nodeGeo, mat);
      mesh.position.copy(data.pos);
      this.group.add(mesh);
      this.nodes.push(mesh);
    });

    const connections = [
      [0, 1],
      [0, 2],
      [2, 3],
      [1, 4],
      [4, 0],
      [3, 0],
      [1, 2],
    ];

    connections.forEach(([fromIdx, toIdx]) => {
      const p1 = this.nodeData[fromIdx].pos;
      const p2 = this.nodeData[toIdx].pos;
      const lineGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      const lineMat = new THREE.LineDashedMaterial({
        color: 0xf5f2ea,
        dashSize: 0.2,
        gapSize: 0.1,
        transparent: true,
        opacity: 0.35,
      });
      const edge = new THREE.Line(lineGeo, lineMat);
      edge.computeLineDistances();
      this.group.add(edge);
      this.edges.push({ edge, from: fromIdx, to: toIdx });
    });

    this.scene.add(this.group);
  }

  highlightNode(index) {
    this.activeNodeIndex = index;
    this.nodes.forEach((node, idx) => {
      if (index === null || idx === index) {
        node.material.emissiveIntensity = 0.8;
        node.scale.set(1.15, 1.15, 1.15);
      } else {
        node.material.emissiveIntensity = 0.2;
        node.scale.set(0.9, 0.9, 0.9);
      }
    });

    this.edges.forEach(({ edge, from, to }) => {
      if (index === null || from === index || to === index) {
        edge.material.opacity = 0.85;
      } else {
        edge.material.opacity = 0.15;
      }
    });
  }

  update(delta, time, scrollProgress) {
    if (scrollProgress >= 0.80 && scrollProgress <= 0.96) {
      this.group.visible = true;
      this.group.rotation.y = time * 0.12;
      this.group.rotation.x = Math.sin(time * 0.08) * 0.08;
    } else {
      this.group.visible = false;
    }
  }

  dispose() {
    this.scene.remove(this.group);
    this.nodes.forEach((node) => {
      node.geometry.dispose();
      node.material.dispose();
    });
    this.edges.forEach(({ edge }) => {
      edge.geometry.dispose();
      edge.material.dispose();
    });
  }
}
