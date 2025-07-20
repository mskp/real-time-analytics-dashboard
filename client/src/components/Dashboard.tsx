"use client"

import type React from "react"
import { useCallback, useEffect, useState } from "react"
import { useAnalytics } from "../hooks/use-analytics"
import { useWebSocket } from "../hooks/use-websocket"
import { API_BASE_URL } from "../lib/constants"
import type { Alert, Filters as FilterType } from "../lib/types"
import ActiveSessions from "./ActiveSessions"
import AlertContainer from "./AlertContainer"
import Filters from "./Filters"
import Header from "./Header"
import LiveEvents from "./LiveEvents"
import StatsGrid from "./StatsGrid"

function getSessionId() {
  let sessionId = sessionStorage.getItem("sessionId")
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    sessionStorage.setItem("sessionId", sessionId)
  }
  return sessionId
}

const Dashboard: React.FC = () => {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [currentFilters, setCurrentFilters] = useState<FilterType>({})
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [country, setCountry] = useState<string>("unknown")

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => setCountry(data.country_name))
      .catch(() => setCountry("unknown"))
  }, [])

  const { connectionStatus, dashboardCount, events, sessions, stats, sendMessage } = useWebSocket()

  const { loadInitialData } = useAnalytics()

  useEffect(() => {
    loadInitialData()
    const sessionId = getSessionId()
    fetch(`${API_BASE_URL}/api/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        type: "pageview",
        page: window.location.pathname,
        country,
        timestamp: new Date().toISOString(),
        metadata: {
          device: navigator.userAgent,
          referrer: document.referrer,
        },
      }),
    })

    return () => {
      fetch(`${API_BASE_URL}/api/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          type: "session_end",
          page: window.location.pathname,
          country,
          timestamp: new Date().toISOString(),
          metadata: {
            device: navigator.userAgent,
            referrer: document.referrer,
          },
        }),
      })
    }
  }, [loadInitialData, country])

  const handleFilterChange = useCallback(
    (filters: FilterType) => {
      setCurrentFilters(filters)
      sendMessage("apply_filters", filters)
    },
    [sendMessage],
  )

  const clearFilters = useCallback(() => {
    setCurrentFilters({})
    sendMessage("clear_filters", {})
  }, [sendMessage])

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev)
  }, [])

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }, [])

  return (
    <div className="min-h-screen bg-black">
      <div className="relative z-10">
        <Header connectionStatus={connectionStatus} dashboardCount={dashboardCount} />

        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
          <AlertContainer alerts={alerts} onRemoveAlert={removeAlert} />
          <StatsGrid stats={stats} />
          <Filters
            stats={stats}
            currentFilters={currentFilters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
          />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
            <LiveEvents events={events} soundEnabled={soundEnabled} onToggleSound={toggleSound} />
            <ActiveSessions sessions={sessions} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
