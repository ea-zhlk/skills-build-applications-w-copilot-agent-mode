import mongoose, { InferSchemaType, Model, Schema, Types, model } from 'mongoose'

const activitySchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    caloriesBurned: { type: Number, required: true, min: 0 },
    distanceKm: { type: Number, min: 0 },
    completedAt: { type: Date, required: true },
    notes: { type: String, trim: true },
  },
  {
    timestamps: true,
  },
)

export type Activity = InferSchemaType<typeof activitySchema>

const ActivityModel = (mongoose.models.Activity as Model<Activity>) || model<Activity>('Activity', activitySchema)

export default ActivityModel