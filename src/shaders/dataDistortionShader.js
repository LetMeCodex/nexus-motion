/**
 * GLSL Holographic Point Matrix & Data Distortion Shader (Section 6)
 * High-precision volumetric nodes restructuring from entropy into ordered cylindrical schematics.
 */

export const dataDistortionVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uProgress; // 0.0 = total chaos, 1.0 = structured crystal matrix
  uniform float uTimeDilation;
  uniform vec3 uPointer;

  attribute vec3 aTargetPosition;
  attribute vec3 aChaosPosition;
  attribute float aRandomOffset;
  attribute vec3 aColor;

  varying vec3 vColor;
  varying float vChaosLevel;
  varying vec3 vViewPosition;

  void main() {
    float eased = smoothstep(0.0, 1.0, uProgress);
    vec3 currentPos = mix(aChaosPosition, aTargetPosition, eased);

    // Subtle time dilation oscillation
    float pulse = sin(uTime * 1.5 * uTimeDilation + aRandomOffset * 6.28) * (1.0 - eased * 0.7);
    currentPos += normalize(currentPos + vec3(0.001)) * pulse * 0.15;

    // Pointer magnetic deflection
    vec3 toPointer = currentPos - uPointer * 5.0;
    float dist = length(toPointer);
    if (dist < 4.0 && dist > 0.001) {
      currentPos += normalize(toPointer) * (1.0 - dist / 4.0) * 0.6;
    }

    vec4 mvPosition = modelViewMatrix * vec4(currentPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Point size with safe distance divisor
    gl_PointSize = clamp((18.0 + (1.0 - eased) * 10.0) / max(-mvPosition.z, 0.1), 1.5, 36.0);

    vColor = aColor;
    vChaosLevel = 1.0 - eased;
    vViewPosition = -mvPosition.xyz;
  }
`;

export const dataDistortionFragmentShader = /* glsl */ `
  uniform float uTime;
  varying vec3 vColor;
  varying float vChaosLevel;
  varying vec3 vViewPosition;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float dist = length(uv);
    if (dist > 0.5) discard;

    // Fine holographic scanline
    float scanline = sin(gl_PointCoord.y * 24.0 + uTime * 4.0) * 0.12 + 0.88;

    float glow = exp(-dist * 4.0);
    float core = smoothstep(0.15, 0.0, dist);

    vec3 nodeColor = vColor * scanline;
    float alpha = (glow * 0.75 + core * 0.65);

    gl_FragColor = vec4(nodeColor, alpha);
  }
`;
