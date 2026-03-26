# The Unmasking — Project Guide

## Overview

"The Unmasking" is a masquerade-themed murder mystery game played across multiple buses. Players listen to a playlist during a trip, decode a puzzle (first letter of each song title), and enter the answer. The first correct solver per bus wins a golden ticket displayed in-game, redeemable at a bar.

**Answer: `THE BUTLER DID IT`**

---

## Architecture

### Directory Structure

```
unmasking-game/
├── src/                          # React frontend source
│   ├── components/
│   │   ├── Registration.jsx      # Form: firstName, email, busNumber
│   │   ├── Premise.jsx           # Story setup, rules, golden ticket info
│   │   ├── Game.jsx              # Letter grid puzzle input
│   │   └── ThankYou.jsx          # Result: winner / not-first / unknown
│   ├── assets/
│   │   └── hero.png              # Unused asset (343x361)
│   ├── App.jsx                   # Root component, screen state machine
│   ├── App.css                   # All component styles + animations
│   ├── index.css                 # CSS variables, theme, global resets
│   └── main.jsx                  # React entry point (createRoot)
│
├── server/                       # Express backend (local dev)
│   ├── index.js                  # Express server, static serving, SPA fallback
│   └── submit.js                 # In-memory bus winner tracking
│
├── api/                          # Vercel serverless functions (production)
│   └── submit.js                 # Upstash Redis-backed winner tracking
│
├── public/
│   ├── assets/
│   │   └── cloakedmystery.png    # Header image (654x554, background removed)
│   ├── favicon.svg
│   └── icons.svg
│
├── vercel.json                   # Vercel deployment config
├── vite.config.js                # Vite build + dev proxy config
├── eslint.config.js              # ESLint flat config
├── package.json
└── index.html                    # HTML shell with Google Fonts
```

### Frontend (React 19 + Vite)

**Screen flow (state machine in App.jsx):**

```
Registration → Premise → Game → ThankYou
```

Each screen is a component rendered conditionally based on `screen` state. Three pieces of state drive the app:

- `screen` — which component to render (`'registration'` | `'premise'` | `'game'` | `'thankyou'`)
- `user` — `{ firstName, email, busNumber }` collected at registration
- `winner` — `true` (first on bus) | `false` (someone beat them) | `null` (backend unavailable)

**Component responsibilities:**

| Component | Purpose | Key behavior |
|-----------|---------|--------------|
| `Registration` | Collect user info | Validates firstName, email (regex), busNumber. Inline error display with ARIA. |
| `Premise` | Explain the game | Personalized welcome, playlist instructions, golden ticket teaser. |
| `Game` | Letter grid puzzle | 15 inputs across 4 word groups. Auto-focus next letter, arrow key nav, backspace moves back. Submit disabled until all filled. |
| `ThankYou` | Show result | Three variants based on `winner` state. Golden ticket preview shown for winners and unknown. |

**Answer validation (client):** `guess.toUpperCase() === 'THE BUTLER DID IT'` in `handleSubmit`. Only POSTs to API if correct.

### Backend — Dual Mode

**Local development** (`server/`):
1. Express on port 3001
2. In-memory `busWinners = {}` dict
3. Vite dev server proxies `/api/*` → `localhost:3001`

**Production on Vercel** (`api/`):
1. Serverless function at `/api/submit.js`
2. Upstash Redis via `Redis.fromEnv()`
3. Atomic `setnx` on key `bus-winner:{busNumber}` — prevents race conditions

**API: POST /api/submit**

Request body:
```json
{ "firstName": "...", "email": "...", "busNumber": "...", "answer": "..." }
```

Response:
```json
{ "correct": boolean, "winner": boolean, "message": "..." }
```

Three outcomes:
1. Wrong answer → `{ correct: false }`
2. Correct but bus already won → `{ correct: true, winner: false }`
3. First on bus → `{ correct: true, winner: true }`

### Styling

**Fonts** (Google Fonts, loaded in index.html):
- `Cinzel Decorative` — headings, buttons, labels
- `Cormorant Garamond` — body text, inputs

**CSS custom properties** (defined in `index.css :root`):
- Reds: `--red` (#8B0000), `--red-light` (#C41E3A)
- Golds: `--gold` (#DAA520), `--gold-light` (#FFD700)
- Greens: `--green` (#006400), `--green-light` (#228B22)
- Backgrounds: `--bg-dark` (#1a0a0a), `--bg-card` (semi-transparent)
- Text: `--text` (#f5e6d3), `--text-muted` (#c4a882)

**Responsive breakpoints:**
- Base: mobile-first
- `400px+`: larger letter inputs
- `481px+`: larger headings, wider card padding
- `<360px`: ultra-narrow compensation (smaller grid)
- `prefers-reduced-motion`: disables all animations

**Key animations:** `float` (header image bob), `fadeIn` (card entrance), `glow` (golden ticket pulse)

---

## Development

### Prerequisites

- Node.js >= 18
- npm

### Local dev (frontend only)

```bash
npm install
npm run dev
```

Starts Vite at `http://localhost:5173`. API calls will 502 (no backend), but the game still advances to ThankYou with `winner: null`.

### Local dev (full stack)

```bash
npm install
# Terminal 1:
npm run dev
# Terminal 2:
npm run dev:server
```

Vite proxies `/api/*` to Express on port 3001. Winners tracked in-memory (resets on server restart).

### Build for production

```bash
npm run build
```

Outputs optimized SPA to `/dist`.

### All npm scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Vite dev server (port 5173) |
| `npm run dev:server` | Express backend only (port 3001) |
| `npm run dev:all` | Build + start Express (local production simulation) |
| `npm run build` | Vite production build → `/dist` |
| `npm run start` | Build + start Express |
| `npm run lint` | ESLint check |
| `npm run preview` | Preview built dist via Vite |

---

## Deployment (Vercel)

### Step 1: Import project

Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repo. Vercel auto-detects Vite via `vercel.json`.

### Step 2: Add Upstash Redis

1. In Vercel dashboard → your project → **Storage** tab
2. Browse Marketplace → add **Upstash Redis**
3. Connect the Redis store to your project
4. This auto-sets `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` as environment variables

### Step 3: Deploy

Redeploy after linking Redis so env vars take effect. Every push to `main` triggers auto-deploy.

### Step 4: Verify

- Visit your Vercel URL
- Register, complete the puzzle
- Check Upstash Redis console to see `bus-winner:*` keys

### Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `UPSTASH_REDIS_REST_URL` | Yes (production) | Upstash Redis REST endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | Yes (production) | Upstash auth token |
| `PORT` | No | Express port, defaults to 3001 (local only) |

### Vercel routing (`vercel.json`)

- `/api/*` → serverless functions in `/api/` directory
- Everything else → `/index.html` (SPA fallback)

---

## Code Conventions

- React 19 with hooks only (no class components)
- ESM throughout (`"type": "module"` in package.json)
- Functional components, `useCallback` for handlers passed as props
- CSS in two files: `index.css` (theme/global) and `App.css` (components)
- No TypeScript — plain JSX
- No test framework configured
