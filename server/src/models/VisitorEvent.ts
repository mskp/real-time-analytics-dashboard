import mongoose, { Schema, type Document } from "mongoose"
import type { VisitorEvent as IVisitorEvent } from "../types"

export interface IVisitorEventDocument extends IVisitorEvent, Document {
  createdAt: Date
  updatedAt: Date
}

const VisitorEventSchema = new Schema<IVisitorEventDocument>(
  {
    type: {
      type: String,
      required: true,
      enum: ["pageview", "click", "session_end"],
    },
    page: {
      type: String,
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    timestamp: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    metadata: {
      device: String,
      referrer: String,
      userAgent: String,
      ip: String,
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient queries
VisitorEventSchema.index({ sessionId: 1, timestamp: 1 })
VisitorEventSchema.index({ country: 1 })
VisitorEventSchema.index({ page: 1 })
VisitorEventSchema.index({ createdAt: 1 })

export const VisitorEvent = mongoose.model<IVisitorEventDocument>("VisitorEvent", VisitorEventSchema)
