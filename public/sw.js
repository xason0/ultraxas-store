// Enhanced Service Worker for UltraXas Store PWA with 1TB Storage Support
const CACHE_NAME = "ultraxas-store-v4"
const STATIC_CACHE = "ultraxas-static-v4"
const DYNAMIC_CACHE = "ultraxas-dynamic-v4"
const APK_CACHE = "ultraxas-apk-v4"

// Force install prompt to show
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }

  if (event.data && event.data.type === "FORCE_INSTALL_PROMPT") {
    // Notify all clients to show install prompt
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: "SHOW_INSTALL_PROMPT",
        })
      })
    })
  }
})

// Assets to cache immediately for offline functionality
const STATIC_ASSETS = [
  "/",
  "/apps",
  "/upload",
  "/settings",
  "/manifest.json",
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
]

// Enhanced install event
self.addEventListener("install", (event) => {
  console.log("🔧 Service Worker: Installing with enhanced PWA support...")

  // Skip waiting to activate immediately
  self.skipWaiting()

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("📦 Service Worker: Caching static assets")
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log("✅ Service Worker: Installation complete")

        // Notify clients about successful installation
        return self.clients.matchAll()
      })
      .then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: "SW_INSTALLED",
            message: "Service Worker installed successfully",
          })
        })
      })
      .catch((error) => {
        console.error("❌ Service Worker: Installation failed", error)
      }),
  )
})

// Activate event - clean up old caches and setup persistent storage
self.addEventListener("activate", (event) => {
  console.log("🚀 Service Worker: Activating with persistent storage...")

  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches
        .keys()
        .then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => {
              if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== APK_CACHE) {
                console.log("🗑️ Service Worker: Deleting old cache:", cacheName)
                return caches.delete(cacheName)
              }
            }),
          )
        }),

      // Request persistent storage
      navigator.storage && navigator.storage.persist
        ? navigator.storage.persist().then((persistent) => {
            if (persistent) {
              console.log("✅ Service Worker: Persistent storage granted")
            } else {
              console.log("⚠️ Service Worker: Persistent storage denied")
            }
          })
        : Promise.resolve(),

      // Estimate storage quota
      navigator.storage && navigator.storage.estimate
        ? navigator.storage.estimate().then((estimate) => {
            console.log(`📊 Service Worker: Storage quota: ${(estimate.quota / 1024 / 1024 / 1024).toFixed(2)} GB`)
            console.log(`📊 Service Worker: Storage usage: ${(estimate.usage / 1024 / 1024).toFixed(2)} MB`)
          })
        : Promise.resolve(),
    ]).then(() => {
      console.log("✅ Service Worker: Activation complete with persistent storage")
      return self.clients.claim()
    }),
  )
})

// Fetch event - serve from cache with network fallback and APK caching
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return
  }

  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith("http")) {
    return
  }

  // Special handling for APK files
  if (event.request.url.includes(".apk") || event.request.url.includes("download")) {
    event.respondWith(handleAPKRequest(event.request))
    return
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached version if available
      if (cachedResponse) {
        console.log("📦 Service Worker: Serving from cache:", event.request.url)
        return cachedResponse
      }

      // Otherwise fetch from network
      return fetch(event.request)
        .then((response) => {
          // Don't cache if not a valid response
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }

          // Clone the response
          const responseToCache = response.clone()

          // Cache dynamic content (but not API calls or large files)
          if (
            !event.request.url.includes("/api/") &&
            !event.request.url.includes(".apk") &&
            !event.request.url.includes("blob:") &&
            event.request.url.includes(self.location.origin)
          ) {
            caches.open(DYNAMIC_CACHE).then((cache) => {
              console.log("💾 Service Worker: Caching dynamic content:", event.request.url)
              cache.put(event.request, responseToCache)
            })
          }

          return response
        })
        .catch(() => {
          // Return offline page for navigation requests
          if (event.request.mode === "navigate") {
            return caches.match("/")
          }
        })
    }),
  )
})

// Enhanced APK handling with persistent storage
async function handleAPKRequest(request) {
  try {
    console.log("📱 Service Worker: Handling APK request:", request.url)

    // Check APK cache first
    const apkCache = await caches.open(APK_CACHE)
    const cachedAPK = await apkCache.match(request)

    if (cachedAPK) {
      console.log("✅ Service Worker: Serving APK from cache")
      return cachedAPK
    }

    // Fetch from network and cache for offline access
    const response = await fetch(request)

    if (response.ok) {
      console.log("💾 Service Worker: Caching APK for offline access")
      const responseToCache = response.clone()
      await apkCache.put(request, responseToCache)
    }

    return response
  } catch (error) {
    console.error("❌ Service Worker: APK request failed:", error)

    // Try to serve from cache as fallback
    const apkCache = await caches.open(APK_CACHE)
    const cachedAPK = await apkCache.match(request)

    if (cachedAPK) {
      console.log("🔄 Service Worker: Serving cached APK as fallback")
      return cachedAPK
    }

    throw error
  }
}

// Handle push notifications (for future use)
self.addEventListener("push", (event) => {
  console.log("🔔 Service Worker: Push notification received")

  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body || "New app available for download!",
      icon: "/android-chrome-192x192.png",
      badge: "/android-chrome-192x192.png",
      vibrate: [200, 100, 200],
      data: {
        url: data.url || "/",
        timestamp: Date.now(),
      },
      actions: [
        {
          action: "open",
          title: "Open Store",
          icon: "/android-chrome-192x192.png",
        },
        {
          action: "download",
          title: "Download Now",
          icon: "/android-chrome-192x192.png",
        },
        {
          action: "close",
          title: "Close",
          icon: "/android-chrome-192x192.png",
        },
      ],
    }

    event.waitUntil(self.registration.showNotification(data.title || "UltraXas Store", options))
  }
})

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  console.log("👆 Service Worker: Notification clicked")

  event.notification.close()

  if (event.action === "close") {
    return
  }

  const urlToOpen = event.notification.data?.url || "/"

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url.includes(urlToOpen) && "focus" in client) {
          return client.focus()
        }
      }

      // Open new window if app is not open
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen)
      }
    }),
  )
})

// Send message to clients when service worker updates
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    console.log("⏭️ Service Worker: Skipping waiting...")
    self.skipWaiting()
  }

  if (event.data && event.data.type === "CACHE_APK") {
    console.log("📱 Service Worker: Caching APK file...")
    const { url, appName } = event.data

    caches
      .open(APK_CACHE)
      .then((cache) => {
        return cache.add(url)
      })
      .then(() => {
        console.log(`✅ Service Worker: APK cached for ${appName}`)
      })
      .catch((error) => {
        console.error("❌ Service Worker: Failed to cache APK:", error)
      })
  }
})

// Periodic background sync for app updates
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    console.log("🔄 Service Worker: Background sync triggered")
    event.waitUntil(syncAppData())
  }
})

async function syncAppData() {
  try {
    console.log("📊 Service Worker: Syncing app data...")

    // Check for app updates
    const response = await fetch("/api/apps/check-updates")
    if (response.ok) {
      const updates = await response.json()

      if (updates.length > 0) {
        console.log(`🆕 Service Worker: ${updates.length} app updates available`)

        // Show notification about updates
        self.registration.showNotification("UltraXas Store Updates", {
          body: `${updates.length} app updates are available`,
          icon: "/android-chrome-192x192.png",
          badge: "/android-chrome-192x192.png",
          tag: "app-updates",
          data: { url: "/apps" },
        })
      }
    }
  } catch (error) {
    console.error("❌ Service Worker: Sync failed:", error)
  }
}

console.log("🎉 Service Worker: Loaded successfully with 1TB storage support and offline APK access")
