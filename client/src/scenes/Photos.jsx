import React, { useState, useEffect, useRef } from 'react'

// Drop your photos into client/src/photos/ and they'll appear here automatically
const modules = import.meta.glob('../photos/*.{jpg,jpeg,png,gif,webp,JPG,JPEG,PNG,WEBP}', { eager: true })
const PHOTOS = Object.values(modules).map(m => m.default)

export default function Photos({ onNext, onEvent }) {
  const [idx, setIdx] = useState(0)
  const touchStartX = useRef(null)

  useEffect(() => {
    onEvent?.('photos_open')
    // Preload all images so they're instant when he swipes
    PHOTOS.forEach(src => { const img = new Image(); img.src = src })
  }, [onEvent])

  function prev() { setIdx(i => (i - 1 + PHOTOS.length) % PHOTOS.length) }
  function next() { setIdx(i => (i + 1) % PHOTOS.length) }

  function onTouchStart(e) { touchStartX.current = e.touches[0].clientX }
  function onTouchEnd(e) {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev()
    touchStartX.current = null
  }

  if (PHOTOS.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-6">
        <div className="text-6xl">📷</div>
        <div className="card-glass max-w-sm w-full">
          <p className="prose text-rose-600">Photos coming soon… 💕</p>
        </div>
        <button className="btn-primary" onClick={onNext}>Continue →</button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 text-center">
      <p className="text-rose-500 text-sm font-semibold uppercase tracking-widest mb-4">Us 💕</p>

      <div
        className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-lg bg-white/30"
        style={{ aspectRatio: '3/4' }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {PHOTOS.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
            style={{ opacity: i === idx ? 1 : 0 }}
          />
        ))}

        {/* prev / next tap zones */}
        <button onClick={prev} className="absolute left-0 inset-y-0 w-1/3 opacity-0" aria-label="previous" />
        <button onClick={next} className="absolute right-0 inset-y-0 w-1/3 opacity-0" aria-label="next" />
      </div>

      {/* dots */}
      <div className="flex gap-1.5 mt-4 mb-6">
        {PHOTOS.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`rounded-full transition-all ${i === idx ? 'bg-rose-500 w-4 h-2' : 'bg-rose-300 w-2 h-2'}`}
          />
        ))}
      </div>

      <button className="btn-primary" onClick={onNext}>Continue →</button>
    </div>
  )
}
