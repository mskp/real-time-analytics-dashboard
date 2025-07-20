import { VisitorEvent } from "../models/VisitorEvent"
import { Session } from "../models/Session"
import type { AnalyticsSummary, FilterOptions, SessionData } from "../types"
import moment from "moment"

export class AnalyticsService {
  async processVisitorEvent(eventData: any): Promise<void> {
    // Save the event
    const event = new VisitorEvent(eventData)
    await event.save()

    // Update or create session
    await this.updateSession(eventData)
  }

  private async updateSession(eventData: any): Promise<void> {
    const { sessionId, page, country, timestamp, metadata } = eventData

    let session = await Session.findOne({ sessionId })

    if (!session) {
      // Create new session
      session = new Session({
        sessionId,
        currentPage: page,
        journey: [page],
        startTime: new Date(timestamp),
        lastActivity: new Date(timestamp),
        country,
        device: metadata?.device,
        referrer: metadata?.referrer,
        isActive: true,
        duration: 0,
      })
    } else {
      // Update existing session
      session.currentPage = page
      if (!session.journey.includes(page)) {
        session.journey.push(page)
      }
      session.lastActivity = new Date(timestamp)
      session.duration = Math.floor((new Date(timestamp).getTime() - session.startTime.getTime()) / 1000)

      // Mark as inactive if session_end event
      if (eventData.type === "session_end") {
        session.isActive = false
      }
    }

    await session.save()
  }

  async getSummary(filter?: FilterOptions): Promise<AnalyticsSummary> {
    const today = moment().startOf("day").toDate()

    // Build query for events
    const eventQuery: any = {
      createdAt: { $gte: today },
    }

    if (filter?.country) eventQuery.country = filter.country
    if (filter?.page) eventQuery.page = filter.page
    if (filter?.device) eventQuery["metadata.device"] = filter.device

    // Get active sessions
    const sessionQuery: any = { isActive: true }
    if (filter?.country) sessionQuery.country = filter.country

    const [totalActive, totalToday, pageStats, countryStats, deviceStats] = await Promise.all([
      Session.countDocuments(sessionQuery),
      VisitorEvent.countDocuments(eventQuery),
      this.getPageStats(eventQuery),
      this.getCountryStats(eventQuery),
      this.getDeviceStats(eventQuery),
    ])

    return {
      totalActive,
      totalToday,
      pagesVisited: pageStats,
      countriesVisited: countryStats,
      devicesUsed: deviceStats,
    }
  }

  private async getPageStats(query: any): Promise<Record<string, number>> {
    const results = await VisitorEvent.aggregate([
      { $match: query },
      { $group: { _id: "$page", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])

    const stats: Record<string, number> = {}
    results.forEach((result) => {
      stats[result._id] = result.count
    })
    return stats
  }

  private async getCountryStats(query: any): Promise<Record<string, number>> {
    const results = await VisitorEvent.aggregate([
      { $match: query },
      { $group: { _id: "$country", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])

    const stats: Record<string, number> = {}
    results.forEach((result) => {
      stats[result._id] = result.count
    })
    return stats
  }

  private async getDeviceStats(query: any): Promise<Record<string, number>> {
    const results = await VisitorEvent.aggregate([
      { $match: { ...query, "metadata.device": { $exists: true } } },
      { $group: { _id: "$metadata.device", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])

    const stats: Record<string, number> = {}
    results.forEach((result) => {
      stats[result._id] = result.count
    })
    return stats
  }

  async getActiveSessions(filter?: FilterOptions): Promise<SessionData[]> {
    const query: any = { isActive: true }

    if (filter?.country) query.country = filter.country

    const sessions = await Session.find(query).sort({ lastActivity: -1 }).limit(50).lean()

    return sessions.map((session) => ({
      sessionId: session.sessionId,
      currentPage: session.currentPage,
      journey: session.journey,
      startTime: session.startTime,
      lastActivity: session.lastActivity,
      country: session.country,
      device: session.device,
      referrer: session.referrer,
      isActive: session.isActive,
      duration: session.duration,
    }))
  }

  async getRecentEvents(limit = 20, filter?: FilterOptions): Promise<any[]> {
    const query: any = {}

    if (filter?.country) query.country = filter.country
    if (filter?.page) query.page = filter.page
    if (filter?.device) query["metadata.device"] = filter.device

    return await VisitorEvent.find(query).sort({ createdAt: -1 }).limit(limit).lean()
  }

  async cleanupInactiveSessions(): Promise<void> {
    const cutoffTime = moment().subtract(30, "minutes").toDate()

    await Session.updateMany(
      {
        isActive: true,
        lastActivity: { $lt: cutoffTime },
      },
      {
        isActive: false,
      },
    )
  }
}
