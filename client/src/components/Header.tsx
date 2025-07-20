import type React from "react"
import type { ConnectionStatus } from "../lib/types"

interface HeaderProps {
  connectionStatus: ConnectionStatus
  dashboardCount: number
}

const Header: React.FC<HeaderProps> = ({ connectionStatus, dashboardCount }) => {
  const getStatusConfig = () => {
    switch (connectionStatus) {
      case "connected":
        return {
          color: "bg-emerald-500",
          text: "Connected",
          icon: (
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ),
        }
      case "disconnected":
        return {
          color: "bg-red-500",
          text: "Disconnected",
          icon: (
            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ),
        }
      case "reconnecting":
        return {
          color: "bg-amber-500",
          text: "Reconnecting...",
          icon: (
            <svg className="w-4 h-4 text-amber-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          ),
        }
      default:
        return {
          color: "bg-slate-500",
          text: "Connecting...",
          icon: (
            <svg className="w-4 h-4 text-slate-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          ),
        }
    }
  }

  const statusConfig = getStatusConfig()

  return (
    <div className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700/50 shadow-2xl sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                Real-Time Analytics
              </h1>
              <p className="text-sm text-slate-400">Monitor your website activity in real-time</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-slate-700/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-600/30">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full pulse-dot ${statusConfig.color}`}></div>
                  <span className="text-sm font-medium text-white">{statusConfig.text}</span>
                  {statusConfig.icon}
                </div>
                <div className="w-px h-4 bg-slate-600"></div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm text-slate-300">
                    {dashboardCount} dashboard{dashboardCount !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
