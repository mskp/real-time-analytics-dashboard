import mongoose from "mongoose"
import { VisitorEvent } from "../models/VisitorEvent"
import { Session } from "../models/Session"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/visitor-analytics"

const countries = ["India", "USA", "UK", "Germany", "France", "Japan", "Australia", "Canada"]
const pages = ["/home", "/products", "/about", "/contact", "/pricing", "/blog", "/features"]
const devices = ["desktop", "mobile", "tablet"]
const referrers = ["google.com", "facebook.com", "twitter.com", "linkedin.com", "direct"]

function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function generateSessionId(): string {
  return "session-" + Math.random().toString(36).substr(2, 9)
}

async function seedData() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("Connected to MongoDB")

    // Clear existing data
    await VisitorEvent.deleteMany({})
    await Session.deleteMany({})
    console.log("Cleared existing data")

    const sessions: string[] = []
    const events: any[] = []

    // Generate 20 sessions
    for (let i = 0; i < 20; i++) {
      const sessionId = generateSessionId()
      sessions.push(sessionId)

      const country = randomChoice(countries)
      const device = randomChoice(devices)
      const referrer = randomChoice(referrers)
      const startTime = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000) // Last 24 hours

      // Generate 2-5 page views per session
      const pageViews = Math.floor(Math.random() * 4) + 2
      const sessionPages: string[] = []

      for (let j = 0; j < pageViews; j++) {
        const page = randomChoice(pages)
        if (!sessionPages.includes(page)) {
          sessionPages.push(page)
        }

        const eventTime = new Date(startTime.getTime() + j * 60000) // 1 minute apart

        events.push({
          type: "pageview",
          page,
          sessionId,
          timestamp: eventTime.toISOString(),
          country,
          metadata: {
            device,
            referrer: j === 0 ? referrer : undefined,
            userAgent: `Mozilla/5.0 (${device})`,
          },
        })
      }

      // 30% chance of session end
      if (Math.random() < 0.3) {
        events.push({
          type: "session_end",
          page: sessionPages[sessionPages.length - 1],
          sessionId,
          timestamp: new Date(startTime.getTime() + pageViews * 60000).toISOString(),
          country,
          metadata: { device, referrer },
        })
      }
    }

    // Insert events
    await VisitorEvent.insertMany(events)
    console.log(`Inserted ${events.length} events`)

    // Create sessions
    const sessionDocs = []
    for (const sessionId of sessions) {
      const sessionEvents = events.filter((e) => e.sessionId === sessionId)
      const firstEvent = sessionEvents[0]
      const lastEvent = sessionEvents[sessionEvents.length - 1]
      const isActive = !sessionEvents.some((e) => e.type === "session_end")

      sessionDocs.push({
        sessionId,
        currentPage: lastEvent.page,
        journey: [...new Set(sessionEvents.map((e) => e.page))],
        startTime: new Date(firstEvent.timestamp),
        lastActivity: new Date(lastEvent.timestamp),
        country: firstEvent.country,
        device: firstEvent.metadata?.device,
        referrer: firstEvent.metadata?.referrer,
        isActive,
        duration: Math.floor(
          (new Date(lastEvent.timestamp).getTime() - new Date(firstEvent.timestamp).getTime()) / 1000,
        ),
      })
    }

    await Session.insertMany(sessionDocs)
    console.log(`Inserted ${sessionDocs.length} sessions`)

    console.log("Seed data created successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding data:", error)
    process.exit(1)
  }
}

seedData()
