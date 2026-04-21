import React, { useEffect, useRef, useState } from 'react'

const REASONS = [
  "you're so kind 💕",
  "you make me laugh 😂",
  "your hugs are the best 🤗",
  "you're so smart 🧠",
  "your smile 😊",
  "you're my favorite person 🌟",
  "you take care of me 💖",
  "you're handsome 😍",
  "your voice 🎵",
  "you put up with me 🙈",
  "you're my safe place 🏡",
  "you dream with me ✨",
  "you always listen 👂",
  "you're patient with me 🌸",
  "you're my best friend 💞",
]

const TARGET = 10
const EMOJIS = ['❤️', '💖', '💕', '💗', '💓']

export default function HeartCatcher({ onComplete, onEvent }) {
  const canvasRef = useRef(null)
  const stateRef = useRef(null)
  const [score, setScore] = useState(0)
  const [misses, setMisses] = useState(0)
  const [popup, setPopup] = useState(null)
  const popupTimer = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    function resize() {
      const dpr = window.devicePixelRatio || 1
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      canvas._w = w
      canvas._h = h
      if (stateRef.current) {
        const isSmall = w < 600
        stateRef.current.basketY = h - (isSmall ? 90 : 70)
      }
    }
    resize()

    const isSmall = canvas._w < 600
    const basketW = isSmall ? Math.min(140, canvas._w * 0.32) : 110
    const shuffled = [...REASONS].sort(() => Math.random() - 0.5)

    stateRef.current = {
      mouseX: canvas._w / 2,
      basketY: canvas._h - (isSmall ? 90 : 70),
      basketW,
      basketH: isSmall ? 34 : 30,
      hearts: [],
      score: 0,
      misses: 0,
      lastSpawn: 0,
      spawnInterval: 900,
      reasonsQueue: shuffled,
      reasonIdx: 0,
      running: true,
      lastTime: performance.now(),
    }

    const onMouseMove = e => { if (stateRef.current) stateRef.current.mouseX = e.clientX }
    const onTouch = e => {
      if (!stateRef.current || !e.touches[0]) return
      e.preventDefault()
      stateRef.current.mouseX = e.touches[0].clientX
    }

    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('touchstart', onTouch, { passive: false })
    canvas.addEventListener('touchmove', onTouch, { passive: false })
    window.addEventListener('resize', resize)
    window.addEventListener('orientationchange', resize)

    function spawn() {
      const g = stateRef.current
      const w = canvas._w
      const size = w < 600 ? 42 : 36
      g.hearts.push({
        x: 40 + Math.random() * (w - 80),
        y: -40,
        vy: 1.8 + Math.random() * 1.4,
        vx: (Math.random() - 0.5) * 0.4,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        reason: g.reasonsQueue[g.reasonIdx % g.reasonsQueue.length],
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.04,
        size,
        caught: false,
      })
      g.reasonIdx++
    }

    function showPopup(text) {
      setPopup(text)
      clearTimeout(popupTimer.current)
      popupTimer.current = setTimeout(() => setPopup(null), 1800)
    }

    function drawBasket(cx, cy, w, h) {
      ctx.save()
      const grad = ctx.createLinearGradient(cx, cy, cx, cy + h)
      grad.addColorStop(0, '#f8c1d0')
      grad.addColorStop(1, '#e91e63')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.moveTo(cx - w / 2, cy)
      ctx.lineTo(cx + w / 2, cy)
      ctx.lineTo(cx + w / 2 - 8, cy + h)
      ctx.lineTo(cx - w / 2 + 8, cy + h)
      ctx.closePath()
      ctx.fill()
      ctx.fillStyle = '#c0184a'
      ctx.fillRect(cx - w / 2 - 4, cy - 6, w + 8, 8)
      ctx.font = '20px serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('💝', cx, cy + h / 2 + 2)
      ctx.restore()
    }

    let raf
    function loop(now) {
      const g = stateRef.current
      if (!g || !g.running) return
      const dt = now - g.lastTime
      g.lastTime = now

      if (now - g.lastSpawn > g.spawnInterval && g.hearts.length < 4) {
        spawn()
        g.lastSpawn = now
        g.spawnInterval = Math.max(550, 900 - g.score * 35)
      }

      ctx.clearRect(0, 0, canvas._w, canvas._h)

      const basketLeft = g.mouseX - g.basketW / 2
      const basketRight = g.mouseX + g.basketW / 2
      const basketTop = g.basketY

      for (let i = g.hearts.length - 1; i >= 0; i--) {
        const h = g.hearts[i]
        h.y += h.vy * (dt / 16.67)
        h.x += h.vx * (dt / 16.67)
        h.rot += h.vrot

        ctx.save()
        ctx.translate(h.x, h.y)
        ctx.rotate(h.rot)
        ctx.font = `${h.size}px serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(h.emoji, 0, 0)
        ctx.restore()

        if (!h.caught && h.y >= basketTop - 18 && h.y <= basketTop + 38 &&
            h.x >= basketLeft - 8 && h.x <= basketRight + 8) {
          h.caught = true
          g.score++
          setScore(g.score)
          showPopup(h.reason)
          onEvent?.('heart_caught', { reason: h.reason })
          g.hearts.splice(i, 1)
          if (g.score >= TARGET) {
            g.running = false
            setTimeout(() => onComplete?.({ caught: g.score, missed: g.misses }), 450)
            return
          }
          continue
        }

        if (h.y > canvas._h + 40) {
          g.misses++
          setMisses(g.misses)
          showPopup(['oops! 💔', "don't drop me! 🥺", 'come back! 😢'][Math.floor(Math.random() * 3)])
          g.hearts.splice(i, 1)
        }
      }

      drawBasket(g.mouseX, g.basketY, g.basketW, g.basketH)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      stateRef.current.running = false
      cancelAnimationFrame(raf)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('touchstart', onTouch)
      canvas.removeEventListener('touchmove', onTouch)
      window.removeEventListener('resize', resize)
      window.removeEventListener('orientationchange', resize)
      clearTimeout(popupTimer.current)
    }
  }, [onComplete, onEvent])

  return (
    <div className="fixed inset-0">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ cursor: 'none', touchAction: 'none' }} />

      <div className="fixed top-12 md:top-14 left-3 right-3 flex justify-between z-20 pointer-events-none">
        <div className="bg-white/70 backdrop-blur rounded-full px-3 py-1.5 text-sm font-bold text-rose-800 shadow-soft">
          ❤️ {score} / {TARGET}
        </div>
        <div className="bg-white/70 backdrop-blur rounded-full px-3 py-1.5 text-sm font-bold text-rose-800 shadow-soft">
          💔 {misses}
        </div>
      </div>

      {popup && (
        <div className="fixed top-1/4 left-1/2 -translate-x-1/2 z-30 px-4 max-w-[85vw] text-center">
          <div className="bg-white/95 rounded-full px-5 py-3 shadow-heart text-rose-600 font-bold animate-popIn whitespace-nowrap overflow-hidden text-ellipsis">
            {popup}
          </div>
        </div>
      )}

      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 text-xs text-rose-600/70 pointer-events-none">
        <span className="hidden md:inline">Move the basket with your mouse</span>
        <span className="md:hidden">Drag your finger to move the basket</span>
      </div>
    </div>
  )
}
