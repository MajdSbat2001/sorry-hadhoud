import React, { useEffect, useRef, useState } from 'react'
import { Feather } from 'lucide-react'

const LETTER = `My Hadhoud,

I've been thinking about what I want to say, and the truth is:
I hate that I hurt you.

You are the softest, kindest person in my world.
You make ordinary days feel like home, and I don't want
a single day where you doubt how loved you are.

I promise to be more patient, to listen better,
and to always remember how lucky I am.

I promise to be loyal to you — as long as I'm with you,
till the day I die, no matter what. That will never change.

And I promise to always be honest with you,
because you deserve nothing less than the truth.

I love you so much. Thank you for giving me a chance
to make it up to you.

Yours, always.
majjouj 🌸`

export default function LoveLetter({ onComplete, onEvent }) {
  const [shown, setShown] = useState('')
  const [done, setDone] = useState(false)
  const idxRef = useRef(0)

  useEffect(() => {
    onEvent?.('letter_open')
    let raf
    let last = performance.now()
    const speed = 22 // ms per char
    function tick(now) {
      if (now - last >= speed) {
        last = now
        if (idxRef.current < LETTER.length) {
          idxRef.current++
          setShown(LETTER.slice(0, idxRef.current))
        } else {
          setDone(true)
          onEvent?.('letter_done')
          return
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onEvent])

  function skip() {
    idxRef.current = LETTER.length
    setShown(LETTER)
    setDone(true)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-16">
      <div className="card-glass max-w-xl w-full relative">
        <div className="flex items-center gap-2 mb-3 text-rose-600">
          <Feather className="w-4 h-4" />
          <span className="uppercase tracking-widest text-xs font-semibold">A little letter</span>
        </div>
        <pre className="font-serif text-rose-800 whitespace-pre-wrap leading-relaxed text-[0.98rem] md:text-lg">
          {shown}
          {!done && <span className="inline-block w-[1px] h-[1.05em] bg-rose-500 animate-pulse align-text-bottom ml-0.5" />}
        </pre>
      </div>

      <div className="mt-6 flex gap-3">
        {!done ? (
          <button onClick={skip} className="btn-ghost">Skip the typing</button>
        ) : (
          <button onClick={onComplete} className="btn-primary animate-popIn">
            Continue →
          </button>
        )}
      </div>
    </div>
  )
}
