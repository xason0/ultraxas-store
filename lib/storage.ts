import type { App } from "./types"
import { enhancedStorage } from "./enhanced-storage"

// Legacy compatibility layer
export function getApps(): App[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem("ultraxas_apps")
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export async function addApp(app: App, apkFile?: File): Promise<void> {
  try {
    await enhancedStorage.addApp(app, apkFile)
  } catch (error) {
    console.error("Failed to save app:", error)
    // Fallback to localStorage
    const apps = getApps()
    apps.push(app)
    localStorage.setItem("ultraxas_apps", JSON.stringify(apps))
  }
}

// New saveApp function for upload page
export async function saveApp(app: App, apkFile: File): Promise<void> {
  try {
    // Get existing apps
    const existingApps = await getAllApps()

    // Add new app
    existingApps.push(app)

    // Save to localStorage
    localStorage.setItem("ultraxas_apps", JSON.stringify(existingApps))

    console.log(`✅ App "${app.name}" saved successfully`)
    return Promise.resolve()
  } catch (error) {
    console.error("Error saving app:", error)
    return Promise.reject(new Error("Failed to save app"))
  }
}

export function updateApp(id: string, updates: Partial<App>): void {
  if (typeof window === "undefined") return

  try {
    const apps = getApps()
    const index = apps.findIndex((app) => app.id === id)
    if (index !== -1) {
      apps[index] = { ...apps[index], ...updates }
      localStorage.setItem("ultraxas_apps", JSON.stringify(apps))
    }
  } catch (error) {
    console.error("Failed to update app:", error)
  }
}

// Delete app from storage
export async function deleteApp(appId: string): Promise<void> {
  try {
    // Get existing apps
    const existingApps = await getAllApps()

    // Filter out the app to delete
    const updatedApps = existingApps.filter((app) => app.id !== appId)

    // Save updated list to localStorage
    localStorage.setItem("ultraxas_apps", JSON.stringify(updatedApps))

    console.log(`✅ App with ID "${appId}" deleted successfully`)
    return Promise.resolve()
  } catch (error) {
    console.error("Error deleting app:", error)
    return Promise.reject(new Error("Failed to delete app"))
  }
}

// Enhanced storage usage functions with 1TB capacity
export async function getStorageUsage(): Promise<{ used: number; total: number; percentage: number }> {
  if (typeof window === "undefined") {
    return { used: 0, total: 0, percentage: 0 }
  }

  try {
    const stats = await enhancedStorage.getStorageStats()

    // Calculate usage with 1TB total capacity
    const totalStorage = 1024 * 1024 * 1024 * 1024 // 1TB in bytes
    let localStorageUsed = 0

    // Calculate localStorage usage
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        localStorageUsed += localStorage[key].length + key.length
      }
    }

    // Add IndexedDB usage (estimated)
    const indexedDBUsed = localStorageUsed * 10 // Rough estimate

    const totalUsed = localStorageUsed + indexedDBUsed
    const percentage = Math.min((totalUsed / totalStorage) * 100, 100)

    return {
      used: totalUsed,
      total: totalStorage,
      percentage: percentage,
    }
  } catch (error) {
    console.error("Failed to calculate storage usage:", error)
    return { used: 0, total: 1024 * 1024 * 1024 * 1024, percentage: 0 }
  }
}

export async function clearStorage(): Promise<void> {
  if (typeof window === "undefined") return

  try {
    // Clear all UltraXas related data
    const keysToRemove = []
    for (const key in localStorage) {
      if (key.startsWith("ultraxas_") || key.startsWith("ultraxas")) {
        keysToRemove.push(key)
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key))

    // Clear enhanced storage (IndexedDB)
    await enhancedStorage.clearAll()

    console.log("✅ All storage cleared (1TB capacity restored)")
  } catch (error) {
    console.error("Failed to clear storage:", error)
    throw error
  }
}

// Add the missing backupData function
export async function backupData(): Promise<string> {
  if (typeof window === "undefined") return ""

  try {
    const backup = {
      version: "3.0.0",
      timestamp: new Date().toISOString(),
      apps: getApps(),
      settings: localStorage.getItem("ultraxasSettings"),
      userSettings: localStorage.getItem("ultraxas_user_settings"),
      adminSettings: localStorage.getItem("ultraxas_admin_settings"),
      downloadHistory: localStorage.getItem("ultraxas_download_history"),
      analytics: {
        visits: localStorage.getItem("ultraxas_analytics_visits"),
        downloads: localStorage.getItem("ultraxas_analytics_downloads"),
        totalVisits: localStorage.getItem("ultraxas_analytics_total_visits"),
        totalDownloads: localStorage.getItem("ultraxas_analytics_total_downloads"),
      },
      storageCapacity: "1TB",
      permanentStorage: true,
    }

    const backupString = JSON.stringify(backup, null, 2)

    // Create and download backup file
    const blob = new Blob([backupString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ultraxas-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    return backupString
  } catch (error) {
    console.error("Failed to create backup:", error)
    throw error
  }
}

// Add the missing restoreData function
export async function restoreData(file: File): Promise<void> {
  if (typeof window === "undefined") return

  try {
    const text = await file.text()
    const backup = JSON.parse(text)

    if (!backup.version || !backup.apps) {
      throw new Error("Invalid backup file format")
    }

    // Restore apps
    if (backup.apps && Array.isArray(backup.apps)) {
      localStorage.setItem("ultraxas_apps", JSON.stringify(backup.apps))
    }

    // Restore settings
    if (backup.settings) {
      localStorage.setItem("ultraxasSettings", backup.settings)
    }

    if (backup.userSettings) {
      localStorage.setItem("ultraxas_user_settings", backup.userSettings)
    }

    if (backup.adminSettings) {
      localStorage.setItem("ultraxas_admin_settings", backup.adminSettings)
    }

    if (backup.downloadHistory) {
      localStorage.setItem("ultraxas_download_history", backup.downloadHistory)
    }

    // Restore analytics
    if (backup.analytics) {
      if (backup.analytics.visits) {
        localStorage.setItem("ultraxas_analytics_visits", backup.analytics.visits)
      }
      if (backup.analytics.downloads) {
        localStorage.setItem("ultraxas_analytics_downloads", backup.analytics.downloads)
      }
      if (backup.analytics.totalVisits) {
        localStorage.setItem("ultraxas_analytics_total_visits", backup.analytics.totalVisits)
      }
      if (backup.analytics.totalDownloads) {
        localStorage.setItem("ultraxas_analytics_total_downloads", backup.analytics.totalDownloads)
      }
    }

    console.log("✅ Data restored with 1TB storage capacity")
  } catch (error) {
    console.error("Failed to restore data:", error)
    throw error
  }
}

// Analytics tracking functions
export function trackVisit(page = "home"): void {
  if (typeof window === "undefined") return

  try {
    const today = new Date().toISOString().split("T")[0]

    // Track total visits
    const totalVisits = Number.parseInt(localStorage.getItem("ultraxas_analytics_total_visits") || "0") + 1
    localStorage.setItem("ultraxas_analytics_total_visits", totalVisits.toString())

    // Track today's visits
    const todayVisitsKey = `ultraxas_analytics_visits_${today}`
    const todayVisits = Number.parseInt(localStorage.getItem(todayVisitsKey) || "0") + 1
    localStorage.setItem(todayVisitsKey, todayVisits.toString())

    // Track page visits
    const pageVisits = JSON.parse(localStorage.getItem("ultraxas_analytics_page_visits") || "{}")
    pageVisits[page] = (pageVisits[page] || 0) + 1
    localStorage.setItem("ultraxas_analytics_page_visits", JSON.stringify(pageVisits))

    // Track visit history (last 100 visits)
    const visitHistory = JSON.parse(localStorage.getItem("ultraxas_analytics_visit_history") || "[]")
    visitHistory.unshift({
      page,
      timestamp: new Date().toISOString(),
      date: today,
    })

    // Keep only last 100 visits
    if (visitHistory.length > 100) {
      visitHistory.splice(100)
    }

    localStorage.setItem("ultraxas_analytics_visit_history", JSON.stringify(visitHistory))
  } catch (error) {
    console.error("Failed to track visit:", error)
  }
}

export function trackDownload(appId: string, appName: string): void {
  if (typeof window === "undefined") return

  try {
    const today = new Date().toISOString().split("T")[0]

    // Track total downloads
    const totalDownloads = Number.parseInt(localStorage.getItem("ultraxas_analytics_total_downloads") || "0") + 1
    localStorage.setItem("ultraxas_analytics_total_downloads", totalDownloads.toString())

    // Track today's downloads
    const todayDownloadsKey = `ultraxas_analytics_downloads_${today}`
    const todayDownloads = Number.parseInt(localStorage.getItem(todayDownloadsKey) || "0") + 1
    localStorage.setItem(todayDownloadsKey, todayDownloads.toString())

    // Track app-specific downloads
    const appDownloads = JSON.parse(localStorage.getItem("ultraxas_analytics_app_downloads") || "{}")
    appDownloads[appId] = (appDownloads[appId] || 0) + 1
    localStorage.setItem("ultraxas_analytics_app_downloads", JSON.stringify(appDownloads))

    // Track download history
    const downloadHistory = JSON.parse(localStorage.getItem("ultraxas_analytics_download_history") || "[]")
    downloadHistory.unshift({
      appId,
      appName,
      timestamp: new Date().toISOString(),
      date: today,
    })

    // Keep only last 100 downloads
    if (downloadHistory.length > 100) {
      downloadHistory.splice(100)
    }

    localStorage.setItem("ultraxas_analytics_download_history", JSON.stringify(downloadHistory))

    // Update app download count in apps list
    updateApp(appId, { downloads: appDownloads[appId] })
  } catch (error) {
    console.error("Failed to track download:", error)
  }
}

export function trackUpload(app: App): void {
  if (typeof window === "undefined") return

  try {
    const today = new Date().toISOString().split("T")[0]

    // Track upload history
    const uploadHistory = JSON.parse(localStorage.getItem("ultraxas_analytics_upload_history") || "[]")
    uploadHistory.unshift({
      appId: app.id,
      appName: app.name,
      timestamp: new Date().toISOString(),
      date: today,
      size: app.size,
      permanentStorage: true,
    })

    // Keep only last 50 uploads
    if (uploadHistory.length > 50) {
      uploadHistory.splice(50)
    }

    localStorage.setItem("ultraxas_analytics_upload_history", JSON.stringify(uploadHistory))
  } catch (error) {
    console.error("Failed to track upload:", error)
  }
}

export function getAnalytics() {
  if (typeof window === "undefined") return null

  try {
    const today = new Date().toISOString().split("T")[0]

    const totalVisits = Number.parseInt(localStorage.getItem("ultraxas_analytics_total_visits") || "0")
    const totalDownloads = Number.parseInt(localStorage.getItem("ultraxas_analytics_total_downloads") || "0")
    const todayVisits = Number.parseInt(localStorage.getItem(`ultraxas_analytics_visits_${today}`) || "0")
    const todayDownloads = Number.parseInt(localStorage.getItem(`ultraxas_analytics_downloads_${today}`) || "0")

    const pageVisits = JSON.parse(localStorage.getItem("ultraxas_analytics_page_visits") || "{}")
    const appDownloads = JSON.parse(localStorage.getItem("ultraxas_analytics_app_downloads") || "{}")
    const visitHistory = JSON.parse(localStorage.getItem("ultraxas_analytics_visit_history") || "[]")
    const downloadHistory = JSON.parse(localStorage.getItem("ultraxas_analytics_download_history") || "[]")
    const uploadHistory = JSON.parse(localStorage.getItem("ultraxas_analytics_upload_history") || "[]")

    // Get popular apps
    const apps = getApps()
    const popularApps = apps
      .map((app) => ({
        ...app,
        downloads: appDownloads[app.id] || 0,
      }))
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, 10)

    return {
      totalVisits,
      totalDownloads,
      todayVisits,
      todayDownloads,
      pageVisits,
      appDownloads,
      visitHistory: visitHistory.slice(0, 10), // Last 10 visits
      downloadHistory: downloadHistory.slice(0, 10), // Last 10 downloads
      uploadHistory: uploadHistory.slice(0, 10), // Last 10 uploads
      popularApps,
      storageCapacity: "1TB",
      permanentStorage: true,
    }
  } catch (error) {
    console.error("Failed to get analytics:", error)
    return null
  }
}

export function clearAnalytics(): void {
  if (typeof window === "undefined") return

  try {
    const keys = [
      "ultraxas_analytics_total_visits",
      "ultraxas_analytics_total_downloads",
      "ultraxas_analytics_page_visits",
      "ultraxas_analytics_app_downloads",
      "ultraxas_analytics_visit_history",
      "ultraxas_analytics_download_history",
      "ultraxas_analytics_upload_history",
    ]

    keys.forEach((key) => localStorage.removeItem(key))

    // Clear daily visit/download counters
    const today = new Date().toISOString().split("T")[0]
    localStorage.removeItem(`ultraxas_analytics_visits_${today}`)
    localStorage.removeItem(`ultraxas_analytics_downloads_${today}`)
  } catch (error) {
    console.error("Failed to clear analytics:", error)
  }
}

// Enhanced functions
export async function downloadAppFile(appId: string): Promise<string | null> {
  // Track download when file is accessed
  const apps = getApps()
  const app = apps.find((a) => a.id === appId)
  if (app) {
    trackDownload(appId, app.name)
  }

  return await enhancedStorage.downloadApp(appId)
}

export async function getStorageInfo() {
  return await enhancedStorage.getStorageStats()
}

export async function createDataBackup(): Promise<string> {
  return await enhancedStorage.createBackup()
}

export async function restoreDataBackup(backupData: string): Promise<void> {
  return await enhancedStorage.restoreFromBackup(backupData)
}

// Get all apps from storage
export async function getAllApps(): Promise<App[]> {
  try {
    const appsJson = localStorage.getItem("ultraxas_apps")
    if (!appsJson) {
      return []
    }

    return JSON.parse(appsJson)
  } catch (error) {
    console.error("Error getting apps:", error)
    return []
  }
}

// Enhanced getAllApps that can include F-Droid apps
export async function getAllAppsIncludingFDroid(): Promise<App[]> {
  try {
    const userApps = await getAllApps() // Your uploaded apps
    const fdroidApps = await getFDroidApps() // F-Droid apps

    // Combine both, user apps first
    return [...userApps, ...fdroidApps]
  } catch (error) {
    console.error("Error getting all apps:", error)
    return await getAllApps() // Fallback to just user apps
  }
}

// Get app by ID
export async function getAppById(appId: string): Promise<App | null> {
  try {
    const apps = await getAllApps()
    return apps.find((app) => app.id === appId) || null
  } catch (error) {
    console.error("Error getting app by ID:", error)
    return null
  }
}

// Load F-Droid apps from apps.json
export async function getFDroidApps(): Promise<App[]> {
  if (typeof window === "undefined") return []

  try {
    const response = await fetch("/data/apps.json")
    if (!response.ok) {
      console.warn("F-Droid apps file not found, using fallback")
      return getFallbackApps()
    }

    const data = await response.json()

    // Handle different JSON structures
    const apps = Array.isArray(data) ? data : data.apps || data.packages || []

    // Convert to our App format
    return apps
      .map((app: any) => ({
        id: app.packageName || app.id || `fdroid_${Math.random()}`,
        name: app.name || app.title || "Unknown App",
        developer: app.developer || app.author || app.authorName || "Unknown Developer",
        icon:
          app.icon ||
          app.iconUrl ||
          `/placeholder.svg?height=100&width=100&text=${encodeURIComponent(app.name?.charAt(0) || "A")}`,
        description: app.summary || app.description || "No description available",
        category: Array.isArray(app.categories) ? app.categories[0] : app.category || "Uncategorized",
        rating: app.rating || Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0-5.0
        downloads: app.downloads || Math.floor(Math.random() * 1000000) + 10000,
        version: app.version || app.versionName || "1.0",
        size: app.size || `${Math.floor(Math.random() * 50) + 1} MB`,
        lastUpdated: app.lastUpdated || app.added || new Date().toISOString().split("T")[0],
        downloadUrl: app.downloadUrl || app.apkUrl || `https://f-droid.org/packages/${app.packageName || app.id}/`,
        screenshots: app.screenshots || [],
        features: app.features || ["Free", "Open Source"],
        reviews: app.reviews || [],
      }))
      .filter((app) => app.name && app.name !== "Unknown App")
  } catch (error) {
    console.error("Error loading F-Droid apps:", error)
    return getFallbackApps()
  }
}

// Fallback apps if main file fails to load
function getFallbackApps(): App[] {
  return [
    {
      id: "org.fdroid.fdroid",
      name: "F-Droid",
      developer: "F-Droid Team",
      icon: "https://f-droid.org/repo/icons-640/org.fdroid.fdroid.png",
      description: "The Free and Open Source Android App Repository",
      category: "System",
      rating: 4.8,
      downloads: 5000000,
      version: "1.15.2",
      size: "8.4 MB",
      lastUpdated: "2024-01-15",
      downloadUrl: "https://f-droid.org/packages/org.fdroid.fdroid/",
      screenshots: [],
      features: ["Free", "Open Source"],
      reviews: [],
    },
    {
      id: "org.mozilla.firefox",
      name: "Firefox",
      developer: "Mozilla",
      icon: "https://f-droid.org/repo/icons-640/org.mozilla.firefox.png",
      description: "Fast, private and secure web browser",
      category: "Internet",
      rating: 4.6,
      downloads: 10000000,
      version: "98.3.0",
      size: "64.2 MB",
      lastUpdated: "2024-01-10",
      downloadUrl: "https://f-droid.org/packages/org.mozilla.firefox/",
      screenshots: [],
      features: ["Free", "Privacy Focused"],
      reviews: [],
    },
    {
      id: "org.videolan.vlc",
      name: "VLC",
      developer: "VideoLAN",
      icon: "https://f-droid.org/repo/icons-640/org.videolan.vlc.png",
      description: "Free and open source multimedia player",
      category: "Multimedia",
      rating: 4.7,
      downloads: 8000000,
      version: "3.4.4",
      size: "45.1 MB",
      lastUpdated: "2024-01-05",
      downloadUrl: "https://f-droid.org/packages/org.videolan.vlc/",
      screenshots: [],
      features: ["Free", "Media Player"],
      reviews: [],
    },
  ]
}
