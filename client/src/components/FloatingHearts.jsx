import React, { useMemo } from 'react'

const EMOJIS = ['❤️', '💕', '💖', '🌸', '💗', '✨', '💓', '🩷']

export default function FloatingHearts({ count = 14, className = '' }) {
  const hearts = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: EMOJIS[i % EMOJIS.length],
      left: (i * 7.3) % 100,
      bottom: -(Math.random() * 20 + 5),
      size: 0.9 + (i % 4) * 0.4,
      duration: 6 + (i % 5) * 1.5,
      delay: (i * 0.8) % 5,
    })), [count])

  return (
    <div className={`pointer-events-none fixed inset-0 overflow-hidden ${className}`} aria-hidden>
      {hearts.map(h => (
        <span
          key={h.id}
          className="absolute animate-floatUp opacity-40"
          style={{
            left: `${h.left}%`,
            bottom: `${h.bottom}%`,
            fontSize: `${h.size}rem`,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  )
}
