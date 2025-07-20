import type React from "react"
import { useState } from "react"
import type { SessionData } from "../lib/types"
import SessionDetailsModal from "./SessionDetailsModal"

interface ActiveSessionsProps {
  sessions: SessionData[]
}

const ActiveSessions: React.FC<ActiveSessionsProps> = ({ sessions }) => {
  const [selectedSession, setSelectedSession] = useState<SessionData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const showSessionDetails = (sessionId: string) => {
    const session = sessions.find((s) => s.sessionId === sessionId)
    if (session) {
      setSelectedSession(session)
      setIsModalOpen(true)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedSession(null)
  }

  return (
    <>
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl">
        <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 px-6 py-5 border-b border-slate-600/30">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Active Sessions</h2>
                <p className="text-sm text-slate-400">Real-time user activity</p>
              </div>
            </div>
            <div className="bg-slate-700/50 px-3 py-1.5 rounded-lg border border-slate-600/30">
              <span className="text-sm font-medium text-slate-300">
                {sessions.length} session{sessions.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        <div className="h-96 overflow-y-auto scrollbar-thin">
          {sessions.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <p className="text-slate-400 font-medium">No active sessions</p>
                <p className="text-sm text-slate-500 mt-1">Sessions will appear here when users visit your site</p>
              </div>
            </div>
          ) : (
            <div className="p-2">
              {sessions.map((session) => (
                <div
                  key={session.sessionId}
                  className="group p-3 sm:p-4 m-2 bg-slate-800/30 hover:bg-slate-700/40 rounded-xl border border-slate-700/30 hover:border-slate-600/50 transition-all duration-200 cursor-pointer"
                  onClick={() => showSessionDetails(session.sessionId)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                        {session.sessionId.slice(-2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-semibold text-white text-sm block truncate">
                          Session {session.sessionId.slice(-8)}
                        </span>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse flex-shrink-0"></div>
                          <span className="text-xs text-slate-400">Active</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="bg-slate-700/50 px-2 py-1 rounded-md">
                        <span className="text-xs font-mono text-slate-300">{formatDuration(session.duration)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center space-x-2 min-w-0">
                      <svg
                        className="w-4 h-4 text-slate-400 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span className="text-sm text-slate-300 flex-shrink-0">Currently on:</span>
                      <span className="font-semibold text-blue-400 text-sm truncate">{session.currentPage}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {session.journey.slice(0, 4).map((page, pageIndex) => (
                      <span
                        key={`${session.sessionId}-${page}-${pageIndex}`}
                        className="px-2 py-1 bg-slate-700/40 text-xs rounded-md text-slate-300 border border-slate-600/30 truncate max-w-24 sm:max-w-32"
                        title={page}
                      >
                        {page}
                      </span>
                    ))}
                    {session.journey.length > 4 && (
                      <span className="px-2 py-1 bg-slate-600/40 text-xs rounded-md text-slate-400 border border-slate-600/30 flex-shrink-0">
                        +{session.journey.length - 4} more
                      </span>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-700/30">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Click to view details</span>
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <SessionDetailsModal session={selectedSession} isOpen={isModalOpen} onClose={closeModal} />
    </>
  )
}

export default ActiveSessions
