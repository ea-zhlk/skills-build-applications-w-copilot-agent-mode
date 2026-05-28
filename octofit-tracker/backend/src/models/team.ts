import mongoose, { InferSchemaType, Model, Schema, Types, model } from 'mongoose'

const teamSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    city: { type: String, required: true, trim: true },
    motto: { type: String, required: true, trim: true },
    weeklyScore: { type: Number, required: true, min: 0 },
    members: [{ type: Types.ObjectId, ref: 'User', required: true }],
  },
  {
    timestamps: true,
  },
)

export type Team = InferSchemaType<typeof teamSchema>

const TeamModel = (mongoose.models.Team as Model<Team>) || model<Team>('Team', teamSchema)

export default TeamModel