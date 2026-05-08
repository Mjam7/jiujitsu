# 🥋 The Gentle Art Tracker

A minimalist, dark-mode Gi Jiu-Jitsu training app for serious practitioners.

Built with React + Vite + Tailwind CSS. Zero backend — all data stored locally in your browser.

---

## Features

### 📚 Technique Library
- 8 core BJJ categories: Guard, Pass, Submission, Back Take, Sweep, Escape, Takedown, Guard Pull
- Gi-specific grip metadata (Sleeve, Lapel, Pant, Belt grips)
- 1–10 confidence scoring with visual bar
- Reference video links (YouTube, Instagram)
- Search, filter by category, sort by name/confidence/recency

### 🎙️ Session Log
- Voice-to-text dictation via Web Speech API
- Smart technique tagging — link library moves to each session
- Session metadata: date, title, duration, type
- Full scrollable history with expandable notes

### 🗺️ Game Hub
- A-Game: Confidence 7+, trained in last 21 days
- B-Game: Confidence 4-6, active development
- C-Game / Lab: Experimental moves
- Strategy Map: Visual entry → passing → finishing flow

### 👤 Profile & Competition Tracker
- Belt + stripe selector with visual belt
- Competition log with results and footage links

---

## Stack

- React 18 + Vite
- Tailwind CSS v4
- localStorage (no backend)
- Web Speech API (voice dictation)
- Lucide React icons
- Bebas Neue / DM Mono / DM Sans fonts

---

## Getting Started

```bash
npm install
npm run dev
npm run build
```

---

## GitHub Pages Deployment

Add to vite.config.js: `base: '/your-repo-name/'`

```bash
npm install -D gh-pages
# Add "deploy": "gh-pages -d dist" to package.json scripts
npm run build && npm run deploy
```

---

## License

MIT
