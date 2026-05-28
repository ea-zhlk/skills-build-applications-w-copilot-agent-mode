import { Router } from 'express'
import ActivityModel from '../models/activity.js'

const activitiesRouter = Router()

activitiesRouter.get('/', async (_req, res, next) => {
  try {
    const items = await ActivityModel.find()
      .populate('user', 'name email fitnessLevel')
      .sort({ completedAt: -1 })
      .lean()

    res.json({
      resource: 'activities',
      count: items.length,
      items,
    })
  } catch (error) {
    next(error)
  }
})

export default activitiesRouter