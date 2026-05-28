import mongoose from 'mongoose'

export const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db'

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) {
    return mongoose
  }

  if (mongoose.connection.readyState === 2) {
    return mongoose
  }

  return mongoose.connect(mongoUri)
}


export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect()
  }
}