import express from 'express'
import cors from 'cors'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import gameRoutes from './routes/game.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json({ limit: '200kb' }))

app.get('/api/health', (req, res) => res.json({ ok: true, msg: 'sorry hadhoud 💕' }))
app.use('/api', gameRoutes)

// Serve built client in production
const clientDist = path.join(__dirname, '..', 'client', 'dist')
app.use(express.static(clientDist))
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'), (err) => {
    if (err) res.status(404).send('client not built — run `npm run build`')
  })
})

app.listen(PORT, () => {
  console.log(`💖 sorry-hadhoud server listening on http://localhost:${PORT}`)
})
