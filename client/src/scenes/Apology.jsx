import React, { useRef, useState } from 'react'

const PHASES = [
  "are you sure? 🥺",
  "hadhoud nooo 😭",
  "im literally crying rn 😢",
  "please please please 🙏💕",
  "i will be so sad hadhoud 💔",
  "fine i'll just cry forever then 😭💔",
]

const SHRINK_SIZES = [0.85, 0.7, 0.58, 0.45, 0.34, 0.24, 0.16]

export default function Apology({ onAccept, onEvent }) {
  const [noCount, setNoCount] = useState(0)
  const [shrinkCount, setShrinkCount] = useState(0)
  const [running, setRunning] = useState(false)
  const [noPos, setNoPos] = useState({ left: null, top: null })
  const btnRef = useRef(null)

  function handleNo() {
    onEvent?.('no_clicked', { noCount, shrinkCount })
    if (noCount < PHASES.length) {
      const nextCount = noCount + 1
      setNoCount(nextCount)
      if (nextCount >= PHASES.length) shrinkStep()
    } else if (!running) {
      shrinkStep()
    }
  }

  function shrinkStep() {
    setShrinkCount(c => {
      const next = c + 1
      if (next >= 4 && !running) {
        setRunning(true)
        requestAnimationFrame(() => placeRandom())
      }
      return next
    })
  }

  function placeRandom() {
    const btn = btnRef.current
    if (!btn) return
    const w = window.innerWidth
    const h = window.innerHeight
    const bw = btn.offsetWidth || 60
    const bh = btn.offsetHeight || 30
    setNoPos({
      left: Math.random() * (w - bw),
      top: Math.random() * (h - bh),
    })
  }

  const label = noCount === 0 ? 'No' : PHASES[Math.min(noCount - 1, PHASES.length - 1)]
  const size = SHRINK_SIZES[Math.min(shrinkCount, SHRINK_SIZES.length - 1)]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-16 text-center">
      <div className="text-6xl mb-2 animate-float">🥺</div>
      <h1 className="display mb-3">I'm really sorry, Hadi.</h1>

      <div className="card-glass max-w-lg w-full">
        <p className="prose mb-3">
          I know I messed up, and I hate that I hurt you. You don't deserve that —
          you deserve someone who always makes you feel loved and appreciated.
        </p>
        <p className="prose font-semibold text-rose-600">
          I'm genuinely, completely, whole-heartedly sorry.<br />
          Will you forgive me? 💕
        </p>
      </div>

      <button
        onClick={onAccept}
        className="btn-primary mt-8 animate-wiggle"
        style={{
          transform: `scale(${Math.min(1 + noCount * 0.28, 3.2)})`,
          transformOrigin: 'center center',
          transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
          marginBottom: `${Math.min(noCount * 18, 120)}px`,
        }}
      >
        Yes, I forgive you 💖
      </button>

      <button
        ref={btnRef}
        onMouseEnter={running ? placeRandom : handleNo}
        onClick={running ? placeRandom : handleNo}
        onTouchStart={(e) => { if (running) { e.preventDefault(); placeRandom() } else { handleNo() } }}
        className={`btn-ghost mt-3 whitespace-nowrap`}
        style={{
          fontSize: shrinkCount > 0 ? `${size}rem` : undefined,
          padding: shrinkCount > 0 ? `${size * 10}px ${size * 24}px` : undefined,
          position: running ? 'fixed' : 'relative',
          left: running && noPos.left !== null ? `${noPos.left}px` : undefined,
          top: running && noPos.top !== null ? `${noPos.top}px` : undefined,
          transition: running ? 'left 0.1s, top 0.1s, font-size 0.4s, padding 0.4s' : 'font-size 0.4s, padding 0.4s',
        }}
      >
        {label}
      </button>
    </div>
  )
}
