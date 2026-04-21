import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 8000,
})

const SESSION_KEY = 'sorry-hadhoud-session'

export function loadSessionId() {
  try { return localStorage.getItem(SESSION_KEY) } catch { return null }
}

export function saveSessionId(id) {
  try { localStorage.setItem(SESSION_KEY, id) } catch {}
}

export async function ensureSession(playerName = 'Hadi') {
  const existing = loadSessionId()
  try {
    const { data } = await api.post('/session', {
      id: existing,
      playerName,
      userAgent: navigator.userAgent,
    })
    if (data?.session?.id) {
      saveSessionId(data.session.id)
      return data.session
    }
  } catch (err) {
    console.warn('session offline', err?.message)
  }
  return null
}

export async function logEvent(sessionId, kind, payload) {
  if (!sessionId) return
  try {
    await api.post('/event', { sessionId, kind, payload })
  } catch (err) {
    // silent — don't block the game for network errors
  }
}

export async function complete(sessionId, forgave) {
  if (!sessionId) return
  try { await api.post('/complete', { sessionId, forgave }) } catch {}
}

export async function sendMessage(sessionId, body) {
  if (!sessionId) return
  try { await api.post('/message', { sessionId, body }) } catch {}
}

export default api
