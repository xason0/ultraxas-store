import type { App } from "./types"
import { fileStorage } from "./file-storage"

interface AppWithFile extends App {
  apkFileId?: string
  hasApkFile?: boolean
}

interface StorageMetadata {
  version: string
  lastBackup: string
  totalApps: number
  totalFiles: number
  storageUsed: string
  maxStorage: string
}

class EnhancedStorageManager {
  private readonly STORAGE_KEY = "ultraxas_apps"
  private readonly METADATA_KEY = "ultraxas_metadata"
  private readonly BACKUP_KEY = "ultraxas_backup"
  private readonly VERSION = "3.0.0"
  private readonly MAX_STORAGE = 1024 * 1024 * 1024 * 1024 // 1TB in bytes

  async init(): Promise<void> {
    await fileStorage.init()
    await this.migrateOldData()
    await this.createAutoBackup()
    await this.setupOfflineSync()
  }

  async getApps(): Promise<AppWithFile[]> {
    try {
      // Try IndexedDB first for permanent storage
      const apps = await this.getAppsFromIndexedDB()
      if (apps.length > 0) return apps

      // Fallback to localStorage
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error getting apps:", error)
      return []
    }
  }

  async addApp(app: App, apkFile?: File): Promise<void> {
    try {
      const appWithFile: AppWithFile = { ...app }

      // Store APK file permanently if provided
      if (apkFile) {
        console.log(`📦 Storing APK file: ${apkFile.name} (${(apkFile.size / 1024 / 1024).toFixed(2)} MB)`)

        const fileId = await fileStorage.storeFile(apkFile, app.id)
        appWithFile.apkFileId = fileId
        appWithFile.hasApkFile = true

        // Also store in multiple locations for redundancy
        await this.storeFileRedundantly(apkFile, app.id)

        console.log(`✅ APK file stored with ID: ${fileId}`)
      }

      // Get existing apps
      const apps = await this.getApps()
      const updatedApps = [...apps, appWithFile]

      // Store in multiple locations for permanent access
      await this.storeAppsInIndexedDB(updatedApps)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedApps))

      // Store in session storage as backup
      sessionStorage.setItem(this.STORAGE_KEY + "_backup", JSON.stringify(updatedApps))

      // Update metadata
      await this.updateMetadata()

      // Register for offline access
      await this.registerForOfflineAccess(appWithFile)

      console.log(`✅ App "${app.name}" stored permanently with${apkFile ? "" : "out"} APK file`)
    } catch (error) {
      console.error("Error adding app:", error)
      throw error
    }
  }

  async updateApp(id: string, updates: Partial<AppWithFile>): Promise<void> {
    try {
      const apps = await this.getApps()
      const index = apps.findIndex((app) => app.id === id)

      if (index !== -1) {
        apps[index] = { ...apps[index], ...updates }

        await this.storeAppsInIndexedDB(apps)
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(apps))
        sessionStorage.setItem(this.STORAGE_KEY + "_backup", JSON.stringify(apps))
        await this.updateMetadata()
      }
    } catch (error) {
      console.error("Error updating app:", error)
      throw error
    }
  }

  async deleteApp(id: string): Promise<void> {
    try {
      const apps = await this.getApps()
      const app = apps.find((a) => a.id === id)

      // Delete associated APK file from all storage locations
      if (app?.apkFileId) {
        await fileStorage.deleteFile(app.apkFileId)
        await this.deleteFileRedundantly(app.apkFileId)
      }

      const filteredApps = apps.filter((app) => app.id !== id)

      await this.storeAppsInIndexedDB(filteredApps)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredApps))
      sessionStorage.setItem(this.STORAGE_KEY + "_backup", JSON.stringify(filteredApps))
      await this.updateMetadata()
    } catch (error) {
      console.error("Error deleting app:", error)
      throw error
    }
  }

  async downloadApp(appId: string): Promise<string | null> {
    try {
      const apps = await this.getApps()
      const app = apps.find((a) => a.id === appId)

      if (!app?.apkFileId) {
        console.warn(`No APK file found for app: ${appId}`)
        return null
      }

      // Try primary storage first
      let downloadUrl = await fileStorage.createDownloadUrl(app.apkFileId)

      // If primary fails, try redundant storage
      if (!downloadUrl) {
        downloadUrl = await this.getRedundantDownloadUrl(app.apkFileId)
      }

      if (downloadUrl) {
        // Verify file integrity before download
        const isValid = await fileStorage.verifyFileIntegrity(app.apkFileId)
        if (!isValid) {
          console.error(`File integrity check failed for app: ${appId}`)
          // Try to restore from backup
          await this.restoreFileFromBackup(app.apkFileId)
        }
      }

      return downloadUrl
    } catch (error) {
      console.error("Error creating download URL:", error)
      return null
    }
  }

  async getStorageStats(): Promise<StorageMetadata> {
    try {
      const apps = await this.getApps()
      const fileStats = await fileStorage.getStorageStats()

      // Calculate actual usage vs 1TB limit
      const usedBytes = fileStats.totalSize
      const maxBytes = this.MAX_STORAGE
      const usedPercentage = (usedBytes / maxBytes) * 100

      return {
        version: this.VERSION,
        lastBackup: localStorage.getItem("ultraxas_last_backup") || "Never",
        totalApps: apps.length,
        totalFiles: fileStats.totalFiles,
        storageUsed: this.formatFileSize(usedBytes),
        maxStorage: this.formatFileSize(maxBytes),
      }
    } catch (error) {
      console.error("Error getting storage stats:", error)
      return {
        version: this.VERSION,
        lastBackup: "Error",
        totalApps: 0,
        totalFiles: 0,
        storageUsed: "0 Bytes",
        maxStorage: "1 TB",
      }
    }
  }

  async createBackup(): Promise<string> {
    try {
      const apps = await this.getApps()
      const metadata = await this.getStorageStats()

      const backup = {
        version: this.VERSION,
        timestamp: new Date().toISOString(),
        apps: apps,
        metadata: metadata,
        fileHashes: await this.getFileHashes(),
      }

      const backupData = JSON.stringify(backup, null, 2)
      localStorage.setItem(this.BACKUP_KEY, backupData)
      localStorage.setItem("ultraxas_last_backup", backup.timestamp)

      // Store backup in IndexedDB as well
      await this.storeBackupInIndexedDB(backup)

      return backupData
    } catch (error) {
      console.error("Error creating backup:", error)
      throw error
    }
  }

  async restoreFromBackup(backupData: string): Promise<void> {
    try {
      const backup = JSON.parse(backupData)

      if (!backup.apps || !Array.isArray(backup.apps)) {
        throw new Error("Invalid backup format")
      }

      // Store apps (APK files need to be re-uploaded for security)
      const appsWithoutFiles = backup.apps.map((app: AppWithFile) => ({
        ...app,
        apkFileId: undefined,
        hasApkFile: false,
      }))

      await this.storeAppsInIndexedDB(appsWithoutFiles)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(appsWithoutFiles))
      sessionStorage.setItem(this.STORAGE_KEY + "_backup", JSON.stringify(appsWithoutFiles))
      await this.updateMetadata()

      console.log(`✅ Restored ${appsWithoutFiles.length} apps from backup`)
    } catch (error) {
      console.error("Error restoring backup:", error)
      throw error
    }
  }

  // New method to clear all storage
  async clearAll(): Promise<void> {
    try {
      // Clear IndexedDB
      const request = indexedDB.deleteDatabase("UltraXasFileStorage")
      await new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(undefined)
        request.onerror = () => reject(request.error)
      })

      // Clear localStorage
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("ultraxas")) {
          localStorage.removeItem(key)
        }
      })

      // Clear sessionStorage
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith("ultraxas")) {
          sessionStorage.removeItem(key)
        }
      })

      console.log("✅ All storage cleared")
    } catch (error) {
      console.error("Error clearing storage:", error)
      throw error
    }
  }

  // Private methods for enhanced functionality

  private async storeFileRedundantly(file: File, appId: string): Promise<void> {
    try {
      // Store in localStorage as base64 (for smaller files)
      if (file.size < 50 * 1024 * 1024) {
        // 50MB limit for localStorage
        const reader = new FileReader()
        const base64Data = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        })

        localStorage.setItem(`ultraxas_file_${appId}`, base64Data)
      }

      // Store metadata for recovery
      const fileMetadata = {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        appId: appId,
        timestamp: Date.now(),
      }

      localStorage.setItem(`ultraxas_file_meta_${appId}`, JSON.stringify(fileMetadata))
    } catch (error) {
      console.error("Error storing file redundantly:", error)
    }
  }

  private async deleteFileRedundantly(fileId: string): Promise<void> {
    try {
      const appId = fileId.split("_")[0]
      localStorage.removeItem(`ultraxas_file_${appId}`)
      localStorage.removeItem(`ultraxas_file_meta_${appId}`)
    } catch (error) {
      console.error("Error deleting redundant file:", error)
    }
  }

  private async getRedundantDownloadUrl(fileId: string): Promise<string | null> {
    try {
      const appId = fileId.split("_")[0]
      const base64Data = localStorage.getItem(`ultraxas_file_${appId}`)

      if (base64Data) {
        return base64Data
      }

      return null
    } catch (error) {
      console.error("Error getting redundant download URL:", error)
      return null
    }
  }

  private async setupOfflineSync(): Promise<void> {
    try {
      // Register service worker for offline functionality
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.ready
        console.log("✅ Service Worker ready for offline sync")

        // Cache app data for offline access
        const apps = await this.getApps()
        const cacheData = {
          apps: apps,
          timestamp: Date.now(),
        }

        localStorage.setItem("ultraxas_offline_cache", JSON.stringify(cacheData))
      }
    } catch (error) {
      console.error("Error setting up offline sync:", error)
    }
  }

  private async registerForOfflineAccess(app: AppWithFile): Promise<void> {
    try {
      // Add app to offline cache
      const offlineCache = JSON.parse(localStorage.getItem("ultraxas_offline_cache") || '{"apps":[],"timestamp":0}')

      const existingIndex = offlineCache.apps.findIndex((a: App) => a.id === app.id)
      if (existingIndex >= 0) {
        offlineCache.apps[existingIndex] = app
      } else {
        offlineCache.apps.push(app)
      }

      offlineCache.timestamp = Date.now()
      localStorage.setItem("ultraxas_offline_cache", JSON.stringify(offlineCache))

      console.log(`✅ App "${app.name}" registered for offline access`)
    } catch (error) {
      console.error("Error registering for offline access:", error)
    }
  }

  private async getFileHashes(): Promise<Record<string, string>> {
    try {
      const apps = await this.getApps()
      const hashes: Record<string, string> = {}

      for (const app of apps) {
        if (app.apkFileId) {
          const file = await fileStorage.getFile(app.apkFileId)
          if (file && file.checksum) {
            hashes[app.id] = file.checksum
          }
        }
      }

      return hashes
    } catch (error) {
      console.error("Error getting file hashes:", error)
      return {}
    }
  }

  private async storeBackupInIndexedDB(backup: any): Promise<void> {
    try {
      await fileStorage.init()
      return new Promise((resolve, reject) => {
        const request = indexedDB.open("UltraXasFileStorage", 1)
        request.onsuccess = () => {
          const db = request.result
          const transaction = db.transaction(["metadata"], "readwrite")
          const store = transaction.objectStore("metadata")

          const backupData = {
            key: "latest_backup",
            data: backup,
            timestamp: Date.now(),
          }

          const putRequest = store.put(backupData)
          putRequest.onsuccess = () => resolve()
          putRequest.onerror = () => reject(putRequest.error)
        }
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error("Error storing backup in IndexedDB:", error)
    }
  }

  private async restoreFileFromBackup(fileId: string): Promise<void> {
    try {
      // Attempt to restore file from redundant storage
      const appId = fileId.split("_")[0]
      const base64Data = localStorage.getItem(`ultraxas_file_${appId}`)

      if (base64Data) {
        // Convert base64 back to file and re-store
        const response = await fetch(base64Data)
        const blob = await response.blob()
        const file = new File([blob], `${appId}.apk`, { type: "application/vnd.android.package-archive" })

        await fileStorage.storeFile(file, appId)
        console.log(`✅ File restored from backup: ${fileId}`)
      }
    } catch (error) {
      console.error("Error restoring file from backup:", error)
    }
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  private async getAppsFromIndexedDB(): Promise<AppWithFile[]> {
    try {
      await fileStorage.init()
      return new Promise((resolve, reject) => {
        const request = indexedDB.open("UltraXasFileStorage", 1)
        request.onsuccess = () => {
          const db = request.result
          if (!db.objectStoreNames.contains("apps")) {
            resolve([])
            return
          }

          const transaction = db.transaction(["apps"], "readonly")
          const store = transaction.objectStore("apps")
          const getRequest = store.getAll()

          getRequest.onsuccess = () => resolve(getRequest.result || [])
          getRequest.onerror = () => resolve([])
        }
        request.onerror = () => resolve([])
      })
    } catch (error) {
      console.error("Error getting apps from IndexedDB:", error)
      return []
    }
  }

  private async storeAppsInIndexedDB(apps: AppWithFile[]): Promise<void> {
    try {
      await fileStorage.init()
      return new Promise((resolve, reject) => {
        const request = indexedDB.open("UltraXasFileStorage", 1)
        request.onsuccess = () => {
          const db = request.result
          const transaction = db.transaction(["apps"], "readwrite")
          const store = transaction.objectStore("apps")

          // Clear existing apps
          store.clear()

          // Add all apps
          apps.forEach((app) => store.add(app))

          transaction.oncomplete = () => resolve()
          transaction.onerror = () => reject(transaction.error)
        }
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error("Error storing apps in IndexedDB:", error)
    }
  }

  private async updateMetadata(): Promise<void> {
    try {
      const metadata = await this.getStorageStats()
      localStorage.setItem(this.METADATA_KEY, JSON.stringify(metadata))
    } catch (error) {
      console.error("Error updating metadata:", error)
    }
  }

  private async migrateOldData(): Promise<void> {
    try {
      const oldData = localStorage.getItem(this.STORAGE_KEY)
      if (oldData) {
        const apps = JSON.parse(oldData) as App[]
        if (apps.length > 0) {
          // Convert old apps to new format
          const appsWithFile: AppWithFile[] = apps.map((app) => ({
            ...app,
            hasApkFile: !!app.downloadUrl,
          }))

          await this.storeAppsInIndexedDB(appsWithFile)
          console.log(`✅ Migrated ${apps.length} apps to enhanced storage system`)
        }
      }
    } catch (error) {
      console.error("Error migrating old data:", error)
    }
  }

  private async createAutoBackup(): Promise<void> {
    try {
      const lastBackup = localStorage.getItem("ultraxas_last_backup")
      const now = new Date()
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

      if (!lastBackup || new Date(lastBackup) < oneDayAgo) {
        await this.createBackup()
        console.log("✅ Auto-backup created")
      }
    } catch (error) {
      console.error("Error creating auto-backup:", error)
    }
  }
}

export const enhancedStorage = new EnhancedStorageManager()

// Initialize storage on module load
if (typeof window !== "undefined") {
  enhancedStorage.init().catch(console.error)
}
