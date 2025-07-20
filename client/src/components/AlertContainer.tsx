import React, { useEffect } from 'react'
import type { Alert } from '../lib/types'

interface AlertContainerProps {
  alerts: Alert[]
  onRemoveAlert: (id: string) => void
}

const AlertContainer: React.FC<AlertContainerProps> = ({ alerts, onRemoveAlert }) => {
  useEffect(() => {
    alerts.forEach(alert => {
      if (alert.id) {
        setTimeout(() => {
          onRemoveAlert(alert.id!)
        }, 5000)
      }
    })
  }, [alerts, onRemoveAlert])

  const getAlertConfig = (level: string) => {
    switch (level) {
      case 'info':
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          text: 'text-blue-300',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        }
      case 'warning':
        return {
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          text: 'text-amber-300',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          )
        }
      case 'milestone':
        return {
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          text: 'text-emerald-300',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        }
      default:
        return {
          bg: 'bg-slate-500/10',
          border: 'border-slate-500/30',
          text: 'text-slate-300',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        }
    }
  }

  if (alerts.length === 0) {
    return null
  }

  return (
    <div className="mb-6 space-y-3">
      {alerts.map((alert) => {
        const config = getAlertConfig(alert.level)
        return (
          <div
            key={alert.id}
            className={`${config.bg} ${config.border} ${config.text} border rounded-xl p-4 backdrop-blur-sm shadow-lg`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {config.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white mb-1">{alert.message}</div>
                {alert.details && (
                  <div className="text-sm opacity-80 font-mono bg-black/20 rounded-lg p-2 mt-2">
                    {JSON.stringify(alert.details, null, 2)}
                  </div>
                )}
              </div>
              <button
                onClick={() => alert.id && onRemoveAlert(alert.id)}
                className="flex-shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default AlertContainer
