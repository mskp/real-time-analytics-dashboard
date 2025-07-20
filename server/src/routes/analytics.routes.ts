import { Router } from "express"
import { AnalyticsService } from "../services/analytics.service"
import type { FilterOptions } from "../types"

const router = Router()

export const configureAnalyticsRoutes = (analyticsService: AnalyticsService) => {
  router.get("/summary", async (req, res) => {
    try {
      const filter: Partial<FilterOptions> = {}
  
      if (req.query.country) filter.country = req.query.country as string
      if (req.query.page) filter.page = req.query.page as string
      if (req.query.device) filter.device = req.query.device as string
  
      const summary = await analyticsService.getSummary(Object.keys(filter).length > 0 ? filter : undefined)
      res.json(summary)
    } catch (error) {
      console.error("Error fetching summary:", error)
      res.status(500).json({ error: "Failed to fetch summary" })
    }
  })
  
  router.get("/sessions", async (req, res) => {
    try {
      const filter: Partial<FilterOptions> = {}
  
      if (req.query.country) filter.country = req.query.country as string
  
      const sessions = await analyticsService.getActiveSessions(Object.keys(filter).length > 0 ? filter : undefined)
      res.json(sessions)
    } catch (error) {
      console.error("Error fetching sessions:", error)
      res.status(500).json({ error: "Failed to fetch sessions" })
    }
  })
  
  router.get("/events", async (req, res) => {
    try {
      const limit = Number.parseInt(req.query.limit as string) || 20
      const filter: Partial<FilterOptions> = {}
  
      if (req.query.country) filter.country = req.query.country as string
      if (req.query.page) filter.page = req.query.page as string
      if (req.query.device) filter.device = req.query.device as string
  
      const events = await analyticsService.getRecentEvents(limit, Object.keys(filter).length > 0 ? filter : undefined)
      res.json(events)
    } catch (error) {
      console.error("Error fetching events:", error)
      res.status(500).json({ error: "Failed to fetch events" })
    }
  })

  return router
}
