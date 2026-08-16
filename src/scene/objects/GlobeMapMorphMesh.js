import * as THREE from 'three';
import { globeMapVertexShader, globeMapFragmentShader } from '../../shaders/globeMapMorphShader';
import { graticuleVertexShader, graticuleFragmentShader } from '../../shaders/graticuleMorphShader';

// Major Interactive Geographic Anchor Points (Cities & Systems)
export const INTERACTIVE_LOCATIONS = [
  { id: 'sf', name: 'San Francisco', country: 'United States', lat: 37.7749, lon: -122.4194, region: 'North America', metric: 'Innovation Hub' },
  { id: 'nyc', name: 'New York', country: 'United States', lat: 40.7128, lon: -74.0060, region: 'North America', metric: 'Financial Core' },
  { id: 'london', name: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278, region: 'Europe', metric: 'Prime Meridian' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503, region: 'Asia-Pacific', metric: 'Metropolitan Core' },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', lat: 1.3521, lon: 103.8198, region: 'Southeast Asia', metric: 'Hydrological Hub' },
  { id: 'sao_paulo', name: 'São Paulo', country: 'Brazil', lat: -23.5505, lon: -46.6333, region: 'South America', metric: 'Biomass Basin' },
  { id: 'nairobi', name: 'Nairobi', country: 'Kenya', lat: -1.2921, lon: 36.8219, region: 'East Africa', metric: 'Renewable Grid' },
  { id: 'cairo', name: 'Cairo', country: 'Egypt', lat: 30.0444, lon: 31.2357, region: 'North Africa', metric: 'Nile Delta' },
  { id: 'mumbai', name: 'Mumbai', country: 'India', lat: 19.0760, lon: 72.8777, region: 'South Asia', metric: 'Monsoon Confluence' },
  { id: 'sydney', name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093, region: 'Oceania', metric: 'Pacific Basin' },
  { id: 'reykjavik', name: 'Reykjavik', country: 'Iceland', lat: 64.1466, lon: -21.9426, region: 'Nordic Arctic', metric: 'Geothermal Rift' },
];

/**
 * Geometric Landmass Point Sampler
 * Defines bounding boxes and point densities for all major continents and islands.
 */
function isLandCoordinate(latDeg, lonDeg) {
  // North America
  if (latDeg >= 15 && latDeg <= 72 && lonDeg >= -168 && lonDeg <= -52) {
    if (latDeg > 55 && lonDeg < -130) return true; // Alaska
    if (latDeg >= 25 && latDeg <= 52 && lonDeg >= -125 && lonDeg <= -68) return true; // USA/Canada
    if (latDeg >= 15 && latDeg <= 32 && lonDeg >= -115 && lonDeg <= -86) return true; // Mexico/Central America
    if (latDeg >= 60 && latDeg <= 82 && lonDeg >= -72 && lonDeg <= -12) return true; // Greenland
  }
  // South America
  if (latDeg >= -56 && latDeg <= 12 && lonDeg >= -82 && lonDeg <= -34) {
    if (latDeg >= -20 && latDeg <= 10 && lonDeg >= -78 && lonDeg <= -36) return true;
    if (latDeg < -20 && lonDeg >= -74 && lonDeg <= -48) return true;
  }
  // Europe
  if (latDeg >= 36 && latDeg <= 71 && lonDeg >= -10 && lonDeg <= 45) {
    if (latDeg >= 36 && latDeg <= 60 && lonDeg >= -10 && lonDeg <= 35) return true;
    if (latDeg > 55 && lonDeg >= 5 && lonDeg <= 32) return true; // Scandinavia
    if (latDeg >= 50 && latDeg <= 59 && lonDeg >= -8 && lonDeg <= 2) return true; // UK
  }
  // Africa
  if (latDeg >= -35 && latDeg <= 37 && lonDeg >= -18 && lonDeg <= 52) {
    if (latDeg >= 5 && latDeg <= 35 && lonDeg >= -16 && lonDeg <= 40) return true; // Sahara / North
    if (latDeg >= -35 && latDeg < 5 && lonDeg >= 10 && lonDeg <= 42) return true; // Central / South
    if (latDeg >= -26 && latDeg <= -12 && lonDeg >= 43 && lonDeg <= 51) return true; // Madagascar
  }
  // Asia
  if (latDeg >= 5 && latDeg <= 77 && lonDeg >= 45 && lonDeg <= 180) {
    if (latDeg >= 45 && latDeg <= 75 && lonDeg >= 45 && lonDeg <= 170) return true; // Siberia
    if (latDeg >= 20 && latDeg <= 45 && lonDeg >= 60 && lonDeg <= 122) return true; // East / Central Asia
    if (latDeg >= 8 && latDeg <= 35 && lonDeg >= 68 && lonDeg <= 90) return true; // India / South Asia
    if (latDeg >= 30 && latDeg <= 45 && lonDeg >= 128 && lonDeg <= 146) return true; // Japan
    if (latDeg >= -10 && latDeg <= 8 && lonDeg >= 95 && lonDeg <= 142) return true; // SE Asia / Indonesia
  }
  // Australia & New Zealand
  if (latDeg >= -44 && latDeg <= -10 && lonDeg >= 112 && lonDeg <= 178) {
    if (latDeg >= -39 && latDeg <= -11 && lonDeg >= 113 && lonDeg <= 154) return true; // Australia
    if (latDeg >= -47 && latDeg <= -34 && lonDeg >= 166 && lonDeg <= 178) return true; // New Zealand
  }
  // Antarctica
  if (latDeg <= -65) return true;

  return false;
}

export class GlobeMapMorphMesh {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.position.set(0, 0, 0);

    this.radius = 2.2;
    this.mapWidth = 5.6;  // Equirectangular width
    this.mapHeight = 2.8; // Equirectangular height (2:1 aspect ratio)

    this.rotationY = 0;
    this.morphProgress = 0; // 0.0 to 1.0

    this.hoveredLocation = null;

    // 1. Generate Dual-Coordinate Geographic Point Matrix (~16,000 points)
    this.initGeographicMesh();

    // 2. Generate Dual-Coordinate Graticule Lines (Parallels & Meridians)
    this.initGraticules();

    // 3. Interactive Data Markers (City Pins)
    this.initLocationMarkers();

    this.scene.add(this.group);
  }

  initGeographicMesh() {
    const latSteps = 90;
    const lonSteps = 180;
    const totalPoints = latSteps * lonSteps;

    const spherePositions = new Float32Array(totalPoints * 3);
    const mapPositions = new Float32Array(totalPoints * 3);
    const geoCoords = new Float32Array(totalPoints * 2);
    const isLand = new Float32Array(totalPoints);
    const pointIds = new Float32Array(totalPoints);

    let idx = 0;
    for (let i = 0; i < latSteps; i++) {
      const latNorm = (i / (latSteps - 1)) * 2.0 - 1.0; // -1 to 1
      const latRad = latNorm * (Math.PI / 2);
      const latDeg = latNorm * 90;

      for (let j = 0; j < lonSteps; j++) {
        const lonNorm = (j / (lonSteps - 1)) * 2.0 - 1.0; // -1 to 1
        const lonRad = lonNorm * Math.PI;
        const lonDeg = lonNorm * 180;

        const i3 = idx * 3;
        const i2 = idx * 2;

        // 3D Spherical Position
        // x = R * cos(lat) * sin(lon)
        // y = R * sin(lat)
        // z = R * cos(lat) * cos(lon)
        const sx = this.radius * Math.cos(latRad) * Math.sin(lonRad);
        const sy = this.radius * Math.sin(latRad);
        const sz = this.radius * Math.cos(latRad) * Math.cos(lonRad);

        spherePositions[i3] = sx;
        spherePositions[i3 + 1] = sy;
        spherePositions[i3 + 2] = sz;

        // 2D Equirectangular Planar Map Position
        const mx = lonNorm * (this.mapWidth / 2);
        const my = latNorm * (this.mapHeight / 2);
        const mz = 0.0;

        mapPositions[i3] = mx;
        mapPositions[i3 + 1] = my;
        mapPositions[i3 + 2] = mz;

        // Geographic Coordinates
        geoCoords[i2] = lonRad;
        geoCoords[i2 + 1] = latRad;

        // Landmass Classification
        isLand[idx] = isLandCoordinate(latDeg, lonDeg) ? 1.0 : 0.0;
        pointIds[idx] = idx;

        idx++;
      }
    }

    this.geoBuffer = new THREE.BufferGeometry();
    this.geoBuffer.setAttribute('position', new THREE.BufferAttribute(spherePositions, 3));
    this.geoBuffer.setAttribute('aSpherePos', new THREE.BufferAttribute(spherePositions, 3));
    this.geoBuffer.setAttribute('aMapPos', new THREE.BufferAttribute(mapPositions, 3));
    this.geoBuffer.setAttribute('aGeoCoord', new THREE.BufferAttribute(geoCoords, 2));
    this.geoBuffer.setAttribute('aIsLand', new THREE.BufferAttribute(isLand, 1));
    this.geoBuffer.setAttribute('aPointId', new THREE.BufferAttribute(pointIds, 1));

    this.uniforms = {
      uTime: { value: 0 },
      uMorph: { value: 0.0 },
      uRotationY: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2.0) },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uHoveredCoord: { value: new THREE.Vector2(-999, -999) },
      uIsHovered: { value: 0.0 },
    };

    this.material = new THREE.ShaderMaterial({
      vertexShader: globeMapVertexShader,
      fragmentShader: globeMapFragmentShader,
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.pointCloud = new THREE.Points(this.geoBuffer, this.material);
    this.group.add(this.pointCloud);
  }

  initGraticules() {
    // Parallels (every 15 deg) and Meridians (every 30 deg)
    const lineVerticesSphere = [];
    const lineVerticesMap = [];
    const lineGeoCoords = [];

    // Latitude Parallels
    for (let latDeg = -75; latDeg <= 75; latDeg += 15) {
      const latRad = (latDeg / 180) * Math.PI;
      const latNorm = latDeg / 90;
      const segments = 120;

      for (let s = 0; s < segments; s++) {
        const lonNorm1 = (s / segments) * 2.0 - 1.0;
        const lonNorm2 = ((s + 1) / segments) * 2.0 - 1.0;

        [lonNorm1, lonNorm2].forEach((lonNorm) => {
          const lonRad = lonNorm * Math.PI;

          // Sphere
          lineVerticesSphere.push(
            this.radius * Math.cos(latRad) * Math.sin(lonRad),
            this.radius * Math.sin(latRad),
            this.radius * Math.cos(latRad) * Math.cos(lonRad)
          );

          // Map
          lineVerticesMap.push(
            lonNorm * (this.mapWidth / 2),
            latNorm * (this.mapHeight / 2),
            0.0
          );

          lineGeoCoords.push(lonRad, latRad);
        });
      }
    }

    // Longitude Meridians
    for (let lonDeg = -180; lonDeg <= 180; lonDeg += 30) {
      const lonRad = (lonDeg / 180) * Math.PI;
      const lonNorm = lonDeg / 180;
      const segments = 90;

      for (let s = 0; s < segments; s++) {
        const latNorm1 = (s / segments) * 2.0 - 1.0;
        const latNorm2 = ((s + 1) / segments) * 2.0 - 1.0;

        [latNorm1, latNorm2].forEach((latNorm) => {
          const latRad = latNorm * (Math.PI / 2);

          // Sphere
          lineVerticesSphere.push(
            this.radius * Math.cos(latRad) * Math.sin(lonRad),
            this.radius * Math.sin(latRad),
            this.radius * Math.cos(latRad) * Math.cos(lonRad)
          );

          // Map
          lineVerticesMap.push(
            lonNorm * (this.mapWidth / 2),
            latNorm * (this.mapHeight / 2),
            0.0
          );

          lineGeoCoords.push(lonRad, latRad);
        });
      }
    }

    this.graticuleGeo = new THREE.BufferGeometry();
    this.graticuleGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lineVerticesSphere), 3));
    this.graticuleGeo.setAttribute('aSpherePos', new THREE.BufferAttribute(new Float32Array(lineVerticesSphere), 3));
    this.graticuleGeo.setAttribute('aMapPos', new THREE.BufferAttribute(new Float32Array(lineVerticesMap), 3));
    this.graticuleGeo.setAttribute('aGeoCoord', new THREE.BufferAttribute(new Float32Array(lineGeoCoords), 2));

    this.graticuleMat = new THREE.ShaderMaterial({
      vertexShader: graticuleVertexShader,
      fragmentShader: graticuleFragmentShader,
      uniforms: {
        uMorph: this.uniforms.uMorph,
        uRotationY: this.uniforms.uRotationY,
      },
      transparent: true,
      depthWrite: false,
    });

    this.graticules = new THREE.LineSegments(this.graticuleGeo, this.graticuleMat);
    this.group.add(this.graticules);
  }

  initLocationMarkers() {
    this.markersGroup = new THREE.Group();
    const pinGeo = new THREE.RingGeometry(0.04, 0.07, 24);
    const pinMat = new THREE.MeshBasicMaterial({
      color: 0xf5f2ea,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });

    this.locationMeshes = [];

    INTERACTIVE_LOCATIONS.forEach((loc) => {
      const latRad = (loc.lat / 180) * Math.PI;
      const lonRad = (loc.lon / 180) * Math.PI;
      const latNorm = loc.lat / 90;
      const lonNorm = loc.lon / 180;

      const spherePos = new THREE.Vector3(
        (this.radius + 0.05) * Math.cos(latRad) * Math.sin(lonRad),
        (this.radius + 0.05) * Math.sin(latRad),
        (this.radius + 0.05) * Math.cos(latRad) * Math.cos(lonRad)
      );

      const mapPos = new THREE.Vector3(
        lonNorm * (this.mapWidth / 2),
        latNorm * (this.mapHeight / 2),
        0.05
      );

      const mesh = new THREE.Mesh(pinGeo, pinMat.clone());
      mesh.userData = { loc, spherePos, mapPos, latRad, lonRad };
      this.markersGroup.add(mesh);
      this.locationMeshes.push(mesh);
    });

    this.group.add(this.markersGroup);
  }

  setMorphProgress(progress) {
    this.morphProgress = Math.min(Math.max(progress, 0.0), 1.0);
    this.uniforms.uMorph.value = this.morphProgress;
  }

  setHoveredLocation(loc) {
    this.hoveredLocation = loc;
    if (loc) {
      const latRad = (loc.lat / 180) * Math.PI;
      const lonRad = (loc.lon / 180) * Math.PI;
      this.uniforms.uHoveredCoord.value.set(lonRad, latRad);
      this.uniforms.uIsHovered.value = 1.0;
    } else {
      this.uniforms.uIsHovered.value = 0.0;
    }
  }

  update(delta, time, scrollProgress, scrollVelocity) {
    this.uniforms.uTime.value = time;

    // Scroll mapping to Morph Progress [0.0 to 1.0]:
    // 0.00 to 0.18 -> Globe state (morph = 0.0)
    // 0.18 to 0.85 -> Continuous geometric unrolling (morph = 0.0 -> 1.0)
    // 0.85 to 1.00 -> Flat world map state (morph = 1.0)
    let calculatedMorph = 0.0;
    if (scrollProgress > 0.15) {
      calculatedMorph = (scrollProgress - 0.15) / 0.70;
      calculatedMorph = Math.min(Math.max(calculatedMorph, 0.0), 1.0);
    }

    this.setMorphProgress(calculatedMorph);

    // Frame-rate independent slow globe rotation (smoothly halts as morph -> 1.0)
    const rotationDamp = 1.0 - smoothstep(0.0, 0.5, this.morphProgress);
    this.rotationY += delta * 0.15 * rotationDamp;
    this.uniforms.uRotationY.value = this.rotationY;

    // Update Interactive Markers position matching the morph trajectory
    const t = smoothstep(0.0, 1.0, this.morphProgress);
    this.locationMeshes.forEach((mesh) => {
      const { spherePos, mapPos, lonRad } = mesh.userData;

      // Rotated spherical pos
      const currentRotY = this.rotationY * (1.0 - smoothstep(0.0, 0.45, this.morphProgress));
      const cosRot = Math.cos(currentRotY);
      const sinRot = Math.sin(currentRotY);
      const rotSpherePos = new THREE.Vector3(
        spherePos.x * cosRot + spherePos.z * sinRot,
        spherePos.y,
        -spherePos.x * sinRot + spherePos.z * cosRot
      );

      // Unroll interpolation
      const unrollAngle = lonRad * (1.0 - t * 0.999);
      const unrollRadius = 2.25 / Math.max(1.0 - t * 0.92, 0.08);

      let currentMarkerPos;
      if (t < 0.99) {
        const cx = Math.sin(unrollAngle) * unrollRadius;
        const cz = (Math.cos(unrollAngle) - 1.0) * unrollRadius + 2.25 * (1.0 - t);
        const cy = mapPos.y;

        const cylPos = new THREE.Vector3(
          THREE.MathUtils.lerp(cx, mapPos.x, t * 0.6),
          THREE.MathUtils.lerp(rotSpherePos.y, cy, t),
          cz * (1.0 - t * t)
        );

        const pos1 = rotSpherePos.clone().lerp(cylPos, smoothstep(0.0, 0.5, this.morphProgress));
        currentMarkerPos = pos1.lerp(mapPos, smoothstep(0.5, 1.0, this.morphProgress));
      } else {
        currentMarkerPos = mapPos.clone();
      }

      mesh.position.copy(currentMarkerPos);

      // Look at camera in flat mode, align with sphere normal in globe mode
      if (this.morphProgress > 0.8) {
        mesh.rotation.set(0, 0, 0);
      } else {
        mesh.lookAt(0, 0, 0);
      }

      // Marker pulse
      const isSelected = this.hoveredLocation && this.hoveredLocation.id === mesh.userData.loc.id;
      const scale = isSelected ? 1.8 : 1.0 + Math.sin(time * 3.0) * 0.15;
      mesh.scale.set(scale, scale, scale);
      mesh.material.color.setHex(isSelected ? 0xd9532f : 0xf5f2ea);
    });
  }

  dispose() {
    this.scene.remove(this.group);
    this.geoBuffer.dispose();
    this.material.dispose();
    this.graticuleGeo.dispose();
    this.graticuleMat.dispose();
    this.locationMeshes.forEach((mesh) => {
      mesh.geometry.dispose();
      mesh.material.dispose();
    });
  }
}

function smoothstep(min, max, value) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}
