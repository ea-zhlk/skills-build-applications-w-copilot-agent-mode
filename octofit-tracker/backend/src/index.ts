import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 8000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// MongoDB Connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit-tracker'

mongoose.connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error)
  })

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'OctoFit Tracker Backend is running' })
})

// API Routes will be added here
app.use('/api/auth', (req: Request, res: Response) => {
  res.json({ message: 'Auth endpoints coming soon' })
})

app.use('/api/activities', (req: Request, res: Response) => {
  res.json({ message: 'Activities endpoints coming soon' })
})

app.use('/api/users', (req: Request, res: Response) => {
  res.json({ message: 'Users endpoints coming soon' })
})

app.use('/api/teams', (req: Request, res: Response) => {
  res.json({ message: 'Teams endpoints coming soon' })
})

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' })
})

// Error Handler
app.use((err: any, req: Request, res: Response) => {
  console.error('Error:', err)
  res.status(500).json({ error: 'Internal Server Error' })
})

app.listen(port, () => {
  console.log(`OctoFit Tracker Backend listening on port ${port}`)
  console.log(`Health check available at http://localhost:${port}/api/health`)
})
