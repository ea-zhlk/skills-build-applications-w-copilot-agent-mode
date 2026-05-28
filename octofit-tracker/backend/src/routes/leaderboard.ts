import { Router } from 'express'
import LeaderboardModel from '../models/leaderboard.js'

const leaderboardRouter = Router()

leaderboardRouter.get('/', async (_req, res, next) => {
  try {
    const items = await LeaderboardModel.find()
      .populate('rankings.user', 'name email totalPoints')
      .populate('rankings.team', 'name city weeklyScore')
      .sort({ category: 1, createdAt: -1 })
      .lean()

    res.json({
      resource: 'leaderboard',
      count: items.length,
      items,
    })
  } catch (error) {
    next(error)
  }
})

export default leaderboardRouter