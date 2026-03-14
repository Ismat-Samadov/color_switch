# Color Switch — Reflex Game

> Pass the ball through spinning shapes only through the **matching color segment** — deceptively hard.

---

## Features

- **Neon dark theme** — glowing rings, particle effects, trail behind the ball
- **Three difficulty modes** — Easy / Medium / Hard (rotation speed + progression)
- **Two obstacle types** — Ring (tight gaps) and Star/Windmill (wide arms)
- **Dynamic difficulty** — obstacles spin faster as your score increases
- **Color changers** — small pulsing orbs that change your ball color mid-flight
- **Particle explosions** — on collection and death
- **Sound effects** — jump, score, color-change, death (Web Audio API — no files needed)
- **Background music** — toggleable ambient synth arpeggio
- **High score** — persisted in `localStorage`
- **Pause / resume** — Escape key or pause button
- **Fully responsive** — works on desktop, tablet, and mobile
- **Touch controls** — tap anywhere to jump on mobile
- **Animated UI** — Framer Motion transitions between all screens

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Rendering | HTML5 Canvas |
| Audio | Web Audio API (synthesized) |
| Persistence | `localStorage` |
| Deploy | Vercel (zero config) |

---

## Controls

### Desktop
| Action | Key / Input |
|--------|-------------|
| Jump | `Space`, `↑ Arrow`, or Left Click |
| Pause | `Esc` |
| Resume | `Esc` |

### Mobile
| Action | Input |
|--------|-------|
| Jump | Tap anywhere on screen |
| Pause | Tap the pause button (top-right) |

---

## How to Play

1. Your ball falls due to gravity; **tap / click to jump** upward.
2. Spinning rings appear above — each ring has **4 colored segments**.
3. Your ball has a color. Pass through the **matching color** on the ring.
4. **Color changers** (small glowing orbs) change your ball's color — collect them.
5. Hitting a **wrong-color segment** = game over.
6. **Score** increments each time you clear an obstacle.
7. Rings spin faster as score grows. Survive as long as possible!

---

## Run Locally

```bash
git clone <your-repo-url>
cd color_switch
npm install
npm run dev
# open http://localhost:3000
```

---

## Deploy to Vercel

```bash
npx vercel
# or connect GitHub repo at vercel.com/new — zero configuration required
```

---

## Project Structure

```
color_switch/
├── app/
│   ├── globals.css          # Neon theme + base reset
│   ├── layout.tsx           # HTML shell + metadata
│   └── page.tsx             # Root page (mounts the game)
├── components/
│   ├── ColorSwitchGame.tsx  # Main game component (canvas + RAF loop)
│   ├── StartScreen.tsx      # Animated start / difficulty screen
│   ├── GameOverScreen.tsx   # Score summary + restart
│   ├── PauseMenu.tsx        # Pause overlay
│   └── GameUI.tsx           # In-game HUD (score, pause button)
├── hooks/
│   ├── useHighScore.ts      # localStorage high score
│   └── useSound.ts          # Web Audio API sound system
├── lib/
│   ├── constants.ts         # Physics, colors, level config
│   ├── gameEngine.ts        # State creation, physics, collision, level gen
│   └── renderer.ts          # All canvas drawing functions
├── types/
│   └── game.ts              # TypeScript type definitions
└── public/
    └── favicon.svg          # Neon ring icon
```

---

## License

MIT
