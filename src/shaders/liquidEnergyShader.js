/**
 * GLSL Liquid Obsidian & Mercurial Wave Shader (Section 5)
 * Viscous liquid metal dynamics driven by scroll velocity and multi-frequency wave interference
 */

export const liquidEnergyVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uVelocity;
  uniform float uBaseAmplitude;
  uniform float uFrequency;
  uniform vec2 uPointer;
  uniform float uPointerDistort;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vElevation;
  varying vec2 vUv;
  varying vec3 vViewPosition;

  // 2D Simplex noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise2D(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vUv = uv;
    vec3 pos = position;
    float t = uTime * uSpeed;

    // Harmonic wave interference
    float wave1 = sin(pos.x * uFrequency + t * 1.1) * cos(pos.y * uFrequency * 0.9 + t * 0.7);
    float wave2 = sin(pos.x * uFrequency * 2.1 - t * 1.3 + 1.2) * sin(pos.y * uFrequency * 1.7 + t * 1.0) * 0.4;
    float wave3 = sin(pos.x * uFrequency * 3.8 + t * 2.1) * 0.15;
    
    // Simplex noise fluid layer
    float noise = snoise2D(vec2(pos.x * 0.22, pos.y * 0.22) + vec2(t * 0.15)) * 0.5;

    // Pointer disturbance ripple
    float pointerDist = length(pos.xy - uPointer * 7.5);
    float ripple = exp(-pointerDist * 0.45) * sin(pointerDist * 2.8 - t * 3.5) * uPointerDistort;

    float totalAmp = uBaseAmplitude + abs(uVelocity) * 1.4;
    float elevation = (wave1 + wave2 + wave3 + noise + ripple) * totalAmp;

    pos.z += elevation;
    vElevation = elevation;
    vPosition = pos;

    float offset = 0.05;
    float nX = sin((pos.x + offset) * uFrequency + t) - sin((pos.x - offset) * uFrequency + t);
    float nY = cos((pos.y + offset) * uFrequency + t) - cos((pos.y - offset) * uFrequency + t);
    vec3 computedNormal = normalize(vec3(-nX * totalAmp, -nY * totalAmp, 1.0));
    vNormal = normalize(normalMatrix * computedNormal);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const liquidEnergyFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColorDeep;
  uniform vec3 uColorCrest;
  uniform vec3 uColorSpecular;
  uniform float uVelocity;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vElevation;
  varying vec2 vUv;
  varying vec3 vViewPosition;

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewPosition);

    // Fresnel reflection
    float NdotV = clamp(dot(N, V), 0.0, 1.0);
    float fresnel = pow(clamp(1.0 - NdotV, 0.0, 1.0), 3.5);

    // Elevation gradient mapping
    float normalizedElevation = smoothstep(-1.2, 1.6, vElevation);
    vec3 baseColor = mix(uColorDeep, uColorCrest, normalizedElevation * 0.65);

    // Physical studio lighting
    vec3 lightDir = normalize(vec3(3.5, 6.0, 4.5));
    vec3 H = normalize(lightDir + V);
    float spec = pow(clamp(dot(N, H), 0.0, 1.0), 40.0);

    // Subtle titanium edge shimmer
    vec2 grid = abs(sin(vUv * 3.14159 * 36.0));
    float gridGlow = pow(clamp(grid.x * grid.y, 0.0, 1.0), 10.0) * 0.12;

    vec3 finalColor = baseColor + (uColorSpecular * spec * 1.2) + (fresnel * uColorCrest * 0.6) + vec3(gridGlow);

    gl_FragColor = vec4(finalColor, 0.94);
  }
`;
