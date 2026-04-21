import React, { useCallback, useEffect, useRef, useState } from 'react'
import Start from './scenes/Start.jsx'
import HeartCatcher from './scenes/HeartCatcher.jsx'
import MemoryMatch from './scenes/MemoryMatch.jsx'
import LoveLetter from './scenes/LoveLetter.jsx'
import Apology from './scenes/Apology.jsx'
import Final from './scenes/Final.jsx'
import FloatingHearts from './components/FloatingHearts.jsx'
import Progress from './components/Progress.jsx'
import { ensureSession, logEvent, complete, sendMessage } from './api'

export default function App() {
  const [scene, setScene] = useState('start')
  const [sessionId, setSessionId] = useState(null)
  const statsRef = useRef({ caught: 0, attempts: 0 })

  useEffect(() => {
    ensureSession('Hadi').then(s => {
      if (s) setSessionId(s.id)
    })
  }, [])

  const fireEvent = useCallback((kind, payload) => {
    logEvent(sessionId, kind, payload)
  }, [sessionId])

  function advance(to) {
    fireEvent('scene_enter', { scene: to })
    setScene(to)
  }

  function onHeartsDone(stats) {
    statsRef.current.caught = stats.caught
    fireEvent('level_complete', { level: 'hearts', ...stats })
    advance('memory')
  }

  function onMemoryDone(stats) {
    statsRef.current.attempts = stats.attempts
    fireEvent('level_complete', { level: 'memory', ...stats })
    advance('letter')
  }

  function onLetterDone() {
    fireEvent('level_complete', { level: 'letter' })
    advance('apology')
  }

  function onAccept() {
    fireEvent('level_complete', { level: 'apology', forgave: true })
    complete(sessionId, true)
    advance('final')
  }

  async function onSend(body) {
    await sendMessage(sessionId, body)
    fireEvent('message_sent', { length: body.length })
  }

  function restart() {
    fireEvent('restart')
    statsRef.current = { caught: 0, attempts: 0 }
    setScene('start')
  }

  return (
    <div className="relative">
      <FloatingHearts />
      {scene !== 'start' && scene !== 'final' && <Progress current={scene} />}
      {scene === 'start'   && <Start onStart={() => { fireEvent('game_start'); advance('hearts') }} />}
      {scene === 'hearts'  && <HeartCatcher onComplete={onHeartsDone} onEvent={fireEvent} />}
      {scene === 'memory'  && <MemoryMatch onComplete={onMemoryDone} onEvent={fireEvent} />}
      {scene === 'letter'  && <LoveLetter onComplete={onLetterDone} onEvent={fireEvent} />}
      {scene === 'apology' && <Apology onAccept={onAccept} onEvent={fireEvent} />}
      {scene === 'final'   && <Final stats={statsRef.current} onSendMessage={onSend} onRestart={restart} />}
    </div>
  )
}
