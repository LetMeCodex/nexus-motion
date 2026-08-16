/**
 * GLSL Graticule Lines Morph Shader
 * Parallels and Meridians dynamically straightening into a Cartesian equirectangular grid.
 */

export const graticuleVertexShader = /* glsl */ `
  uniform float uMorph;
  uniform float uRotationY;

  attribute vec3 aSpherePos;
  attribute vec3 aMapPos;
  attribute vec2 aGeoCoord;

  varying float vMorph;
  varying vec2 vGeoCoord;

  void main() {
    vMorph = uMorph;
    vGeoCoord = aGeoCoord;

    float currentRotY = uRotationY * (1.0 - smoothstep(0.0, 0.45, uMorph));
    float cosRot = cos(currentRotY);
    float sinRot = sin(currentRotY);
    vec3 rotatedSpherePos = vec3(
      aSpherePos.x * cosRot + aSpherePos.z * sinRot,
      aSpherePos.y,
      -aSpherePos.x * sinRot + aSpherePos.z * cosRot
    );

    float t = smoothstep(0.0, 1.0, uMorph);
    float lon = aGeoCoord.x;
    float lat = aGeoCoord.y;

    float unrollAngle = lon * (1.0 - t * 0.999);
    float unrollRadius = 2.22 / max(1.0 - t * 0.92, 0.08);

    vec3 finalPos;
    if (t < 0.99) {
      float cx = sin(unrollAngle) * unrollRadius;
      float cz = (cos(unrollAngle) - 1.0) * unrollRadius + 2.22 * (1.0 - t);
      float cy = aMapPos.y;

      vec3 cylindricalPos = vec3(
        mix(cx, aMapPos.x, t * 0.6),
        mix(rotatedSpherePos.y, cy, t),
        cz * (1.0 - t * t)
      );

      finalPos = mix(rotatedSpherePos, cylindricalPos, smoothstep(0.0, 0.5, uMorph));
      finalPos = mix(finalPos, aMapPos, smoothstep(0.5, 1.0, uMorph));
    } else {
      finalPos = aMapPos;
    }

    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const graticuleFragmentShader = /* glsl */ `
  uniform float uMorph;
  varying float vMorph;
  varying vec2 vGeoCoord;

  void main() {
    // Subtle Vercel technical drafting hairline (0.35 opacity on globe -> 0.20 on flat map)
    float alpha = mix(0.25, 0.15, vMorph);
    
    // Equator and Prime meridian slightly more defined
    if (abs(vGeoCoord.y) < 0.02 || abs(vGeoCoord.x) < 0.02) {
      alpha = mix(0.45, 0.35, vMorph);
    }

    gl_FragColor = vec4(0.85, 0.88, 0.92, alpha);
  }
`;
