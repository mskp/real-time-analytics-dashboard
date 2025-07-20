import WebSocket, { WebSocketServer } from "ws"
import type { Server as HTTPServer } from "http"
import type { AnalyticsService } from "./analytics.service"
import type { FilterOptions } from "../types"
import { v4 as uuidv4 } from "uuid"

interface ExtendedWebSocket extends WebSocket {
  id: string
  isAlive: boolean
  filters?: FilterOptions
}

export class WebSocketService {
  private wss: WebSocketServer
  private analyticsService: AnalyticsService
  private connectedClients: Map<string, ExtendedWebSocket> = new Map()
  private heartbeatInterval: NodeJS.Timeout | null = null

  constructor(server: HTTPServer, analyticsService: AnalyticsService) {
    this.analyticsService = analyticsService
    this.wss = new WebSocketServer({
      server,
      path: "/ws",
    })

    this.setupEventHandlers()
    this.startHeartbeat()
  }

  private setupEventHandlers(): void {
    this.wss.on("connection", (ws: ExtendedWebSocket) => {
      ws.id = uuidv4()
      ws.isAlive = true

      console.log(`Dashboard connected: ${ws.id}`)
      this.connectedClients.set(ws.id, ws)

      // Send connection confirmation
      this.sendToClient(ws, "user_connected", {
        totalDashboards: this.connectedClients.size,
        connectedAt: new Date().toISOString(),
      })

      // Broadcast to all other clients about new connection
      this.broadcast(
        "user_connected",
        {
          totalDashboards: this.connectedClients.size,
          connectedAt: new Date().toISOString(),
        },
        ws.id,
      )

      // Handle incoming messages
      ws.on("message", async (data: WebSocket.Data) => {
        try {
          const message = JSON.parse(data.toString())
          await this.handleClientMessage(ws, message)
        } catch (error) {
          console.error("Error parsing WebSocket message:", error)
          this.sendToClient(ws, "error", { message: "Invalid message format" })
        }
      })

      // Handle pong responses for heartbeat
      ws.on("pong", () => {
        ws.isAlive = true
      })

      // Handle disconnection
      ws.on("close", (code, reason) => {
        console.log(`Dashboard disconnected: ${ws.id} (code: ${code}, reason: ${reason})`)
        this.connectedClients.delete(ws.id)

        // Notify remaining clients about disconnection
        this.broadcast("user_disconnected", {
          totalDashboards: this.connectedClients.size,
        })
      })

      ws.on("error", (error) => {
        console.error(`WebSocket error for client ${ws.id}:`, error)
        this.connectedClients.delete(ws.id)
        
        // Notify remaining clients about disconnection
        this.broadcast("user_disconnected", {
          totalDashboards: this.connectedClients.size,
        })
      })
    })
  }

  private async handleClientMessage(ws: ExtendedWebSocket, message: any): Promise<void> {
    const { type, data } = message

    switch (type) {
      case "request_detailed_stats":
        try {
          const [summary, sessions, recentEvents] = await Promise.all([
            this.analyticsService.getSummary(data?.filter),
            this.analyticsService.getActiveSessions(data?.filter),
            this.analyticsService.getRecentEvents(50, data?.filter),
          ])

          this.sendToClient(ws, "detailed_stats_response", summary)
          this.sendToClient(ws, "filtered_sessions", sessions)
          this.sendToClient(ws, "filtered_events", recentEvents)
        } catch (error) {
          console.error("Error fetching detailed stats:", error)
          this.sendToClient(ws, "error", { message: "Failed to fetch detailed stats" })
        }
        break

      case "apply_filters":
        try {
          console.log(`Applying filters for client ${ws.id}:`, data)
          ws.filters = data
          
          // Send filtered data immediately
          const [summary, sessions, recentEvents] = await Promise.all([
            this.analyticsService.getSummary(ws.filters),
            this.analyticsService.getActiveSessions(ws.filters),
            this.analyticsService.getRecentEvents(50, ws.filters),
          ])

          this.sendToClient(ws, "detailed_stats_response", summary)
          this.sendToClient(ws, "filtered_sessions", sessions)
          this.sendToClient(ws, "filtered_events", recentEvents)
        } catch (error) {
          console.error("Error applying filters:", error)
          this.sendToClient(ws, "error", { message: "Failed to apply filters" })
        }
        break

      case "clear_filters":
        try {
          console.log(`Clearing filters for client ${ws.id}`)
          ws.filters = undefined
          
          // Send unfiltered data
          const [summary, sessions, recentEvents] = await Promise.all([
            this.analyticsService.getSummary(),
            this.analyticsService.getActiveSessions(),
            this.analyticsService.getRecentEvents(50),
          ])

          this.sendToClient(ws, "detailed_stats_response", summary)
          this.sendToClient(ws, "filtered_sessions", sessions)
          this.sendToClient(ws, "filtered_events", recentEvents)
        } catch (error) {
          console.error("Error clearing filters:", error)
          this.sendToClient(ws, "error", { message: "Failed to clear filters" })
        }
        break

      default:
        console.log("Unknown message type:", type)
    }
  }

  private sendToClient(ws: ExtendedWebSocket, type: string, data: any): void {
    if (ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify({ type, data }))
      } catch (error) {
        console.error("Error sending message to client:", error)
      }
    }
  }

  private broadcast(type: string, data: any, excludeId?: string): void {
    const message = JSON.stringify({ type, data })

    this.connectedClients.forEach((ws, clientId) => {
      if (clientId !== excludeId && ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(message)
        } catch (error) {
          console.error(`Error broadcasting to client ${clientId}:`, error)
          this.connectedClients.delete(clientId)
        }
      }
    })
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      this.connectedClients.forEach((ws, clientId) => {
        if (!ws.isAlive) {
          console.log(`Terminating inactive client: ${clientId}`)
          ws.terminate()
          this.connectedClients.delete(clientId)
          return
        }

        ws.isAlive = false
        ws.ping()
      })
    }, 30000) // 30 seconds
  }

  async broadcastVisitorUpdate(eventData: any): Promise<void> {
    try {
      console.log("Broadcasting visitor update for event:", eventData.type, eventData.page)
      
      // Send personalized updates to each client based on their filters
      for (const [clientId, ws] of this.connectedClients) {
        if (ws.readyState === WebSocket.OPEN) {
          try {
            const stats = await this.analyticsService.getSummary(ws.filters)
            
            this.sendToClient(ws, "visitor_update", {
              event: eventData,
              stats,
            })
          } catch (error) {
            console.error(`Error sending filtered update to client ${clientId}:`, error)
          }
        }
      }

      // Check for alerts using unfiltered stats
      const globalStats = await this.analyticsService.getSummary()
      await this.checkAndSendAlerts(globalStats)
    } catch (error) {
      console.error("Error broadcasting visitor update:", error)
    }
  }

  async broadcastSessionActivity(sessionId: string): Promise<void> {
    try {
      const sessions = await this.analyticsService.getActiveSessions()
      const session = sessions.find((s) => s.sessionId === sessionId)

      if (session) {
        this.broadcast("session_activity", {
          sessionId: session.sessionId,
          currentPage: session.currentPage,
          journey: session.journey,
          duration: session.duration,
        })
      }
    } catch (error) {
      console.error("Error broadcasting session activity:", error)
    }
  }

  private async checkAndSendAlerts(stats: any): Promise<void> {
    // Milestone alerts
    if (stats.totalToday > 0 && stats.totalToday % 100 === 0) {
      this.broadcast("alert", {
        level: "milestone",
        message: `Milestone reached: ${stats.totalToday} visitors today!`,
        details: { totalToday: stats.totalToday },
      })
    }

    // High activity alert
    if (stats.totalActive > 20) {
      this.broadcast("alert", {
        level: "warning",
        message: "High visitor activity detected!",
        details: { activeVisitors: stats.totalActive },
      })
    }
  }

  getConnectedDashboards(): number {
    return this.connectedClients.size
  }

  close(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }

    this.connectedClients.forEach((ws) => {
      ws.terminate()
    })
    this.connectedClients.clear()

    this.wss.close()
  }
}
