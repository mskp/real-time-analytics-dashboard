export interface VisitorEvent {
  type: "pageview" | "click" | "session_end"
  page: string
  sessionId: string
  timestamp: string
  country: string
  metadata?: {
    device?: string
    referrer?: string
    userAgent?: string
    ip?: string
  }
}

export interface SessionData {
  sessionId: string
  currentPage: string
  journey: string[]
  startTime: Date
  lastActivity: Date
  country: string
  device?: string
  referrer?: string
  isActive: boolean
  duration: number
}

export interface AnalyticsSummary {
  totalActive: number
  totalToday: number
  pagesVisited: Record<string, number>
  countriesVisited: Record<string, number>
  devicesUsed: Record<string, number>
}

export interface WebSocketEvents {
  // Server to Client
  visitor_update: {
    event: VisitorEvent
    stats: AnalyticsSummary
  }
  user_connected: {
    totalDashboards: number
    connectedAt: string
  }
  user_disconnected: {
    totalDashboards: number
  }
  session_activity: {
    sessionId: string
    currentPage: string
    journey: string[]
    duration: number
  }
  alert: {
    level: "info" | "warning" | "milestone"
    message: string
    details: any
  }

  // Client to Server
  request_detailed_stats: {
    filter?: {
      country?: string
      page?: string
      device?: string
    }
  }
  track_dashboard_action: {
    action: string
    details: any
  }
}

export interface FilterOptions {
  country?: string
  page?: string
  device?: string
  startDate?: Date
  endDate?: Date
}
