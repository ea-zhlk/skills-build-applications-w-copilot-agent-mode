import express, { Express, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import activitiesRouter from './routes/activities.js'
import { connectToDatabase } from './lib/database.js'
import leaderboardRouter from './routes/leaderboard.js'
import teamsRouter from './routes/teams.js'
import usersRouter from './routes/users.js'
import workoutsRouter from './routes/workouts.js'

dotenv.config()

const app: Express = express()
const port = Number(process.env.PORT) || 8000
const codespaceName = process.env.CODESPACE_NAME
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : `http://localhost:${port}`

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

connectToDatabase()
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error)
  })

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'OK',
    message: 'OctoFit Tracker backend is running',
    apiBaseUrl,
  })
})

app.get('/api', (_req: Request, res: Response) => {
  res.json({
    message: 'OctoFit Tracker API',
    apiBaseUrl,
    endpoints: [
      '/api/users/',
      '/api/teams/',
      '/api/activities/',
      '/api/leaderboard/',
      '/api/workouts/',
    ],
  })
})

app.use('/api/users', usersRouter)
app.use('/api/teams', teamsRouter)
app.use('/api/activities', activitiesRouter)
app.use('/api/leaderboard', leaderboardRouter)
app.use('/api/workouts', workoutsRouter)

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' })
})

// Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({ error: 'Internal Server Error' })
})

app.listen(port, () => {
  console.log(`OctoFit Tracker Backend listening on port ${port}`)
  console.log(`Health check available at ${apiBaseUrl}/api/health`)
})
