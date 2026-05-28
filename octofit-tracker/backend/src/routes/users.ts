import { Router } from 'express'
import UserModel from '../models/user.js'

const usersRouter = Router()

usersRouter.get('/', async (_req, res, next) => {
  try {
    const items = await UserModel.find()
      .populate('team', 'name city motto weeklyScore')
      .sort({ totalPoints: -1, name: 1 })
      .lean()

    res.json({
      resource: 'users',
      count: items.length,
      items,
    })
  } catch (error) {
    next(error)
  }
})

export default usersRouter