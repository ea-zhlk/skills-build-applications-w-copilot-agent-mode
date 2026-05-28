import mongoose, { InferSchemaType, Model, Schema, Types, model } from 'mongoose'

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    fitnessLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    goals: [{ type: String, required: true, trim: true }],
    team: { type: Types.ObjectId, ref: 'Team', default: null },
    streakDays: { type: Number, required: true, min: 0 },
    totalPoints: { type: Number, required: true, min: 0 },
  },
  {
    timestamps: true,
  },
)

export type User = InferSchemaType<typeof userSchema>

const UserModel = (mongoose.models.User as Model<User>) || model<User>('User', userSchema)

export default UserModel