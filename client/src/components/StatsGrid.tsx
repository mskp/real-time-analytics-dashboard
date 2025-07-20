import type React from "react"
import type { Stats } from "../lib/types"

interface StatsGridProps {
  stats: Stats
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  const getTopPage = () => {
    const pages = Object.keys(stats.pagesVisited || {})
    if (pages.length === 0) return "-"

    return pages.sort((a, b) => (stats.pagesVisited[b] || 0) - (stats.pagesVisited[a] || 0))[0]
  }

  const getTopCountry = () => {
    const countries = Object.keys(stats.countriesVisited || {})
    if (countries.length === 0) return "-"

    return countries.sort((a, b) => (stats.countriesVisited[b] || 0) - (stats.countriesVisited[a] || 0))[0]
  }

  const statCards = [
    {
      title: "Active Visitors",
      value: stats.totalActive || 0,
      gradient: "from-blue-500 to-cyan-600",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      borderColor: "border-blue-500/30",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
    },
    {
      title: "Total Today",
      value: stats.totalToday || 0,
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-500/10 to-teal-500/10",
      borderColor: "border-emerald-500/30",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      title: "Top Page",
      value: getTopPage(),
      gradient: "from-purple-500 to-pink-600",
      bgGradient: "from-purple-500/10 to-pink-500/10",
      borderColor: "border-purple-500/30",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      title: "Top Country",
      value: getTopCountry(),
      gradient: "from-amber-500 to-orange-600",
      bgGradient: "from-amber-500/10 to-orange-500/10",
      borderColor: "border-amber-500/30",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {statCards.map((card) => (
        <div
          key={card.title}
          className={`group bg-slate-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border ${card.borderColor} hover:bg-slate-700/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}
            >
              {card.icon}
            </div>
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${card.gradient} animate-pulse`}></div>
          </div>

          <div className="space-y-2">
            <h3 className="text-slate-400 text-xs sm:text-sm font-medium uppercase tracking-wider">{card.title}</h3>
            <div
              className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}
            >
              {typeof card.value === "string" ? (
                <span className="text-xl sm:text-2xl break-all">{card.value}</span>
              ) : (
                card.value.toLocaleString()
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsGrid
