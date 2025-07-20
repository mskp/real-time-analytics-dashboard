import { Router } from "express"
import type { VisitorEvent } from "../types"
import { AnalyticsService } from "../services/analytics.service"
import { WebSocketService } from "../services/websocket.service"

const router = Router()

export const configureEventRoutes = (analyticsService: AnalyticsService, webSocketService: WebSocketService | null) => {
  router.post("/", async (req, res) => {
    try {
      console.log("Received event:", req.body)
  
      const eventData: VisitorEvent = {
        ...req.body,
        timestamp: req.body.timestamp || new Date().toISOString(),
      }
  
      // Add IP and User-Agent to metadata
      if (!eventData.metadata) {
        eventData.metadata = {}
      }
      eventData.metadata.ip = req.ip
      eventData.metadata.userAgent = req.get("User-Agent")
  
      // Process the event
      await analyticsService.processVisitorEvent(eventData)
      console.log("Event processed successfully")
  
      // Broadcast to all connected dashboards
      if (webSocketService) {
        console.log("Broadcasting to", webSocketService.getConnectedDashboards(), "dashboards")
        await webSocketService.broadcastVisitorUpdate(eventData)
        await webSocketService.broadcastSessionActivity(eventData.sessionId)
        console.log("Broadcast completed")
      } else {
        console.warn("WebSocket service not initialized yet")
      }
  
      res.status(201).json({
        success: true,
        message: "Event processed successfully",
      })
    } catch (error) {
      console.error("Error processing event:", error)
      res.status(500).json({
        success: false,
        message: "Failed to process event",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  })

  return router
}
