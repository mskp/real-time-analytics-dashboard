"use client"

import type React from "react"
import type { SessionData } from "../lib/types"

interface SessionDetailsModalProps {
  session: SessionData | null
  isOpen: boolean
  onClose: () => void
}

const SessionDetailsModal: React.FC<SessionDetailsModalProps> = ({ session, isOpen, onClose }) => {
  if (!isOpen || !session) return null

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${mins}m ${secs}s`
    }
    return `${mins}m ${secs}s`
  }

  const formatTimestamp = (duration: number) => {
    const now = new Date()
    const startTime = new Date(now.getTime() - duration * 1000)
    return startTime.toLocaleTimeString()
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-slate-800/95 backdrop-blur-md rounded-2xl border border-slate-700/50 w-full max-w-4xl max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800/90 to-slate-700/90 px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-600/30 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Session Details</h2>
                <p className="text-xs sm:text-sm text-slate-400 font-mono truncate">ID: {session.sessionId}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-200 flex-shrink-0"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-140px)] scrollbar-thin">
          <div className="p-4 sm:p-6">
            {/* Session Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-600/30">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Session Status</h3>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-800/40 rounded-lg">
                    <span className="text-slate-400 flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm">Duration</span>
                    </span>
                    <span className="text-white font-semibold text-sm">{formatDuration(session.duration)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-800/40 rounded-lg">
                    <span className="text-slate-400 flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 2m8-2l2 2m-2-2v6a2 2 0 01-2 2H8a2 2 0 01-2-2v-6"
                        />
                      </svg>
                      <span className="text-sm">Started</span>
                    </span>
                    <span className="text-white font-semibold text-sm">{formatTimestamp(session.duration)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-800/40 rounded-lg">
                    <span className="text-slate-400 flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span className="text-sm">Pages Visited</span>
                    </span>
                    <span className="text-white font-semibold text-sm">{session.journey.length}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-600/30">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Current Activity</h3>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="p-3 bg-slate-800/40 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-slate-400 text-sm">Current Page:</span>
                    </div>
                    <span className="text-blue-400 font-semibold text-sm break-all">{session.currentPage}</span>
                  </div>
                  {session.country && (
                    <div className="p-3 bg-slate-800/40 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-slate-400 text-sm">Location:</span>
                      </div>
                      <span className="text-white font-semibold text-sm">{session.country}</span>
                    </div>
                  )}
                  {session.device && (
                    <div className="p-3 bg-slate-800/40 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-slate-400 text-sm">Device:</span>
                      </div>
                      <span className="text-white font-semibold text-sm break-all">{session.device}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* User Journey - Scrollable */}
            <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-600/30">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">User Journey</h3>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin">
                {session.journey.map((page, index) => (
                  <div key={`${session.sessionId}-journey-${index}`} className="flex items-start space-x-4">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === session.journey.length - 1
                            ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg"
                            : "bg-slate-600/50 text-slate-300 border border-slate-500/30"
                        }`}
                      >
                        {index + 1}
                      </div>
                      {index < session.journey.length - 1 && <div className="w-px h-8 bg-slate-600/50 mt-2"></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className={`p-3 sm:p-4 rounded-xl transition-all duration-200 ${
                          index === session.journey.length - 1
                            ? "bg-blue-500/10 border border-blue-500/30"
                            : "bg-slate-800/40 border border-slate-600/30"
                        }`}
                      >
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span
                            className={`font-semibold text-sm break-all ${
                              index === session.journey.length - 1 ? "text-blue-400" : "text-white"
                            }`}
                          >
                            {page}
                          </span>
                          {index === session.journey.length - 1 && (
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-md font-medium border border-blue-500/30 flex-shrink-0">
                              Current
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SessionDetailsModal
