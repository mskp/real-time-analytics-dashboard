export interface VisitorEvent {
  sessionId: string
  type: 'pageview' | 'click' | 'session_end'
  page: string
  country: string
  timestamp: string
  metadata?: VisitorEventMetadata
}

export interface VisitorEventMetadata {
  device?: string
  ip?: string
  userAgent?: string
  [key: string]: any
}

export interface SessionData {
  sessionId: string
  currentPage: string
  duration: number
  journey: string[]
  country?: string
  device?: string
}

export interface Stats {
  totalActive: number
  totalToday: number
  pagesVisited: Record<string, number>
  countriesVisited: Record<string, number>
  devicesUsed: Record<string, number>
}

export interface Alert {
  id?: string
  level: 'info' | 'warning' | 'milestone'
  message: string
  details?: any
}

export interface Filters {
  country?: string
  page?: string
  device?: string
}

export type ConnectionStatus = 'connected' | 'disconnected' | 'reconnecting'

export interface WebSocketMessage {
  type: string
  data: any
}