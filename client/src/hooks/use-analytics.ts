import { useCallback } from 'react'

// Utility to get or generate a sessionId for this tab
export function getSessionId() {
  let sessionId = sessionStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
}

export const useAnalytics = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  
  const loadInitialData = useCallback(async () => {
    try {
      // Load initial data from API endpoints
      const [summaryResponse, sessionsResponse, eventsResponse] = await Promise.all([
        fetch(`${apiUrl}/api/analytics/summary`),
        fetch(`${apiUrl}/api/analytics/sessions`),
        fetch(`${apiUrl}/api/analytics/events?limit=20`)
      ])

      if (summaryResponse.ok) {
        const summary = await summaryResponse.json()
        console.log('Initial summary loaded:', summary)
      }

      if (sessionsResponse.ok) {
        const sessions = await sessionsResponse.json()
        console.log('Initial sessions loaded:', sessions)
      }

      if (eventsResponse.ok) {
        const events = await eventsResponse.json()
        console.log('Initial events loaded:', events)
      }
    } catch (error) {
      console.error('Error loading initial data:', error)
    }
  }, [])

  return {
    loadInitialData,
    getSessionId, // Export for use in event sending
  }
}