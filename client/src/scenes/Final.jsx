import React, { useEffect, useState } from 'react'
import { Heart, Send } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Final({ stats, onSendMessage, onRestart }) {
  const [burst, setBurst] = useState([])
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const emojis = ['❤️','💕','💖','💗','💓']
    const items = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: 15 + Math.random() * 70,
      delay: i * 60,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }))
    setBurst(items)
    const t = setTimeout(() => setBurst([]), 2500)
    return () => clearTimeout(t)
  }, [])

  async function submit() {
    const trimmed = message.trim()
    if (!trimmed) return
    await onSendMessage?.(trimmed)
    setSent(true)
    setMessage('')
    const waUrl = `https://wa.me/96171227224?text=${encodeURIComponent(trimmed)}`
    window.open(waUrl, '_blank')
    toast.success('Opening WhatsApp… 💕')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-16 text-center relative overflow-hidden">
      {burst.map(b => (
        <span
          key={b.id}
          className="fixed text-2xl pointer-events-none"
          style={{
            left: `${b.left}%`,
            bottom: '35%',
            animation: `flyHeart 1.5s ease-out ${b.delay}ms forwards`,
          }}
        >
          {b.emoji}
        </span>
      ))}
      <style>{`
        @keyframes flyHeart {
          0%   { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-260px) scale(0.4); }
        }
      `}</style>

      <div className="text-7xl mb-3 animate-float">🥰</div>
      <h1 className="display mb-2">Thank you, Hadhoud 💖</h1>
      <p className="text-rose-600 text-lg mb-6">Thank you for forgiving me, I love you so much</p>

      <div className="card-glass max-w-lg w-full mb-6">
        <p className="prose">
          I love you so much and I promise I'll make it up to you.
          You mean everything to me.
        </p>
        {stats && (
          <div className="grid grid-cols-3 gap-2 mt-4 text-center">
            <div className="bg-white/60 rounded-xl p-2">
              <div className="text-2xl">❤️</div>
              <div className="text-xs text-rose-600 font-semibold">{stats.caught || 0} caught</div>
            </div>
            <div className="bg-white/60 rounded-xl p-2">
              <div className="text-2xl">🧠</div>
              <div className="text-xs text-rose-600 font-semibold">{stats.attempts || 0} matches</div>
            </div>
            <div className="bg-white/60 rounded-xl p-2">
              <div className="text-2xl">💌</div>
              <div className="text-xs text-rose-600 font-semibold">read</div>
            </div>
          </div>
        )}
      </div>

      {!sent ? (
        <div className="card-glass max-w-lg w-full">
          <div className="flex items-center gap-2 mb-2 text-rose-600 text-sm font-semibold uppercase tracking-widest">
            <Heart className="w-4 h-4 fill-current" /> Leave me a note
          </div>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Say anything you want (or nothing)..."
            rows={3}
            className="w-full rounded-xl border border-rose-200 bg-white/80 p-3 text-rose-800 resize-none focus:outline-none focus:ring-2 focus:ring-rose-400"
            maxLength={500}
          />
          <button onClick={submit} className="btn-primary mt-3 flex items-center gap-2 mx-auto">
            <Send className="w-4 h-4" /> Send
          </button>
        </div>
      ) : (
        <div className="card-glass max-w-lg w-full text-center">
          <p className="text-5xl mb-3">📞</p>
          <p className="prose font-semibold text-rose-700 mb-1">One more thing…</p>
          <p className="prose text-rose-600">Would you give me a call? 🥺💕</p>
        </div>
      )}

      <button onClick={onRestart} className="mt-6 text-sm text-rose-500 underline opacity-70 hover:opacity-100">
        play again
      </button>
    </div>
  )
}
