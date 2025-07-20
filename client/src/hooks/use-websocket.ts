import { useState, useEffect, useCallback, useRef } from 'react'
import type { VisitorEvent, SessionData, Stats, ConnectionStatus, WebSocketMessage } from '../lib/types'
import { getSessionId } from './use-analytics'

export const useWebSocket = () => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected')
  const [dashboardCount, setDashboardCount] = useState(0)
  const [events, setEvents] = useState<VisitorEvent[]>([])
  const [sessions, setSessions] = useState<SessionData[]>([])
  const [stats, setStats] = useState<Stats>({
    totalActive: 0,
    totalToday: 0,
    pagesVisited: {},
    countriesVisited: {},
    devicesUsed: {}
  })

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const maxReconnectAttempts = 5

  const playNotificationSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 800
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    } catch (error) {
      console.log('Audio not supported')
    }
  }, [])

  const handleMessage = useCallback((message: WebSocketMessage) => {
    const { type, data } = message

    switch (type) {
      case 'visitor_update':
        setEvents(prev => [data.event, ...prev.slice(0, 49)])
        setStats(data.stats)
        playNotificationSound()
        break
      case 'user_connected':
      case 'user_disconnected':
        setDashboardCount(data.totalDashboards)
        break
      case 'session_activity':
        setSessions(prev => {
          const existingIndex = prev.findIndex(s => s.sessionId === data.sessionId)
          if (existingIndex >= 0) {
            const updated = [...prev]
            updated[existingIndex] = { ...updated[existingIndex], ...data }
            return updated
          } else {
            return [data, ...prev.slice(0, 19)]
          }
        })
        break
      case 'alert':
        // Handle alerts if needed
        break
      case 'detailed_stats_response':
        setStats(data)
        break
      case 'filtered_sessions':
        setSessions(data)
        break
      case 'filtered_events':
        setEvents(data)
        break
      case 'error':
        console.error('Server error:', data)
        break
      default:
        console.log('Unknown message type:', type)
    }
  }, [playNotificationSound])

  const initializeWebSocket = useCallback(() => {
    // Prevent multiple connections
    if (wsRef.current && (wsRef.current.readyState === WebSocket.CONNECTING || wsRef.current.readyState === WebSocket.OPEN)) {
      console.log('WebSocket connection already in progress or open')
      return
    }
    
    // Close existing connection if any
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log('Closing existing WebSocket connection')
      wsRef.current.close()
    }

    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000/ws'
    console.log('Connecting to WebSocket:', wsUrl)

    try {
      wsRef.current = new WebSocket(wsUrl)

      wsRef.current.onopen = () => {
        console.log('WebSocket connected')
        setConnectionStatus('connected')
        reconnectAttemptsRef.current = 0
        
        // Request initial data when connected
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: 'request_detailed_stats', data: {} }))
        }
      }

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          console.log('Received message:', message)
          handleMessage(message)
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      wsRef.current.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason)
        setConnectionStatus('disconnected')
        wsRef.current = null
        
        // Only attempt reconnect if it wasn't a normal closure
        if (event.code !== 1000) {
          attemptReconnect()
        }
      }

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error)
        setConnectionStatus('disconnected')
      }
    } catch (error) {
      console.error('Error creating WebSocket:', error)
      setConnectionStatus('disconnected')
      attemptReconnect()
    }
  }, [handleMessage])

  const attemptReconnect = useCallback(() => {
    if (reconnectAttemptsRef.current < maxReconnectAttempts) {
      reconnectAttemptsRef.current++
      setConnectionStatus('reconnecting')

      const delay = Math.pow(2, reconnectAttemptsRef.current) * 1000
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttemptsRef.current})`)

      setTimeout(() => {
        // Only reconnect if there's no existing connection
        if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
          initializeWebSocket()
        }
      }, delay)
    } else {
      console.error('Max reconnection attempts reached')
      setConnectionStatus('disconnected')
    }
  }, [initializeWebSocket])

  const sendMessage = useCallback((type: string, data: any = {}) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, data }))
    } else {
      console.warn('WebSocket not connected, cannot send message:', type)
    }
  }, [])

  useEffect(() => {
    initializeWebSocket()

    return () => {
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounting')
        wsRef.current = null
      }
    }
  }, [initializeWebSocket])

  return {
    connectionStatus,
    dashboardCount,
    events,
    sessions,
    stats,
    sendMessage,
    getSessionId, // Expose sessionId for use in analytics events
  }
}