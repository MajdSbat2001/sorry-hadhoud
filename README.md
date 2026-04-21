# Sorry Hadhoud 💕

A full-stack apology game for the most amazing boyfriend.

A four-level interactive quest where he has to catch hearts, match memories,
read a love letter, and get cornered by a runaway "No" button until he accepts.

## Stack

- **Frontend:** React 18 + Vite + Tailwind CSS v3 + lucide-react + react-hot-toast
- **Backend:** Express.js + better-sqlite3
- **Why a backend?** So his session (hearts caught, levels completed, any notes he leaves)
  is persisted — he can close the tab and come back, and you'll have a little record too.

## Structure

```
sorry-hadhoud/
├── server/
│   ├── index.js
│   ├── db.js
│   └── routes/game.js
├── client/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── components/
│   │   │   ├── FloatingHearts.jsx
│   │   │   └── Progress.jsx
│   │   └── scenes/
│   │       ├── Start.jsx
│   │       ├── HeartCatcher.jsx
│   │       ├── MemoryMatch.jsx
│   │       ├── LoveLetter.jsx
│   │       ├── Apology.jsx
│   │       └── Final.jsx
│   ├── index.html
│   └── vite.config.js
└── package.json
```

## Run locally

```bash
# Install everything
npm run install:all

# Dev mode (client + server together)
npm run dev
# → Client at http://localhost:5174
# → Server at http://localhost:4000

# Production mode
npm run build        # builds the client
npm start            # serves everything from the Express server on :4000
```

## Levels

1. **Heart Catcher** — catch 10 falling hearts. Each one reveals a reason he is loved.
2. **Memory Match** — flip cards to match 6 pairs of memories.
3. **Love Letter** — a typewriter-style letter.
4. **Apology** — the classic, but the "No" button cycles through guilt-tripping messages,
   starts shrinking, then runs around the screen so he can't say no.
5. **Final** — a celebration with stats and a little text field for him to reply.

## Notes

- Session IDs are stored in `localStorage` so he can return to the game.
- The SQLite DB lives at `server/sorry.db` — gitignore it if you don't want the dev
  data tracked.
- The whole thing is mobile-friendly (touch controls, safe-area insets, responsive).
