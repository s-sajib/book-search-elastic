'use client'

import { useEffect } from 'react'

interface AnalyticsTrackerProps {
  query: string
  resultsCount: number
}

export default function AnalyticsTracker({ query, resultsCount }: AnalyticsTrackerProps) {
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