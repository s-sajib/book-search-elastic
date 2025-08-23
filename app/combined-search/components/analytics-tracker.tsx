'use client'

import { useEffect } from 'react'

interface AnalyticsTrackerProps {
  query: string
  resultsCount: number
  searchTime?: number
}

export default function AnalyticsTracker({ query, resultsCount, searchTime }: AnalyticsTrackerProps) {
  useEffect(() => {
    if (!query || !query.trim()) return

    // Track search event (fire and forget)
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'search',
        query: query.trim(),
        results_count: resultsCount,
        search_time: searchTime || 0,
        timestamp: new Date().toISOString()
      })
    }).catch(error => {
      // Silent fail - analytics shouldn't break user experience
      console.warn('Analytics tracking failed:', error)
    })
  }, [query, resultsCount])

  // This component renders nothing
  return null
}