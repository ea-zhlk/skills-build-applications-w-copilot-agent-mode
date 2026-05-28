import { Router } from 'express'
import WorkoutModel from '../models/workout.js'

const workoutsRouter = Router()

workoutsRouter.get('/', async (_req, res, next) => {
  try {
    const items = await WorkoutModel.find()
      .sort({ difficulty: 1, durationMinutes: 1, title: 1 })
      .lean()

    res.json({
      resource: 'workouts',
      count: items.length,
      items,
    })
  } catch (error) {
    next(error)
  }
})

export default workoutsRouter