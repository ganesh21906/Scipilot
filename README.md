# Civil Engineering AI Optimizer

This is a minimal Vite + React + Tailwind project scaffolding for the "Civil Engineering AI Optimizer" dashboard.

Quick start (PowerShell):

```powershell
# install dependencies
npm install

# start dev server
npm run dev
```

Tailwind is preconfigured. The main app entry is `src/main.jsx`. The dashboard component is `src/App.jsx` and components live under `src/components/`.

Models
------
If you have a GLTF/GLB bridge model, place it at `public/models/bridge.glb`. The app will attempt to load `/models/bridge.glb` in the 3D viewer and will fall back to a procedural placeholder if the file is missing or fails to load.

Example:

 - `public/models/bridge.glb` (your GLTF file)

