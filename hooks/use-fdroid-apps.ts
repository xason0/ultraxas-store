"use client"

import { useState, useEffect } from "react"
import { getFDroidApps } from "@/lib/storage"
import type { App } from "@/lib/types"

export function useFDroidApps() {
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadApps() {
    try {
      setLoading(true)
      setError(null)
      const fdroidApps = await getFDroidApps()
      setApps(fdroidApps)
      console.log(`✅ Loaded ${fdroidApps.length} F-Droid apps from apps.json`)
    } catch (err) {
      console.error("Error loading F-Droid apps:", err)
      setError("Failed to load apps")
      setApps([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadApps()
  }, [])

  return { apps, loading, error, refetch: () => loadApps() }
}
