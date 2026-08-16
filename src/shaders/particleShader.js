/**
 * GLSL Particle Shader for Section 3: Quantum Particle Field
 * Optical bokeh falloff, subtle chromatic depth defocus, and kinetic momentum.
 */

export const particleVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uMorphA;
  uniform float uMorphB;
  uniform float uMorphC;
  uniform float uMorphD;
  uniform vec3 uPointer;
  uniform float uPointerRadius;
  uniform float uPointerStrength;
  uniform float uScrollVelocity;

  attribute vec3 aPositionB;
  attribute vec3 aPositionC;
  attribute vec3 aPositionD;
  attribute float aScale;
  attribute vec3 aColor;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vDepth;

  void main() {
    // 4-way weighted position blend
    vec3 blendedPos = position * uMorphA + 
                      aPositionB * uMorphB + 
                      aPositionC * uMorphC + 
                      aPositionD * uMorphD;

    // Organic harmonic micro-drift
    float wave = sin(uTime * 1.2 + blendedPos.x * 1.8 + blendedPos.y * 1.2) * 0.05;
    blendedPos.y += wave;
    blendedPos.z += cos(uTime * 1.0 + blendedPos.x * 1.5) * 0.05;

    // Pointer repulsion & gentle vortex swirl
    vec3 toPointer = blendedPos - uPointer;
    float distToPointer = length(toPointer);
    if (distToPointer < uPointerRadius && distToPointer > 0.001) {
      float force = (1.0 - distToPointer / uPointerRadius) * uPointerStrength;
      vec3 repelDir = normalize(toPointer);
      vec3 swirlDir = cross(repelDir, vec3(0.0, 0.0, 1.0));
      blendedPos += (repelDir * force * 1.4 + swirlDir * force * 0.8);
    }

    // Scroll velocity kinetic expansion
    blendedPos += normalize(blendedPos + vec3(0.001)) * abs(uScrollVelocity) * 0.25;

    vec4 mvPosition = modelViewMatrix * vec4(blendedPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Distance attenuation for size (soft optical bokeh)
    float sizeFactor = (uSize * aScale * uPixelRatio) / max(-mvPosition.z, 0.1);
    gl_PointSize = clamp(sizeFactor, 1.5, 48.0);

    vColor = aColor;
    vDepth = -mvPosition.z;
    vAlpha = clamp(1.0 - (vDepth / 30.0), 0.12, 0.95);
  }
`;

export const particleFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vDepth;

  void main() {
    // Optical Gaussian circle with soft lens blur
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    float glow = exp(-dist * 5.0);
    float core = smoothstep(0.12, 0.0, dist);

    // Refined monochromatic / titanium blend
    vec3 mixedColor = mix(vColor, uColorA, 0.25);
    mixedColor = mix(mixedColor, vec3(1.0), core * 0.5);

    float finalAlpha = (glow * 0.65 + core * 0.75) * vAlpha;

    gl_FragColor = vec4(mixedColor, finalAlpha);
  }
`;
