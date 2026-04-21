import React from 'react'
import { Heart, Gamepad2 } from 'lucide-react'

export default function Start({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-10 text-center relative">
      <div className="animate-float text-7xl mb-2" aria-hidden>💕</div>

      <h1 className="display mb-2">Sorry, Hadhoud</h1>
      <div className="flex items-center gap-2 text-rose-600 mb-6">
        <Heart className="w-4 h-4 fill-current" />
        <span className="tracking-widest text-xs md:text-sm uppercase">A Forgiveness Quest</span>
        <Heart className="w-4 h-4 fill-current" />
      </div>

      <div className="card-glass max-w-lg w-full">
        <p className="prose mb-3">
          I know I messed up, Hadi. 🥺
        </p>
        <p className="prose mb-3">
          I made this little game just for you. Complete the four levels
          and I promise you'll feel how much I love you by the end.
        </p>
        <p className="prose font-semibold text-rose-600">
          Each level unlocks another piece of my apology. 💖
        </p>
      </div>

      <button onClick={onStart} className="btn-primary mt-8 flex items-center gap-2">
        <Gamepad2 className="w-5 h-5" />
        Start the Quest
      </button>

      <div className="text-xs text-rose-500 mt-4 opacity-70">
        <span className="hidden md:inline">Use your mouse · </span>
        <span className="md:hidden">Tap and drag · </span>
        4 levels · 2 minutes
      </div>
    </div>
  )
}
