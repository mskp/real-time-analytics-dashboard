import { Router } from "express"
import { WebSocketService } from "../services/websocket.service"

const router = Router()

export const configureHealthRoutes = (webSocketService: WebSocketService | null) => {
  router.get("/", (req, res) => {
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      connectedDashboards: webSocketService ? webSocketService.getConnectedDashboards() : 0,
    })
  })

  return router
}
