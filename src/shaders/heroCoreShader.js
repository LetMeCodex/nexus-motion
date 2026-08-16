/**
 * GLSL Liquid Titanium & Optical Dispersion Shader for Section 1: Hero Core
 * High-agency technical director material: physical roughness, micro-faceting, spectral dispersion.
 */

export const heroCoreVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uDistortion;
  uniform float uFrequency;
  uniform float uSpeed;
  uniform vec2 uPointer;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;
  varying float vDisplacement;

  // 3D Simplex noise implementation
  vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    
    // Multi-frequency noise deformation
    float t = uTime * uSpeed;
    vec3 noisePos = position * uFrequency + vec3(uPointer * 0.4, t);
    
    float noise1 = snoise(noisePos);
    float noise2 = snoise(noisePos * 2.2 + vec3(5.2, 1.3, 7.8)) * 0.45;
    float noise3 = snoise(noisePos * 4.5 - vec3(1.7, 6.2, 0.4)) * 0.2;
    
    float totalNoise = (noise1 + noise2 + noise3) * uDistortion;
    vDisplacement = totalNoise;

    vec3 displaced = position + normal * totalNoise;

    vec4 worldPos = modelMatrix * vec4(displaced, 1.0);
    vWorldPosition = worldPos.xyz;

    vec4 mvPosition = viewMatrix * worldPos;
    vViewPosition = -mvPosition.xyz;

    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const heroCoreFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColorBase;
  uniform vec3 uColorAccent;
  uniform vec3 uColorRim;
  uniform float uRoughness;
  uniform float uIridescence;
  uniform vec2 uPointer;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;
  varying float vDisplacement;

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewPosition);
    
    // Physical Fresnel calculation
    float NdotV = clamp(dot(N, V), 0.0, 1.0);
    float fresnel = pow(clamp(1.0 - NdotV, 0.0, 1.0), 3.2);
    
    // Refined subtle spectral dispersion (neutral titanium prism shimmer)
    vec3 spectralColor;
    spectralColor.r = sin(fresnel * 3.1415 + 0.0 + uTime * 0.15) * 0.15 + 0.85;
    spectralColor.g = sin(fresnel * 3.1415 + 1.05 + uTime * 0.15) * 0.15 + 0.85;
    spectralColor.b = sin(fresnel * 3.1415 + 2.09 + uTime * 0.15) * 0.2 + 0.80;

    // Studio 3-point softbox lighting
    vec3 keyLightDir = normalize(vec3(4.0 + uPointer.x * 1.5, 7.0, 5.0));
    vec3 fillLightDir = normalize(vec3(-5.0, -3.0, -3.0));
    vec3 rimLightDir = normalize(vec3(0.0, 8.0, -6.0));

    float diffKey = clamp(dot(N, keyLightDir), 0.0, 1.0);
    float diffFill = clamp(dot(N, fillLightDir), 0.0, 1.0) * 0.25;
    float rimLight = pow(clamp(dot(N, rimLightDir), 0.0, 1.0), 4.0) * 1.2;

    // Micro-facet specular sheen
    vec3 H = normalize(keyLightDir + V);
    float spec = pow(clamp(dot(N, H), 0.0, 1.0), 48.0 * (1.0 - uRoughness * 0.7));

    // Internal sub-surface luminescence
    vec3 subSurface = uColorAccent * smoothstep(-0.2, 0.4, vDisplacement) * 0.6;

    // Composite: Liquid Titanium / Obsidian Finish
    vec3 finalColor = uColorBase * (diffKey * 0.85 + diffFill + 0.12);
    finalColor = mix(finalColor, spectralColor * 0.9, uIridescence * fresnel * 0.5);
    finalColor += uColorRim * (fresnel * 0.8 + rimLight * 0.6);
    finalColor += vec3(spec * 1.25);
    finalColor += subSurface;

    gl_FragColor = vec4(finalColor, 0.96);
  }
`;
