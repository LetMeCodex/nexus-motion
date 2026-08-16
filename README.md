# Nexus — The Living Atlas

> An interactive scientific instrument exploring Earth systems through real-time SVG and WebGL cartography.

Nexus transforms planetary data into an interconnected visual journey across heat transport, water cycles, urban thermal dynamics, hidden subterranean networks, extreme events, and cross-system dependencies.

## Live Experience & Architecture

The instrument runs as a high-performance, zero-dependency interactive application (`index.html`) using Three.js and custom GLSL shaders:

- **Continuous Overture Transformation**: Mathematical SVG-to-WebGL morphology from editorial typography (`EARTH`) into fragmented matter, dynamic particle fields, a Natural Earth 3D globe, and an equirectangular world map.
- **Dynamic Chapter Color Engine**: Physical nocturnal cartography palette shifts across environmental color temperatures:
  - `00 Origin` — Neutral Mineral (`#0B0A08` / `#A84432`)
  - `01 Heat` — Warm Volcanic (`#1A0D08` / `#C94A32`)
  - `02 Water` — Cool Humid Teal (`#07191A` / `#5F9993`)
  - `03 Cities` — Industrial Warm Concrete (`#17130F` / `#B87949`)
  - `04 Network` — Dark Electronic Burgundy (`#160D13` / `#A85C68`)
  - `05 Extremes` — Cinnabar & Ash Stress (`#190B08` / `#C74732`)
  - `06 Connections` — Calm Brass Network (`#0D0D0A` / `#B79A68`)
  - `07 Close` — Return to Origin (`#0B0A08` / `#A84432`)
- **Atmospheric Lighting & Optical Vignette**: Real-time radial environmental light fields and tinted peripheral falloff derived from the master theme state.
- **Interactive Earth Systems**:
  - Global circulation & poleward heat transport controls
  - 5-stage closed-loop water cycle tracking
  - Urban Heat Island (UHI) surface simulator with 5x5 thermal diffusion
  - 4-layer subterranean infrastructure network (Power, Water, Transport, Data) with demand pulses
  - Terrain stress regimes (flood vs. wildfire ignition)
  - Interactive multi-node dependency mechanism graph

## Quick Start

Simply serve `index.html` with any static web server:

```bash
# Using Python
python -m http.server 8000

# Using Node / npx
npx serve .
```

Open `http://localhost:8000` in your browser.
