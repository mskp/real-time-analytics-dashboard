import mongoose, { Schema, type Document } from "mongoose"
import type { SessionData as ISessionData } from "../types"

export interface ISessionDocument extends ISessionData, Document {
  createdAt: Date
  updatedAt: Date
}

const SessionSchema = new Schema<ISessionDocument>(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    currentPage: {
      type: String,
      required: true,
    },
    journey: [
      {
        type: String,
        required: true,
      },
    ],
    startTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    lastActivity: {
      type: Date,
      required: true,
      default: Date.now,
    },
    country: {
      type: String,
      required: true,
    },
    device: String,
    referrer: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    duration: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient queries
SessionSchema.index({ isActive: 1 })
SessionSchema.index({ country: 1 })
SessionSchema.index({ lastActivity: 1 })

export const Session = mongoose.model<ISessionDocument>("Session", SessionSchema)
