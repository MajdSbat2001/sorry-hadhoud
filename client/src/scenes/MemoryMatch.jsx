import React, { useEffect, useMemo, useState } from 'react'

const PAIRS = [
  { id: 'laugh',  emoji: '😂', text: 'the way you laugh' },
  { id: 'hug',    emoji: '🤗', text: 'your hugs' },
  { id: 'smart',  emoji: '🧠', text: 'your mind' },
  { id: 'eyes',   emoji: '👀', text: 'your eyes' },
  { id: 'voice',  emoji: '🎵', text: 'your voice' },
  { id: 'home',   emoji: '🏡', text: 'being home with you' },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function MemoryMatch({ onComplete, onEvent }) {
  const [cards, setCards] = useState(() => {
    const doubled = [...PAIRS, ...PAIRS].map((p, i) => ({ ...p, uid: i }))
    return shuffle(doubled)
  })
  const [flipped, setFlipped] = useState([]) // indices currently showing
  const [matched, setMatched] = useState(new Set())
  const [attempts, setAttempts] = useState(0)
  const [lock, setLock] = useState(false)
  const [revealText, setRevealText] = useState(null)

  useEffect(() => {
    if (matched.size === PAIRS.length * 2) {
      setTimeout(() => onComplete?.({ attempts }), 700)
    }
  }, [matched, attempts, onComplete])

  function handleClick(uid) {
    if (lock) return
    if (matched.has(uid)) return
    if (flipped.includes(uid)) return

    const next = [...flipped, uid]
    setFlipped(next)

    if (next.length === 2) {
      setAttempts(a => a + 1)
      const [aUid, bUid] = next
      const a = cards.find(c => c.uid === aUid)
      const b = cards.find(c => c.uid === bUid)
      if (a.id === b.id) {
        const m = new Set(matched)
        m.add(aUid); m.add(bUid)
        setMatched(m)
        setFlipped([])
        setRevealText(a.text)
        onEvent?.('memory_match', { id: a.id })
        setTimeout(() => setRevealText(null), 1400)
      } else {
        setLock(true)
        setTimeout(() => { setFlipped([]); setLock(false) }, 800)
      }
    }
  }

  const progress = matched.size / (PAIRS.length * 2)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-6 pt-16">
      <div className="w-full max-w-md mb-3 text-center">
        <h2 className="display mb-1">Match the reasons</h2>
        <p className="text-sm text-rose-600 opacity-80">Find all 6 pairs to continue 💞</p>
        <div className="mt-3 h-1.5 w-full bg-rose-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-rose-400 to-rose-600 transition-all"
               style={{ width: `${progress * 100}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3 w-full max-w-md">
        {cards.map(card => {
          const isShown = flipped.includes(card.uid) || matched.has(card.uid)
          const isMatched = matched.has(card.uid)
          return (
            <button
              key={card.uid}
              onClick={() => handleClick(card.uid)}
              className="aspect-square rounded-2xl relative transition-transform active:scale-95 select-none"
              style={{ perspective: '800px' }}
              disabled={isShown}
            >
              <div
                className="absolute inset-0 rounded-2xl transition-transform duration-500"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isShown ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600
                             shadow-soft flex items-center justify-center text-white font-display text-3xl"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  💕
                </div>
                {/* Back */}
                <div
                  className={`absolute inset-0 rounded-2xl flex items-center justify-center text-4xl
                    ${isMatched ? 'bg-gradient-to-br from-pink-100 to-pink-200 ring-2 ring-rose-400' : 'bg-white'}`}
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <span className={isMatched ? 'animate-popIn' : ''}>{card.emoji}</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-4 text-sm text-rose-600 font-semibold">
        Attempts: {attempts}
      </div>

      {revealText && (
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 bg-white/95 rounded-full px-6 py-3 shadow-heart
                        text-rose-600 font-bold animate-popIn z-30 max-w-[85vw] text-center">
          💖 {revealText}
        </div>
      )}
    </div>
  )
}
