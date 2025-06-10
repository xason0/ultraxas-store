// Utility functions for F-Droid app management
export async function checkAppsJsonExists(): Promise<boolean> {
  try {
    const response = await fetch("/data/apps.json", { method: "HEAD" })
    return response.ok
  } catch {
    return false
  }
}

export async function getAppsJsonStats(): Promise<{ exists: boolean; count: number; size?: string }> {
  try {
    const response = await fetch("/data/apps.json")
    if (!response.ok) {
      return { exists: false, count: 0 }
    }

    const data = await response.json()
    const apps = Array.isArray(data) ? data : data.apps || data.packages || []
    const sizeHeader = response.headers.get("content-length")
    const size = sizeHeader ? `${Math.round(Number.parseInt(sizeHeader) / 1024)} KB` : undefined

    return {
      exists: true,
      count: apps.length,
      size,
    }
  } catch (error) {
    console.error("Error checking apps.json stats:", error)
    return { exists: false, count: 0 }
  }
}
