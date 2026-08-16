/**
 * GLSL Shader for Geometric Globe-to-World-Map Physical Transformation
 * Interpolates every vertex between spherical coordinates and equirectangular planar coordinates.
 */

export const globeMapVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;       // 0.0 = 3D Globe, 1.0 = Flat World Map
  uniform float uRotationY;    // Globe spin angle around Y axis
  uniform float uPixelRatio;
  uniform vec2 uPointer;
  uniform vec2 uHoveredCoord; // Lon, Lat of hovered point
  uniform float uIsHovered;

  attribute vec3 aSpherePos;
  attribute vec3 aMapPos;
  attribute float aIsLand;
  attribute float aPointId;
  attribute vec2 aGeoCoord;   // x = longitude (-PI to PI), y = latitude (-PI/2 to PI/2)

  varying vec3 vPosition;
  varying float vIsLand;
  varying float vMorph;
  varying float vDistToHover;
  varying vec2 vUv;

  void main() {
    vIsLand = aIsLand;
    vMorph = uMorph;
    vUv = uv;

    // 1. Calculate Rotated Spherical Position (only active on globe state)
    // As globe flattens (uMorph -> 1.0), globe rotation aligns to central Prime Meridian
    float currentRotY = uRotationY * (1.0 - smoothstep(0.0, 0.45, uMorph));
    
    // Rotate spherePos around Y axis
    float cosRot = cos(currentRotY);
    float sinRot = sin(currentRotY);
    vec3 rotatedSpherePos = vec3(
      aSpherePos.x * cosRot + aSpherePos.z * sinRot,
      aSpherePos.y,
      -aSpherePos.x * sinRot + aSpherePos.z * cosRot
    );

    // 2. Continuous Unrolling / Curvature Transformation Mathematics
    // Smooth step easing for natural physical deformation
    float t = smoothstep(0.0, 1.0, uMorph);

    // Intermediate unrolling cylinder curvature:
    // Longitude angle unwraps progressively from center outward
    float lon = aGeoCoord.x;
    float lat = aGeoCoord.y;
    
    // Unrolling arc calculation
    float unrollAngle = lon * (1.0 - t * 0.999);
    float unrollRadius = 2.2 / max(1.0 - t * 0.92, 0.08);
    
    vec3 intermediatePos;
    if (t < 0.99) {
      // Cylinder peeling unroll transition
      float cx = sin(unrollAngle) * unrollRadius;
      float cz = (cos(unrollAngle) - 1.0) * unrollRadius + 2.2 * (1.0 - t);
      float cy = aMapPos.y;
      
      vec3 cylindricalPos = vec3(
        mix(cx, aMapPos.x, t * 0.6),
        mix(rotatedSpherePos.y, cy, t),
        cz * (1.0 - t * t)
      );
      
      intermediatePos = mix(rotatedSpherePos, cylindricalPos, smoothstep(0.0, 0.5, uMorph));
      intermediatePos = mix(intermediatePos, aMapPos, smoothstep(0.5, 1.0, uMorph));
    } else {
      // Perfectly flat map at uMorph == 1.0
      intermediatePos = aMapPos;
    }

    // Interactive pointer gentle elevation
    vec3 finalPos = intermediatePos;

    // Calculate proximity to hovered geographic coordinate
    float distGeo = length(aGeoCoord - uHoveredCoord);
    vDistToHover = distGeo;

    if (distGeo < 0.25 && uIsHovered > 0.5) {
      float lift = (1.0 - distGeo / 0.25) * 0.15;
      finalPos.z += lift;
    }

    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Point size with distance attenuation and landmass emphasis
    float baseSize = aIsLand > 0.5 ? 4.5 : 2.5;
    if (uMorph > 0.8) baseSize = aIsLand > 0.5 ? 4.0 : 2.0;
    
    // Hover size boost
    if (distGeo < 0.25 && uIsHovered > 0.5) {
      baseSize += (1.0 - distGeo / 0.25) * 4.0;
    }

    gl_PointSize = clamp((baseSize * uPixelRatio * 1.5) / max(-mvPosition.z, 0.1), 1.0, 18.0);
    vPosition = finalPos;
  }
`;

export const globeMapFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;
  uniform float uIsHovered;

  varying vec3 vPosition;
  varying float vIsLand;
  varying float vMorph;
  varying float vDistToHover;
  varying vec2 vUv;

  void main() {
    // Soft circular Gaussian point shape
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    // Vercel Minimalist Monochromatic Color Calibration:
    // Landmass: crisp soft white / platinum (0.92, 0.95, 0.98)
    // Ocean: deep muted charcoal/slate points (0.22, 0.25, 0.30)
    // Hover: warm incandescent highlight (1.0, 0.98, 0.95)

    vec3 landColor = vec3(0.92, 0.95, 0.98);
    vec3 oceanColor = vec3(0.18, 0.22, 0.28);
    vec3 hoverColor = vec3(0.98, 0.98, 1.0);

    vec3 pointColor = vIsLand > 0.5 ? landColor : oceanColor;

    // Soft core Gaussian falloff
    float core = smoothstep(0.48, 0.0, dist);
    float alpha = vIsLand > 0.5 ? 0.90 : 0.25;

    // Proximity to hover highlight
    if (vDistToHover < 0.25 && uIsHovered > 0.5) {
      float highlight = 1.0 - (vDistToHover / 0.25);
      pointColor = mix(pointColor, hoverColor, highlight);
      alpha = mix(alpha, 1.0, highlight);
    }

    gl_FragColor = vec4(pointColor, alpha * core);
  }
`;
