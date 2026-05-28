import mongoose, { InferSchemaType, Model, Schema, model } from 'mongoose'

const workoutSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    durationMinutes: { type: Number, required: true, min: 1 },
    targetMuscles: [{ type: String, required: true, trim: true }],
    equipment: [{ type: String, required: true, trim: true }],
    description: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  },
)

export type Workout = InferSchemaType<typeof workoutSchema>

const WorkoutModel = (mongoose.models.Workout as Model<Workout>) || model<Workout>('Workout', workoutSchema)

export default WorkoutModel