import mongoose, { InferSchemaType, Model, Schema, Types, model } from 'mongoose'

const leaderboardSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    period: { type: String, required: true, trim: true },
    rankings: [
      {
        rank: { type: Number, required: true, min: 1 },
        points: { type: Number, required: true, min: 0 },
        user: { type: Types.ObjectId, ref: 'User' },
        team: { type: Types.ObjectId, ref: 'Team' },
        label: { type: String, required: true, trim: true },
      },
    ],
  },
  {
    timestamps: true,
  },
)

export type Leaderboard = InferSchemaType<typeof leaderboardSchema>

const LeaderboardModel = (mongoose.models.Leaderboard as Model<Leaderboard>) || model<Leaderboard>('Leaderboard', leaderboardSchema)

export default LeaderboardModel