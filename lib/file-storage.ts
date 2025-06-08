// Enhanced file storage system using IndexedDB for persistent APK storage
interface StoredFile {
  id: string
  name: string
  type: string
  size: number
  data: ArrayBuffer
  uploadDate: string
  checksum?: string
}

interface App {
  id: string
  name: string
}

interface AppWithFile extends App {
  apkFileId?: string
  hasApkFile?: boolean
}

class FileStorageManager {
  private dbName = "UltraXasFileStorage"
  private dbVersion = 1
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create object stores
        if (!db.objectStoreNames.contains("files")) {
          const fileStore = db.createObjectStore("files", { keyPath: "id" })
          fileStore.createIndex("name", "name", { unique: false })
          fileStore.createIndex("uploadDate", "uploadDate", { unique: false })
        }

        if (!db.objectStoreNames.contains("apps")) {
          const appStore = db.createObjectStore("apps", { keyPath: "id" })
          appStore.createIndex("name", "name", { unique: false })
          appStore.createIndex("uploadDate", "uploadDate", { unique: false })
        }

        if (!db.objectStoreNames.contains("metadata")) {
          db.createObjectStore("metadata", { keyPath: "key" })
        }
      }
    })
  }

  async storeFile(file: File, appId: string): Promise<string> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = async () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer
          const fileId = `${appId}_${Date.now()}`

          // Calculate simple checksum for integrity
          const checksum = await this.calculateChecksum(arrayBuffer)

          const storedFile: StoredFile = {
            id: fileId,
            name: file.name,
            type: file.type,
            size: file.size,
            data: arrayBuffer,
            uploadDate: new Date().toISOString(),
            checksum,
          }

          const transaction = this.db!.transaction(["files"], "readwrite")
          const store = transaction.objectStore("files")
          const request = store.add(storedFile)

          request.onsuccess = () => resolve(fileId)
          request.onerror = () => reject(request.error)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = () => reject(reader.error)
      reader.readAsArrayBuffer(file)
    })
  }

  async getFile(fileId: string): Promise<StoredFile | null> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["files"], "readonly")
      const store = transaction.objectStore("files")
      const request = store.get(fileId)

      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  }

  async deleteFile(fileId: string): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["files"], "readwrite")
      const store = transaction.objectStore("files")
      const request = store.delete(fileId)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getAllFiles(): Promise<StoredFile[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["files"], "readonly")
      const store = transaction.objectStore("files")
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async getStorageStats(): Promise<{ totalFiles: number; totalSize: number; usedSpace: string }> {
    const files = await this.getAllFiles()
    const totalFiles = files.length
    const totalSize = files.reduce((sum, file) => sum + file.size, 0)
    const usedSpace = this.formatFileSize(totalSize)

    return { totalFiles, totalSize, usedSpace }
  }

  private async calculateChecksum(arrayBuffer: ArrayBuffer): Promise<string> {
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .substring(0, 16)
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  async createDownloadUrl(fileId: string): Promise<string | null> {
    try {
      const storedFile = await this.getFile(fileId)
      if (!storedFile) return null

      const blob = new Blob([storedFile.data], { type: storedFile.type })
      return URL.createObjectURL(blob)
    } catch (error) {
      console.error("Error creating download URL:", error)
      return null
    }
  }

  async verifyFileIntegrity(fileId: string): Promise<boolean> {
    try {
      const storedFile = await this.getFile(fileId)
      if (!storedFile) return false

      const currentChecksum = await this.calculateChecksum(storedFile.data)
      return currentChecksum === storedFile.checksum
    } catch (error) {
      console.error("Error verifying file integrity:", error)
      return false
    }
  }
}

export const fileStorage = new FileStorageManager()
