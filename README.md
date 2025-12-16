# ⚡ The Adventure Squad HQ ⚡

Welcome to the official digital headquarters of **The Adventure Squad**. This high-tech portal serves as the central hub for our mystery-solving operations, allowing operatives to access mission logs, study character profiles, and tune into our encrypted sonic frequencies.

![Adventure Squad Theme](https://img.shields.io/badge/Theme-Neon%20TRON-bf00ff)
![Status](https://img.shields.io/badge/Status-Online-00ffff)

## 🕵️ Mission Briefing

This website is custom-built for The Adventure Squad to:
- 📖 **Archive Mission Logs**: detailed reports of our latest adventures.
- 🎵 **Broadcast Sonic Data**: integrated audio player for our official anthem.
- 🦸 **Profile Operatives**: detailed stats and ability breakdowns for every squad member.
- ✍️ **Recruit & Report**: interface for submitting new mystery protocols (stories).

## 🛠️ Tech Stack

This site is powered by cutting-edge web technologies:
- **Framework**: [React Router 7](https://reactrouter.com/) (SSR & Data Loading)
- **Deployment**: [Cloudflare Workers](https://workers.cloudflare.com/)
- **Language**: TypeScript
- **Styling**: Custom CSS with a **Futuristic Neon/TRON** aesthetic.
- **Font**: 'Orbitron' & 'Inter' from Google Fonts.

## 🚀 Getting Started

To access the Adventure Squad mainframe locally:

### 1. clone the repository
```bash
git clone <repository-url>
cd adventuresquad-website
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Generate Types
Ensure Cloudflare bindings and React Router types are up to date:
```bash
npm run typegen
```

### 4. Initiate Development Protocol
Start the local development server:
```bash
npm run dev
```
Access the interface at `http://localhost:5173`.

## 🎵 Features

### Custom Audio Player
A bespoke audio player component located in the Hero section of the Home page.
- **Visualizer**: CSS-based animated bar visualizer.
- **Controls**: Play/Pause and Volume slider.
- **Track**: Plays `Adventure Squad Theme.mp3` directly from the public assets.

### Neon Glassmorphism Theme
- **Colors**: Neon Purple (`#bf00ff`) & Cyan (`#00ffff`) against a deep space background.
- **Effects**: Glowing text shadows, glass-like card backgrounds, and hover scale animations.

## 🌐 Deployment

To deploy this site to the global network (Cloudflare):

```bash
npm run deploy
```

---

*Property of The Adventure Squad. Unauthorized access is predominantly impossible.*
