import React from 'react'

const STEPS = [
  { key: 'start',   label: 'Start'    },
  { key: 'hearts',  label: 'Hearts'   },
  { key: 'memory',  label: 'Memory'   },
  { key: 'letter',  label: 'Letter'   },
  { key: 'apology', label: 'Apology'  },
  { key: 'final',   label: 'Forgive'  },
]

export default function Progress({ current }) {
  const idx = STEPS.findIndex(s => s.key === current)
  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-30 px-3 w-full max-w-md">
      <div className="flex items-center gap-1 bg-white/70 backdrop-blur rounded-full px-3 py-1.5 shadow-soft">
        {STEPS.map((s, i) => {
          const done = i <= idx
          return (
            <div key={s.key} className="flex items-center flex-1 justify-center">
              <div
                className={`flex items-center justify-center h-6 w-6 rounded-full text-[10px] font-bold transition-all
                  ${done ? 'bg-rose-500 text-white shadow-soft' : 'bg-rose-100 text-rose-400'}`}
                title={s.label}
              >
                {done ? '💖' : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 mx-1 rounded-full ${i < idx ? 'bg-rose-500' : 'bg-rose-100'}`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
