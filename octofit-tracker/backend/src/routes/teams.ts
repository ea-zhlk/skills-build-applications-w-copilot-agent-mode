import { Router } from 'express'
import TeamModel from '../models/team.js'

const teamsRouter = Router()

teamsRouter.get('/', async (_req, res, next) => {
  try {
    const items = await TeamModel.find()
      .populate('members', 'name email fitnessLevel streakDays totalPoints')
      .sort({ weeklyScore: -1, name: 1 })
      .lean()

    res.json({
      resource: 'teams',
      count: items.length,
      items,
    })
  } catch (error) {
    next(error)
  }
})

export default teamsRouter