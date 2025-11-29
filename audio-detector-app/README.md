<div align="center">

# AntiFoley Audio Detector (Web UI)

Professional React interface for detecting potentially fake (synthetic/manipulated) vs authentic environmental audio. Designed as a lightweight frontend that can integrate with an existing ML model (e.g. AntiFoley PyTorch classifier).

![Status](https://img.shields.io/badge/status-demo-blue) ![Framework](https://img.shields.io/badge/react-18.2.0-61dafb) ![Build](https://img.shields.io/badge/build-vite5-success) 

</div>

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Environment Configuration](#environment-configuration)
- [Integrating a Real ML Model](#integrating-a-real-ml-model)
- [Data & Security Considerations](#data--security-considerations)
- [Project Structure](#project-structure)
- [UI/UX Notes](#uiux-notes)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## Overview
This web client provides an intuitive interface for uploading an audio file, previewing it, and viewing a classification result (Authentic vs Synthetic) along with supporting diagnostic indicators (confidence score, detected feature summaries, technical spectral/temporal/noise notes). The current implementation uses mock logic for demonstration; no real model inference is performed yet.

## Features
| Category | Capability |
|----------|------------|
| Upload & Playback | Accepts common browser-supported audio formats (e.g. WAV, MP3, OGG) and plays them inline |
| Classification UI | Displays classification (Authentic / Synthetic) plus a confidence score bar |
| Metadata | Shows file size, processed time stamp, and derived mock stats |
| Diagnostic Panels | Feature list + technical analysis placeholders (spectral / temporal / noise) |
| Responsive Layout | Mobile-friendly grid & flex design |
| Extensible Service Layer | Single integration point for replacing mock logic with real backend inference |

## Architecture
```
React (Vite) Frontend
	├─ Components: App.jsx (single-page interaction)
	├─ Service Layer: services/audioDetector.js (mock analysis, to be replaced)
	├─ Styling: App.css + index.css (utility + component styles)
	└─ Build Tool: Vite (dev server + production bundling)
```
Future integration path:
```
Browser ──► React UI ──► /api/analyze (POST audio blob or features)
											◄── JSON { isFake, confidence, features[], stats }
Backend (Python/FastAPI/Flask) ─► PyTorch Model (AntiFoley) ─► Result
```

## Getting Started
### Prerequisites
- Node.js 18+ (Recommended LTS)
- npm 9+ or yarn/pnpm equivalent

### Install
```bash
npm install
```

### Run (Development)
```bash
npm run dev
```
Open the printed local URL (usually `http://localhost:5173`).

### Build (Production)
```bash
npm run build
```
Artifacts emitted to `dist/`.

### Preview Production Build
```bash
npm run preview
```

## Available Scripts
| Script | Purpose |
|--------|---------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build (optimized) |
| `npm run preview` | Serve built assets locally for verification |

## Environment Configuration
Currently no runtime environment variables are required. When integrating a backend, you may add:
| Variable | Example | Purpose |
|----------|---------|---------|
| `VITE_API_BASE_URL` | `http://localhost:8000` | Points service layer to backend inference API |

Example usage in code:
```js
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
```

## Integrating a Real ML Model
Replace mock analysis in `src/services/audioDetector.js` with an API call:
```js
export const analyzeAudio = async (file) => {
	const form = new FormData();
	form.append('file', file);
	const res = await fetch(`${API_BASE}/api/analyze`, { method: 'POST', body: form });
	if (!res.ok) throw new Error('Inference failed');
	return await res.json(); // { isFake, confidence, features, ... }
};
```
Backend suggestion (Python FastAPI pseudo):
```python
@app.post('/api/analyze')
def analyze(file: UploadFile):
		waveform = load_audio(file)
		features = extract_features(waveform)
		pred, conf = model.predict(features)
		return {"isFake": bool(pred), "confidence": round(conf*100, 2), "features": feature_descriptions}
```

## Data & Security Considerations
- Client-side does not persist audio; object URLs revoked when component resets.
- For production: enforce file size/type validation server-side (MIME + magic bytes).
- Consider rate limiting and auth if exposing public inference endpoint.
- If storing user audio, comply with privacy regulations (GDPR, etc.).

## Project Structure
```
audio-detector-app/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   ├── index.css
│   └── services/
│       └── audioDetector.js
└── README.md
```

## UI/UX Notes
- Minimal, professional visual design (no emojis) for analytical context.
- Confidence bar + badges reinforce classification clarity.
- Sectioned diagnostic panels help future explainability integration.

## Roadmap
- [ ] Replace mock logic with real AntiFoley inference API
- [ ] Add drag & drop zone
- [ ] Batch analysis support
- [ ] Accessibility refinement (ARIA labels + focus states)
- [ ] Dark mode theme
- [ ] Unit tests (Jest + React Testing Library)
- [ ] Audio waveform visualization (Canvas/WebAudio API)
- [ ] Internationalization (i18n)

## Contributing
Pull requests welcome. Suggested flow:
1. Fork repository
2. Create feature branch (`git checkout -b feat/waveform`)
3. Commit changes (`git commit -m "Add waveform visualization"`)
4. Push branch (`git push origin feat/waveform`)
5. Open PR with clear description & screenshots

Coding guidelines:
- Keep components small & purpose-driven.
- Avoid heavy state in root; consider future context/hooks refactor.
- Prefer semantic HTML for accessibility.

## License
This UI layer references the overall project license found in the parent repository (`LICENSE`). If absent, consider applying a permissive license (e.g., MIT) for distribution.

## Disclaimer
The current version produces synthetic results for demonstration only. Do **not** rely on these outputs for forensic or compliance decisions until integrated with a validated model.

---
For questions or integration help, open an issue or discussion thread.
