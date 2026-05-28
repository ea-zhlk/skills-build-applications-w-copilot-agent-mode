import dotenv from 'dotenv'

import { connectToDatabase, disconnectDatabase } from '../lib/database.js'
import ActivityModel from '../models/activity.js'
import LeaderboardModel from '../models/leaderboard.js'
import TeamModel from '../models/team.js'
import UserModel from '../models/user.js'
import WorkoutModel from '../models/workout.js'

dotenv.config()

async function seedDatabase(): Promise<void> {
  console.log('Seed the octofit_db database with test data')

  await connectToDatabase()

  await Promise.all([
    ActivityModel.deleteMany({}),
    LeaderboardModel.deleteMany({}),
    TeamModel.deleteMany({}),
    UserModel.deleteMany({}),
    WorkoutModel.deleteMany({}),
  ])

  const users = await UserModel.insertMany([
    {
      name: 'Maya Chen',
      email: 'maya.chen@octofit.test',
      fitnessLevel: 'advanced',
      goals: ['Run a faster 10K', 'Maintain weekly strength training'],
      streakDays: 19,
      totalPoints: 1480,
    },
    {
      name: 'Jordan Alvarez',
      email: 'jordan.alvarez@octofit.test',
      fitnessLevel: 'intermediate',
      goals: ['Improve mobility', 'Complete 4 workouts per week'],
      streakDays: 11,
      totalPoints: 1125,
    },
    {
      name: 'Priya Nair',
      email: 'priya.nair@octofit.test',
      fitnessLevel: 'advanced',
      goals: ['Increase cycling endurance', 'Stay consistent with recovery'],
      streakDays: 24,
      totalPoints: 1590,
    },
    {
      name: 'Ethan Brooks',
      email: 'ethan.brooks@octofit.test',
      fitnessLevel: 'beginner',
      goals: ['Build a sustainable routine', 'Walk 8,000 steps daily'],
      streakDays: 7,
      totalPoints: 690,
    },
    {
      name: 'Sofia Martinez',
      email: 'sofia.martinez@octofit.test',
      fitnessLevel: 'intermediate',
      goals: ['Boost core strength', 'Finish a weekend hike comfortably'],
      streakDays: 14,
      totalPoints: 1240,
    },
  ])

  const teams = await TeamModel.insertMany([
    {
      name: 'Summit Striders',
      city: 'Seattle',
      motto: 'Climb higher every week',
      weeklyScore: 2840,
      members: [users[0]._id, users[2]._id, users[4]._id],
    },
    {
      name: 'Pulse Pack',
      city: 'Austin',
      motto: 'Consistency beats intensity',
      weeklyScore: 2215,
      members: [users[1]._id, users[3]._id],
    },
  ])

  await Promise.all([
    UserModel.updateOne({ _id: users[0]._id }, { team: teams[0]._id }),
    UserModel.updateOne({ _id: users[1]._id }, { team: teams[1]._id }),
    UserModel.updateOne({ _id: users[2]._id }, { team: teams[0]._id }),
    UserModel.updateOne({ _id: users[3]._id }, { team: teams[1]._id }),
    UserModel.updateOne({ _id: users[4]._id }, { team: teams[0]._id }),
  ])

  await WorkoutModel.insertMany([
    {
      title: 'Tempo Run Builder',
      category: 'cardio',
      difficulty: 'advanced',
      durationMinutes: 45,
      targetMuscles: ['legs', 'core'],
      equipment: ['running shoes'],
      description: 'Alternating tempo intervals designed to improve threshold pace and endurance.',
    },
    {
      title: 'Desk Reset Mobility Flow',
      category: 'mobility',
      difficulty: 'beginner',
      durationMinutes: 20,
      targetMuscles: ['hips', 'hamstrings', 'shoulders'],
      equipment: ['yoga mat'],
      description: 'A low-impact recovery flow for mobility, posture, and joint range of motion.',
    },
    {
      title: 'Kettlebell Power Circuit',
      category: 'strength',
      difficulty: 'intermediate',
      durationMinutes: 30,
      targetMuscles: ['glutes', 'back', 'core'],
      equipment: ['kettlebell'],
      description: 'A full-body circuit focused on explosive hip drive, posture, and core stability.',
    },
  ])

  await ActivityModel.insertMany([
    {
      user: users[0]._id,
      type: 'Run',
      durationMinutes: 52,
      caloriesBurned: 610,
      distanceKm: 9.4,
      completedAt: new Date('2026-05-24T06:45:00Z'),
      notes: 'Steady tempo run around Green Lake.',
    },
    {
      user: users[1]._id,
      type: 'Mobility',
      durationMinutes: 28,
      caloriesBurned: 170,
      completedAt: new Date('2026-05-25T18:30:00Z'),
      notes: 'Post-work stretch session with resistance bands.',
    },
    {
      user: users[2]._id,
      type: 'Cycling',
      durationMinutes: 75,
      caloriesBurned: 740,
      distanceKm: 28.6,
      completedAt: new Date('2026-05-26T12:15:00Z'),
      notes: 'Hill repeats followed by easy cooldown miles.',
    },
    {
      user: users[3]._id,
      type: 'Walk',
      durationMinutes: 40,
      caloriesBurned: 220,
      distanceKm: 3.8,
      completedAt: new Date('2026-05-26T07:20:00Z'),
      notes: 'Neighborhood walk before breakfast.',
    },
    {
      user: users[4]._id,
      type: 'Strength',
      durationMinutes: 36,
      caloriesBurned: 330,
      completedAt: new Date('2026-05-27T17:50:00Z'),
      notes: 'Core and lower-body circuit with kettlebell swings.',
    },
  ])

  await LeaderboardModel.insertMany([
    {
      title: 'Top Individual Performers',
      category: 'users',
      period: 'weekly',
      rankings: [
        { rank: 1, points: 1590, user: users[2]._id, label: 'Priya Nair' },
        { rank: 2, points: 1480, user: users[0]._id, label: 'Maya Chen' },
        { rank: 3, points: 1240, user: users[4]._id, label: 'Sofia Martinez' },
      ],
    },
    {
      title: 'Top Teams',
      category: 'teams',
      period: 'weekly',
      rankings: [
        { rank: 1, points: 2840, team: teams[0]._id, label: 'Summit Striders' },
        { rank: 2, points: 2215, team: teams[1]._id, label: 'Pulse Pack' },
      ],
    },
  ])

  console.log('Seeded users, teams, activities, leaderboard, and workouts.')
}

seedDatabase()
  .catch((error) => {
    console.error('Seed error:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await disconnectDatabase()
  })