import express from "express"
import { createServer } from "http"
import mongoose from "mongoose"
import cors from "cors"
import path from "path"
import { AnalyticsService } from "./services/analytics.service"
import { WebSocketService } from "./services/websocket.service"
import { configureEventRoutes } from "./routes/events.routes"
import { configureAnalyticsRoutes } from "./routes/analytics.routes"
import { configureHealthRoutes } from "./routes/health.routes"
import { errorHandler, notFoundHandler } from "./middleware/error.middleware"

const app = express()
const server = createServer(app)
const PORT = process.env.PORT ?? 3000
const MONGODB_URI = process.env.MONGODB_URI!
const IS_PRODUCTION = process.env.NODE_ENV === 'production'

// Middleware
app.use(cors())
app.use(express.json())

// Serve static files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, "../dist/client")))
} else {
  app.use(express.static(path.join(__dirname, "../public")))
}

// Initialize services
const analyticsService = new AnalyticsService()
let webSocketService: WebSocketService | null = null

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB")

    // Initialize WebSocket service after DB connection
    webSocketService = new WebSocketService(server, analyticsService)
    console.log("WebSocket service initialized")

    // Start cleanup interval
    setInterval(
      () => {
        analyticsService.cleanupInactiveSessions()
      },
      5 * 60 * 1000,
    )
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error)
    process.exit(1)
  })

// API Routes
app.use("/api/events", configureEventRoutes(analyticsService, webSocketService))
app.use("/api/analytics", configureAnalyticsRoutes(analyticsService))
app.use("/health", configureHealthRoutes(webSocketService))

// Dashboard route
app.get("/dashboard", (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(path.join(__dirname, "../dist/client/index.html"))
  } else {
    res.redirect('http://localhost:5173')
  }
})

// Error handling
app.use(notFoundHandler)
app.use(errorHandler)

// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`Dashboard available at http://localhost:${PORT}/dashboard`)
  console.log(`WebSocket available at ws://localhost:${PORT}/ws`)
})

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully")
  server.close(() => {
    mongoose.connection.close()
    process.exit(0)
  })
})
