"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Stats, Filters as FilterType } from "../lib/types"

interface FiltersProps {
  stats: Stats
  currentFilters: FilterType
  onFilterChange: (filters: FilterType) => void
  onClearFilters: () => void
}

const Filters: React.FC<FiltersProps> = ({ stats, currentFilters, onFilterChange, onClearFilters }) => {
  const [localFilters, setLocalFilters] = useState<FilterType>(currentFilters)

  useEffect(() => {
    setLocalFilters(currentFilters)
  }, [currentFilters])

  const handleFilterChange = (key: keyof FilterType, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }))
  }

  const applyFilters = () => {
    onFilterChange(localFilters)
  }

  const clearFilters = () => {
    setLocalFilters({})
    onClearFilters()
  }

  const renderOptions = (data: Record<string, number>, placeholder: string) => {
    return (
      <>
        <option value="">{placeholder}</option>
        {Object.entries(data).map(([key, count]) => (
          <option key={key} value={key}>
            {key} ({count})
          </option>
        ))}
      </>
    )
  }

  const hasActiveFilters = Object.values(localFilters).some((value) => value)

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 mb-8 shadow-xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">Filters</h3>
          <p className="text-sm text-slate-400">Filter analytics data by various criteria</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Country</span>
          </label>
          <select
            value={localFilters.country || ""}
            onChange={(e) => handleFilterChange("country", e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600/50 text-white rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm text-sm"
          >
            {renderOptions(stats.countriesVisited || {}, "All Countries")}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Page</span>
          </label>
          <select
            value={localFilters.page || ""}
            onChange={(e) => handleFilterChange("page", e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600/50 text-white rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm text-sm"
          >
            {renderOptions(stats.pagesVisited || {}, "All Pages")}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <span>Device</span>
          </label>
          <select
            value={localFilters.device || ""}
            onChange={(e) => handleFilterChange("device", e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600/50 text-white rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm text-sm"
          >
            {renderOptions(stats.devicesUsed || {}, "All Devices")}
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-3">
        <button
          onClick={applyFilters}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-sm sm:text-base"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <span>Apply Filters</span>
        </button>

        <button
          onClick={clearFilters}
          className="bg-slate-700/50 hover:bg-slate-600/50 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-200 border border-slate-600/50 hover:border-slate-500/50 flex items-center justify-center space-x-2 text-sm sm:text-base"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>Clear All</span>
        </button>

        {hasActiveFilters && (
          <div className="flex items-center space-x-2 px-3 py-2 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm text-blue-300">Filters active</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default Filters
