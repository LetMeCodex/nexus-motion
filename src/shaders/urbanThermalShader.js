/**
 * GLSL Urban Heat Island Thermal Radiative Shader
 * Models concrete albedo, canyon radiation trapping, and evaporative cooling buffers.
 */

export const urbanThermalVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uDensity;       // 0.0 to 1.0 (Building canyon trapping)
  uniform float uVegetation;    // 0.0 to 1.0 (Evapotranspiration cooling)
  uniform float uConcreteAlbedo;// 0.0 to 1.0 (Surface absorption)

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying float vHeatIntensity;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;

    // Urban heat island temperature formula:
    // deltaT = (Density * 4.2) + (ConcreteAbsorption * 3.5) - (Vegetation * 3.8)
    float heatEffect = (uDensity * 0.55) + ((1.0 - uConcreteAlbedo) * 0.45) - (uVegetation * 0.65);
    vHeatIntensity = clamp(heatEffect, 0.0, 1.2);

    // Heat plume shimmering expansion
    float shimmer = sin(uTime * 2.5 + position.x * 4.0 + position.z * 4.0) * 0.03 * vHeatIntensity;
    vec3 displaced = position;
    if (position.y > 0.1) {
      displaced.y += shimmer;
    }

    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const urbanThermalFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uDensity;
  uniform float uVegetation;
  uniform float uWaterProximity;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying float vHeatIntensity;

  void main() {
    vec3 N = normalize(vNormal);
    vec3 sunLight = normalize(vec3(3.0, 6.0, 2.5));
    float diff = clamp(dot(N, sunLight), 0.15, 1.0);

    // Structural building tone (Swiss graphite)
    vec3 buildingBase = vec3(0.16, 0.18, 0.22);
    
    // Thermal heat infrared gradient: Cool Slate (20C) -> Amber (32C) -> Vermilion (42C+)
    vec3 coolCity = vec3(0.25, 0.35, 0.45);
    vec3 warmCity = vec3(0.85, 0.55, 0.20);
    vec3 extremeHeat = vec3(0.88, 0.22, 0.18);

    vec3 heatColor = mix(coolCity, warmCity, clamp(vHeatIntensity, 0.0, 1.0));
    if (vHeatIntensity > 0.7) {
      heatColor = mix(warmCity, extremeHeat, (vHeatIntensity - 0.7) / 0.5);
    }

    // Facet grid line for architectural drafting feel
    vec2 grid = abs(fract(vUv * 8.0 - 0.5) - 0.5) / fwidth(vUv * 8.0);
    float line = min(grid.x, grid.y);
    float edgeGlow = 1.0 - min(line, 1.0);

    vec3 finalColor = mix(buildingBase, heatColor, vHeatIntensity * 0.85) * diff;
    finalColor += vec3(edgeGlow * 0.15);

    gl_FragColor = vec4(finalColor, 0.95);
  }
`;
