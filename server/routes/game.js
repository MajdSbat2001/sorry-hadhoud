import { Router } from 'express'
import { nanoid } from 'nanoid'
import db from '../db.js'

const router = Router()
const now = () => new Date().toISOString()

// Start or resume a session
router.post('/session', (req, res) => {
  const { id, playerName, userAgent } = req.body || {}
  if (id) {
    const existing = db.prepare('SELECT * FROM sessions WHERE id = ?').get(id)
    if (existing) {
      db.prepare('UPDATE sessions SET last_seen_at = ? WHERE id = ?').run(now(), id)
      return res.json({ session: existing, resumed: true })
    }
  }
  const newId = nanoid(12)
  const t = now()
  db.prepare(`INSERT INTO sessions (id, player_name, started_at, last_seen_at, user_agent)
              VALUES (?, ?, ?, ?, ?)`).run(newId, playerName || 'Hadi', t, t, userAgent || '')
  const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(newId)
  res.json({ session, resumed: false })
})

// Log an event (level_complete, heart_caught, etc.)
router.post('/event', (req, res) => {
  const { sessionId, kind, payload } = req.body || {}
  if (!sessionId || !kind) return res.status(400).json({ error: 'sessionId and kind required' })
  const exists = db.prepare('SELECT 1 FROM sessions WHERE id = ?').get(sessionId)
  if (!exists) return res.status(404).json({ error: 'session not found' })
  const t = now()
  db.prepare(`INSERT INTO events (session_id, kind, payload, created_at)
              VALUES (?, ?, ?, ?)`).run(sessionId, kind, payload ? JSON.stringify(payload) : null, t)
  db.prepare('UPDATE sessions SET last_seen_at = ? WHERE id = ?').run(t, sessionId)
  res.json({ ok: true })
})

// Complete a session
router.post('/complete', (req, res) => {
  const { sessionId, forgave } = req.body || {}
  if (!sessionId) return res.status(400).json({ error: 'sessionId required' })
  db.prepare(`UPDATE sessions
              SET completed_at = ?, forgave = ?
              WHERE id = ?`).run(now(), forgave ? 1 : 0, sessionId)
  res.json({ ok: true })
})

// Leave a message for her
router.post('/message', (req, res) => {
  const { sessionId, body } = req.body || {}
  if (!sessionId || !body) return res.status(400).json({ error: 'sessionId and body required' })
  const trimmed = String(body).slice(0, 1000)
  db.prepare(`INSERT INTO messages (session_id, body, created_at)
              VALUES (?, ?, ?)`).run(sessionId, trimmed, now())
  res.json({ ok: true })
})

export default router
