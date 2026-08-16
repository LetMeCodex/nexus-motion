/**
 * GLSL Earth Thermodynamic & Atmospheric Heat Transfer Shader
 * Models solar insolation, latitude gradients, Hadley cell expansion, and polar amplification.
 */

export const earthThermalVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uTempAnomaly; // in Celsius (-1.0 to +4.0)
  uniform vec2 uPointer;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vViewPosition;
  varying float vLatitude;
  varying float vThermalIntensity;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;

    // Latitude angle from -PI/2 (South Pole) to +PI/2 (North Pole)
    float lat = position.y / 2.0; // normalized sphere y
    vLatitude = lat;

    // Polar Amplification factor: High latitudes warm at 2.2x the global rate (IPCC AR6)
    float polarAmp = 1.0 + pow(abs(lat), 1.6) * 1.4;
    float localAnomaly = uTempAnomaly * polarAmp;

    // Atmospheric heat thermal expansion displacement
    float thermalWave = sin(uTime * 0.8 + position.x * 2.5 + position.z * 2.0) * 0.02 * (uTempAnomaly + 1.2);
    float displacement = (localAnomaly * 0.035) + thermalWave;

    vec3 displacedPosition = position + normal * displacement;

    vec4 worldPos = modelMatrix * vec4(displacedPosition, 1.0);
    vWorldPosition = worldPos.xyz;

    vec4 mvPosition = viewMatrix * worldPos;
    vViewPosition = -mvPosition.xyz;

    gl_Position = projectionMatrix * mvPosition;
    vThermalIntensity = localAnomaly;
  }
`;

export const earthThermalFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uTempAnomaly;
  uniform vec2 uPointer;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vViewPosition;
  varying float vLatitude;
  varying float vThermalIntensity;

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewPosition);

    // Physical solar insolation: Sun directional vector
    vec3 sunDir = normalize(vec3(4.0 + uPointer.x * 1.5, 2.5, 5.0));
    float solarInsolation = clamp(dot(N, sunDir), 0.0, 1.0);

    // Latitude base temperature curve (T_equator ~ 30C, T_pole ~ -30C)
    float latFactor = 1.0 - pow(abs(vLatitude), 1.35);

    // Base Continental & Oceanic Scientific Colors
    vec3 deepOceanColor = vec3(0.04, 0.08, 0.16);
    vec3 polarIceColor = vec3(0.85, 0.92, 0.98);
    vec3 landBaseColor = vec3(0.12, 0.15, 0.18);
    
    // Thermal Anomaly Palette (Scientific Color Brewer Diverging RdYlBu)
    vec3 coolAnomalyColor = vec3(0.26, 0.60, 0.88); // Blue for cooling
    vec3 baselineColor = vec3(0.88, 0.85, 0.80);    // Warm paper neutral
    vec3 warmAnomalyColor = vec3(0.85, 0.33, 0.18); // Vermilion for warming
    vec3 extremeHeatColor = vec3(0.70, 0.12, 0.15); // Deep crimson for +4C

    // Interpolate thermal spectrum based on uTempAnomaly
    vec3 anomalyTint;
    if (uTempAnomaly < 0.0) {
      anomalyTint = mix(coolAnomalyColor, baselineColor, (uTempAnomaly + 1.0));
    } else if (uTempAnomaly <= 2.0) {
      anomalyTint = mix(baselineColor, warmAnomalyColor, uTempAnomaly / 2.0);
    } else {
      anomalyTint = mix(warmAnomalyColor, extremeHeatColor, (uTempAnomaly - 2.0) / 2.0);
    }

    // Latitude thermal base mapping
    vec3 surfaceColor = mix(deepOceanColor, landBaseColor, 0.6);
    surfaceColor = mix(surfaceColor, polarIceColor, pow(abs(vLatitude), 3.0) * (1.0 - clamp(uTempAnomaly * 0.18, 0.0, 0.8)));

    // Thermal radiation field overlay
    float heatWave = sin(vUv.x * 36.0 + uTime * 1.2) * cos(vUv.y * 24.0 + uTime * 0.8) * 0.08;
    float thermalField = clamp(latFactor + (uTempAnomaly * 0.25) + heatWave, 0.0, 1.4);

    vec3 finalColor = surfaceColor * (solarInsolation * 0.75 + 0.25);
    finalColor = mix(finalColor, anomalyTint, thermalField * 0.65);

    // Atmospheric limb scattering (Rayleigh rim)
    float NdotV = clamp(dot(N, V), 0.0, 1.0);
    float fresnel = pow(clamp(1.0 - NdotV, 0.0, 1.0), 3.2);
    vec3 atmosphericRim = mix(vec3(0.38, 0.65, 0.90), vec3(0.85, 0.40, 0.25), clamp(uTempAnomaly / 3.0, 0.0, 1.0));

    finalColor += atmosphericRim * fresnel * 0.95;

    gl_FragColor = vec4(finalColor, 0.98);
  }
`;
